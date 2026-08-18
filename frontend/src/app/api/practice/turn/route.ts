import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, findOne, update } from "@/lib/strapi/api";
import {
  transcribeUtterance,
  converseAndCorrect,
  type PracticeTurn,
} from "@/lib/practice-conversation";
import { checkPracticeQuota, practiceQuotaExceededBody } from "@/lib/practice-quota";
import { measureSpokenSeconds, getOggOpusDurationSeconds } from "@/lib/ogg-duration";
import { MAX_UTTERANCE_SECONDS, MIN_UTTERANCE_SECONDS } from "@/lib/practice-limits";
import { synthesizeSpeech } from "@/lib/tts";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const maxDuration = 60;

// One utterance — a single long-turn answer at most. Opus voice at 48kHz mono
// runs ~12KB/s, so even 130s of speech (~1.6MB) fits under 2MB.
const MAX_REQUEST_BYTES = 2.5 * 1024 * 1024;
const MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const MIN_AUDIO_BYTES = 2000;

// opus-recorder emits OGG-Opus on every browser (see voice-recorder.tsx), so
// unlike the speaking upload route we don't need a broad MIME allowlist here.
const ALLOWED_AUDIO_MIMES = new Set(["audio/ogg", "audio/webm"]);

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Reject oversized bodies before buffering them into memory.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Utterance too long" }, { status: 413 });
  }

  const formData = await request.formData();
  const sessionId = formData.get("sessionId");
  const file = formData.get("audio") as File | null;

  if (typeof sessionId !== "string" || !sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "No audio provided" }, { status: 400 });
  }
  if (file.size < MIN_AUDIO_BYTES) {
    return NextResponse.json({ error: "No speech detected", noSpeech: true }, { status: 200 });
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "Utterance too long" }, { status: 413 });
  }

  const baseMime = file.type.split(";")[0].trim().toLowerCase();
  if (!baseMime || !ALLOWED_AUDIO_MIMES.has(baseMime)) {
    return NextResponse.json({ error: "Unsupported audio format" }, { status: 400 });
  }

  const session = await findOne("practice-sessions", sessionId, {
    populate: ["user", "practice_prompt"],
  });
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (session.user?.id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (session.status !== "active") {
    return NextResponse.json({ error: "Session already ended" }, { status: 400 });
  }

  // Gate BEFORE the Gemini call — a refused turn must cost nothing. Mid-session
  // we only require that some allowance remains; the turn that crosses the
  // limit is allowed to finish rather than being cut off mid-sentence.
  const { allowed, status: quota } = await checkPracticeQuota(user);
  if (!allowed) {
    return NextResponse.json(practiceQuotaExceededBody(quota), { status: 402 });
  }

  const audioBuffer = Buffer.from(await file.arrayBuffer());

  // Measure BEFORE the model call. Too little audio can't be transcribed, and
  // handing an audio model near-silence plus the question it just asked is what
  // invites it to invent an answer. Refuse rather than pay for fiction.
  const measuredSeconds = getOggOpusDurationSeconds(audioBuffer);
  if (measuredSeconds !== null && measuredSeconds < MIN_UTTERANCE_SECONDS) {
    return NextResponse.json({ noSpeech: true, quota, limitReached: false });
  }

  const prompt = session.practice_prompt;
  const history: PracticeTurn[] = (Array.isArray(session.transcript) ? session.transcript : [])
    .filter((t: any) => t?.text)
    .map((t: any) => ({ role: t.role === "assistant" ? "assistant" : "user", text: t.text }));

  const context = {
    title: prompt?.title ?? "Conversation",
    openingQuestion: prompt?.opening_question ?? "",
    followUpHints: Array.isArray(prompt?.follow_up_hints) ? prompt.follow_up_hints : undefined,
    difficulty: prompt?.difficulty ?? "intermediate",
  };

  // Stream the turn as newline-delimited JSON events so the client can render
  // each stage the moment it's ready — transcript, then reply text, then voice —
  // instead of waiting ~20s for the whole thing (voice synthesis is the tail).
  const encoder = new TextEncoder();
  const turnStart = Date.now();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (obj: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

      try {
        // 1) TRANSCRIBE — context-free, so an ambiguous noise can't become an
        //    invented answer (see practice-conversation.ts).
        const transcription = await transcribeUtterance(
          audioBuffer,
          baseMime,
          context,
          history.length,
          user.id
        );
        const transcribeMs = Date.now() - turnStart;

        if (!transcription) {
          emit({ type: "error", error: "Could not process that turn" });
          return;
        }

        // Measured from the audio we received, never client-supplied. Charged
        // even on no-speech — the audio was still processed.
        const spokenSeconds = Math.min(
          measureSpokenSeconds(audioBuffer, transcription.durationEstimateSeconds),
          MAX_UTTERANCE_SECONDS
        );
        const remaining = Math.max(0, quota.remaining - spokenSeconds);
        const nextQuota = { ...quota, used: quota.used + spokenSeconds, remaining };
        const limitReached = remaining <= 0;

        // No intelligible speech → bill the audio, don't store a turn, stop.
        if (transcription.noSpeech) {
          await update("practice-sessions", sessionId, {
            spoken_seconds: (Number(session.spoken_seconds) || 0) + spokenSeconds,
          });
          emit({ type: "transcript", transcript: "", noSpeech: true });
          emit({ type: "done", quota: nextQuota, limitReached });
          console.log(
            `[practice-timing] transcribe=${transcribeMs}ms noSpeech=true total=${Date.now() - turnStart}ms`
          );
          return;
        }

        // The learner's words are ready — show them immediately.
        emit({ type: "transcript", transcript: transcription.transcript, noSpeech: false });

        // 2) CONVERSE — text-only reply + corrections.
        const converseStart = Date.now();
        const { reply, corrections } = await converseAndCorrect(
          transcription.transcript,
          context,
          history,
          user.id
        );
        const converseMs = Date.now() - converseStart;

        // The reply TEXT is ready — this is what the learner reads while the
        // voice is still synthesizing. It's the whole point of streaming.
        emit({ type: "reply", reply, corrections, quota: nextQuota, limitReached });

        // Persist and synthesize in parallel — the DB write must finish before
        // we close, but the client doesn't wait on it.
        const persist = update("practice-sessions", sessionId, {
          transcript: [
            ...(Array.isArray(session.transcript) ? session.transcript : []),
            { role: "user", text: transcription.transcript, corrections },
            ...(reply ? [{ role: "assistant", text: reply }] : []),
          ],
          spoken_seconds: (Number(session.spoken_seconds) || 0) + spokenSeconds,
          turn_count: (Number(session.turn_count) || 0) + 1,
        }).catch((e) => console.error("[practice] persist failed:", e));

        // 3) VOICE — the slow tail. Arrives last; text is already on screen.
        const ttsStart = Date.now();
        const replyAudio = reply ? await synthesizeSpeech(reply, user.id) : null;
        const ttsMs = Date.now() - ttsStart;
        if (replyAudio) emit({ type: "audio", replyAudio });

        await persist;
        emit({ type: "done", quota: nextQuota, limitReached });

        console.log(
          `[practice-timing] transcribe=${transcribeMs}ms converse=${converseMs}ms ` +
            `tts=${ttsMs}ms total=${Date.now() - turnStart}ms noSpeech=false`
        );
      } catch (error) {
        console.error("[practice] turn stream failed:", error);
        emit({ type: "error", error: "Could not process that turn" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      // Defeat proxy buffering so events actually flush incrementally.
      "X-Accel-Buffering": "no",
    },
  });
}
