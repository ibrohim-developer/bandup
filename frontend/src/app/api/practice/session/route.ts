import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find, findOne, create, update } from "@/lib/strapi/api";
import {
  checkPracticeQuota,
  practiceQuotaExceededBody,
  MIN_SECONDS_TO_START,
} from "@/lib/practice-quota";
import { PRACTICE_ENABLED } from "@/lib/feature-flags";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The opening audio lives on Strapi, which serves WAV as `audio/wave` (Chrome
 * won't play it under nosniff) and on a different origin. Route relative Strapi
 * paths through our same-origin proxy (`/api/practice/audio`), which relabels
 * the MIME. Already-absolute URLs (S3/CDN in prod) are handed back as-is.
 */
function openingAudioProxyUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (!url.startsWith("/")) return url;
  return `/api/practice/audio?path=${encodeURIComponent(url)}`;
}

/** Start a practice conversation on a given prompt. */
export async function POST(request: NextRequest) {
  if (!PRACTICE_ENABLED) {
    return new Response("Not found", { status: 404 });
  }
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { promptId } = (await request.json()) as { promptId?: string };
  if (!promptId) {
    return NextResponse.json({ error: "promptId is required" }, { status: 400 });
  }

  // Require enough allowance for a turn or two — starting a session the user
  // can't actually use just wastes the opening TTS and looks broken.
  const { allowed, status } = await checkPracticeQuota(user, MIN_SECONDS_TO_START);
  if (!allowed) {
    return NextResponse.json(practiceQuotaExceededBody(status), { status: 402 });
  }

  const prompt = await findOne("practice-prompts", promptId, {
    populate: ["opening_audio"],
  });
  if (!prompt || prompt.is_active === false) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  // Abandon any session the user left hanging, so "active" stays unique and
  // the history list doesn't fill with half-finished rows.
  const stale = await find("practice-sessions", {
    filters: { user: { id: { $eq: user.id } }, status: { $eq: "active" } },
    fields: ["documentId"],
  });
  await Promise.all(
    (stale ?? []).map((s: any) =>
      update("practice-sessions", s.documentId, {
        status: "abandoned",
        ended_at: new Date().toISOString(),
      })
    )
  );

  const session = await create("practice-sessions", {
    user: user.id,
    practice_prompt: prompt.id,
    started_at: new Date().toISOString(),
    spoken_seconds: 0,
    turn_count: 0,
    // The opening question is turn 0 — it seeds the model's history so it
    // never re-asks what it just asked.
    transcript: [{ role: "assistant", text: prompt.opening_question }],
    status: "active",
  });

  return NextResponse.json({
    sessionId: session.documentId,
    prompt: {
      title: prompt.title,
      openingQuestion: prompt.opening_question,
      difficulty: prompt.difficulty,
      openingAudioUrl: openingAudioProxyUrl(prompt.opening_audio?.url),
    },
    quota: status,
  });
}

/** End a practice conversation. */
export async function PATCH(request: NextRequest) {
  if (!PRACTICE_ENABLED) {
    return new Response("Not found", { status: 404 });
  }
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = (await request.json()) as { sessionId?: string };
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const session = await findOne("practice-sessions", sessionId, { populate: ["user"] });
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (session.user?.id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (session.status === "active") {
    await update("practice-sessions", sessionId, {
      status: "completed",
      ended_at: new Date().toISOString(),
    });
  }

  const transcript = Array.isArray(session.transcript) ? session.transcript : [];
  const corrections = transcript.flatMap((t: any) =>
    Array.isArray(t.corrections) ? t.corrections : []
  );

  return NextResponse.json({
    sessionId,
    spokenSeconds: session.spoken_seconds ?? 0,
    turnCount: session.turn_count ?? 0,
    correctionCount: corrections.length,
    transcript,
  });
}
