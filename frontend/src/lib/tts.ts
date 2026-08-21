import { vertexAI } from "./gemini";
import { logAIUsage } from "./ai-usage";

/**
 * Text-to-speech for the AI practice partner's spoken replies.
 *
 * TTS output is the single largest line item in a practice session — audio
 * output tokens bill far higher than the text the model reasons with. Two
 * consequences baked into the design:
 *
 *  1. Fixed content (prompt opening questions) is synthesized ONCE by
 *     `scripts/seed-practice-prompts.ts` and stored on the content type.
 *     Only dynamic replies come through here.
 *  2. Replies are capped at 2 sentences by the conversation prompt, which caps
 *     spend and keeps the learner talking rather than listening.
 *
 * Audio is returned inline as a data URI and never persisted — a spoken reply
 * has no value once the turn is over, and storing it would add storage cost
 * plus a retention question for voice data.
 */

const TTS_MODEL = "gemini-2.5-flash-preview-tts";

/** Warm, unhurried voice — a conversation partner, not a newsreader. */
const VOICE_NAME = "Aoede";

const MAX_TTS_CHARS = 400;

export interface SynthesizedSpeech {
  /** `data:audio/...;base64,...` — playable directly by an <audio> element. */
  dataUri: string;
  mimeType: string;
}

/**
 * Vertex returns raw PCM for TTS (typically 24kHz signed 16-bit LE mono), which
 * browsers cannot play as a bare blob. Wrapping it in a 44-byte WAV header makes
 * it playable with no client-side decoding.
 */
function pcmToWav(pcm: Buffer, sampleRate: number, channels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // format = PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

/** Pull the sample rate out of a Vertex audio mime like `audio/L16;rate=24000`. */
function parseSampleRate(mimeType: string | undefined, fallback = 24000): number {
  const match = /rate=(\d+)/.exec(mimeType ?? "");
  const rate = match ? Number(match[1]) : NaN;
  return Number.isFinite(rate) && rate > 0 ? rate : fallback;
}

export async function synthesizeSpeech(
  text: string,
  userId?: number | string | null
): Promise<SynthesizedSpeech | null> {
  const clean = text.trim();
  if (!clean) return null;

  // A reply longer than this means the conversation prompt's 2-sentence cap
  // failed. Truncate rather than pay for an unbounded monologue.
  const input = clean.length > MAX_TTS_CHARS ? `${clean.slice(0, MAX_TTS_CHARS)}…` : clean;

  try {
    const result = await vertexAI.models.generateContent({
      model: TTS_MODEL,
      contents: [{ role: "user", parts: [{ text: input }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_NAME } },
        },
      },
    });

    const part = result.candidates?.[0]?.content?.parts?.[0];
    const data = part?.inlineData?.data;
    if (!data) {
      await logAIUsage({
        userId: userId ?? null,
        module: "practice-tts",
        model: "gemini-2.5-flash-tts",
        usage: result.usageMetadata,
        success: false,
        context: { chars: input.length },
      });
      return null;
    }

    const mimeType = part?.inlineData?.mimeType ?? "audio/L16;rate=24000";
    const raw = Buffer.from(data, "base64");

    // Already-containerised audio passes through; raw PCM needs a WAV header.
    const isPcm = /^audio\/(L16|pcm)/i.test(mimeType);
    const out = isPcm ? pcmToWav(raw, parseSampleRate(mimeType)) : raw;
    const outMime = isPcm ? "audio/wav" : mimeType.split(";")[0];

    await logAIUsage({
      userId: userId ?? null,
      module: "practice-tts",
      model: "gemini-2.5-flash-tts",
      usage: result.usageMetadata,
      success: true,
      context: { chars: input.length },
    });

    return {
      dataUri: `data:${outMime};base64,${out.toString("base64")}`,
      mimeType: outMime,
    };
  } catch (error) {
    // Never fail a turn over voice — the learner still gets text.
    console.error("[tts] Synthesis failed:", error);
    await logAIUsage({
      userId: userId ?? null,
      module: "practice-tts",
      model: "gemini-2.5-flash-tts",
      usage: undefined,
      success: false,
      context: { chars: input.length, error: String(error) },
    });
    return null;
  }
}
