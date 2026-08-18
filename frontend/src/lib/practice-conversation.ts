import { vertexAI, MODEL_FLASH } from "./gemini";
import { logAIUsage } from "./ai-usage";
import { MAX_UTTERANCE_SECONDS } from "./practice-limits";

/**
 * One turn of AI speaking practice, in TWO calls.
 *
 * 1. TRANSCRIBE — the audio goes to a model that sees ONLY the audio: no
 *    question, no history, no persona. This isolation is the whole point. When
 *    the two jobs shared one call, an ambiguous noise (a throat clear, a cough)
 *    plus the question the model had just asked was enough to make it invent a
 *    fluent, on-topic answer the learner never gave — and then "correct" grammar
 *    they never used. A transcriber that cannot see the question cannot answer
 *    it. Temperature 0, and coughs/breaths are declared non-speech explicitly.
 * 2. CONVERSE — a TEXT-ONLY call takes the real transcript + history and
 *    produces the reply and the grammar corrections.
 *
 * COST: the audio is sent once (call 1); call 2 is cheap text. The small extra
 * cost of a second call buys a transcript we can actually trust — the earlier
 * single-call design saved that fraction of a cent at the cost of occasionally
 * putting words in the learner's mouth, which is the worst thing this feature
 * can do. Prior turns still go in as text, never re-sent as audio.
 */

export interface PracticeCorrection {
  /** Verbatim substring of `transcript` — required so the UI can anchor it. */
  original: string;
  corrected: string;
  explanation: string;
}

export interface PracticeTurnResult {
  transcript: string;
  corrections: PracticeCorrection[];
  reply: string;
  /** Model's own estimate; only a metering fallback when the container won't parse. */
  durationEstimateSeconds: number | null;
  /** True when the learner said nothing intelligible — turn should not be stored. */
  noSpeech: boolean;
  /** Per-stage latency (ms), so the route can log where a turn's time goes. */
  timings: { transcribeMs: number; converseMs: number };
}

export interface PracticeTurn {
  role: "assistant" | "user";
  text: string;
}

export interface PracticeContext {
  title: string;
  openingQuestion: string;
  followUpHints?: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

const DIFFICULTY_GUIDANCE: Record<PracticeContext["difficulty"], string> = {
  beginner:
    "Use simple, common vocabulary and short sentences. Ask concrete questions about everyday things. Never use idioms.",
  intermediate:
    "Use natural everyday English. Ask questions that require an opinion or a short explanation, not just a fact.",
  advanced:
    "Use varied, natural English including occasional idiomatic phrasing. Ask questions that require speculation, comparison, or justification.",
};

/**
 * The transcription model sees ONLY the audio. It has no idea what was asked,
 * so it has nothing to invent toward — the structural fix for hallucinated
 * answers. Exported for unit tests.
 */
export const TRANSCRIBE_SYSTEM_PROMPT = `You are a strict speech transcriber for a language-learning app. Your ONLY job is to write down exactly what you hear in the audio. You have NO conversation context and you must never imagine any.

RULES — FOLLOW EXACTLY:
- Transcribe ONLY sounds you actually hear. You are a microphone, not an author.
- Write the speech EXACTLY as spoken: broken grammar, false starts, repetitions, fillers ("um", "uh"), unfinished sentences. Do NOT smooth, complete, correct, or make it more fluent. A transcript that reads like fluent native writing is a FAILED transcript.
- Throat clears, coughs, sighs, breaths, lip smacks, taps, background noise and silence are NOT speech. If there is no intelligible spoken language, set "no_speech": true and leave the transcript empty.
- If the audio is unclear, transcribe only the part you can actually make out. Never fill a gap with a word that "would make sense".
- If you are unsure whether you heard a word, leave it out rather than guess. An empty transcript is ALWAYS better than an invented one.
- Never guess what the person "should" be saying. You do not know what they were asked.

Output ONLY valid JSON: {"transcript": string, "no_speech": boolean, "duration_estimate_seconds": number}. No markdown, no commentary.`;

const CORRECTION_RULES = `CORRECTION RULES:
- Only flag errors that a teacher would actually bother mentioning: wrong verb form, subject-verb agreement, wrong tense, wrong preposition, missing/wrong article where it obscures meaning, word order.
- DO NOT flag: filler words ("um", "uh", "like"), self-corrections the learner already fixed themselves, contractions, informal-but-correct speech, or transcription artefacts.
- This is practice, not a red pen. 0-3 corrections per turn. Returning [] is not just acceptable, it is the correct answer for a clean turn.
- "original" MUST be an exact, verbatim substring of the transcript, at most 8 words. If you cannot quote it verbatim, omit the correction entirely.
- "explanation" must be one short sentence a B1 learner understands. Explain the rule, not just the fix.`;

const JSON_RULE = `You MUST output ONLY valid JSON matching the requested schema. No markdown, no commentary outside JSON.`;

const CASUAL_PERSONA = `You are a warm, encouraging English speaking coach. You are NOT scoring the learner. Your job is to give them rich, open-ended speaking prompts — the kind that take a minute or two to answer well — and then let them talk at length.`;

const CASUAL_CONVERSATION_RULES = `CONVERSATION RULES — GIVE PART-2-STYLE PROMPTS, THEN LISTEN:
- Each turn you give ONE substantial speaking prompt that CANNOT be answered in a sentence — like an IELTS Part 2 cue card. It should invite one to two minutes of continuous speaking.
- Build every prompt as: (a) ONE short sentence reacting warmly to what they just said, then (b) a new prompt that asks them to DESCRIBE or EXPLAIN something AND lists 2–3 specific things to cover. Example: "That sounds lovely. Now, tell me about a place you would love to visit one day — where it is, why you want to go there, and what you would do when you arrive."
- NEVER ask a quick, factual, or yes/no question. NEVER rapid-fire short follow-ups. Exactly ONE rich prompt per turn.
- Keep a coherent thread: either deepen the current topic or move to a closely related one, but ALWAYS as a full cue-card-style prompt with things to cover.
- Keep YOUR spoken part short — the reaction plus the prompt, nothing more. The learner should be doing almost all of the talking.
- If they gave only a little, that is fine — your NEXT prompt is what pulls a longer answer out of them; make it concrete and easy to picture.
- NEVER correct grammar in your spoken reply, and never mention that mistakes are being tracked. Corrections belong only in the corrections array.`;

/**
 * System prompt for the CONVERSE call. It never transcribes — it works only
 * from the transcript text it is given. Exported for unit tests.
 */
export function buildSystemPrompt(context: PracticeContext): string {
  void context;
  return `${CASUAL_PERSONA}

Your two jobs each turn:
1. Reply naturally to what they said, and keep the conversation going.
2. Silently note grammar mistakes in what they said, for a side panel they can review later.

You are given a VERBATIM transcript of the learner's speech — you do NOT transcribe audio yourself. Work only from the transcript text; never add words the learner did not say, and if the transcript is empty or nonsensical, do not invent a reply pretending they spoke.

${CASUAL_CONVERSATION_RULES}

${CORRECTION_RULES}

${JSON_RULE}`;
}

function buildHistoryBlock(history: PracticeTurn[]): string {
  if (!history.length) return "(this is the learner's first turn)";
  // Text-only history — see the cost note in the module header.
  return history
    .map((t) => `${t.role === "assistant" ? "YOU" : "LEARNER"}: ${t.text}`)
    .join("\n");
}

/** The per-turn topic briefing for the CONVERSE call. Exported for unit tests. */
export function buildTurnBriefing(context: PracticeContext): string {
  return `CONVERSATION TOPIC: ${context.title}
OPENING QUESTION YOU ASKED: ${context.openingQuestion}
LEVEL: ${context.difficulty} — ${DIFFICULTY_GUIDANCE[context.difficulty]}
${
  context.followUpHints?.length
    ? `DIRECTIONS YOU CAN STEER TOWARDS (do not read these aloud): ${context.followUpHints.join("; ")}`
    : ""
}`;
}

/** Filler-only tokens that don't constitute a real answer. */
const FILLER_ONLY = /^[\s.,!?…-]*(?:(?:um+|uh+|er+|erm|hmm+|mm+|ah+|oh+)[\s.,!?…-]*)*$/i;

/**
 * A transcript of only fillers ("uh", "mm") is not a turn worth replying to —
 * treat it as no-speech so a stray throat noise never triggers a real answer.
 * Exported for unit tests.
 */
export function isEffectivelySilent(transcript: string): boolean {
  return transcript.trim().length === 0 || FILLER_ONLY.test(transcript);
}

export interface TranscriptionResult {
  transcript: string;
  noSpeech: boolean;
  durationEstimateSeconds: number | null;
}

/** Call 1: audio-only transcription, with zero conversation context. */
export async function transcribeUtterance(
  audioBuffer: Buffer,
  audioMimeType: string,
  context: PracticeContext,
  turnIndex: number,
  userId?: number | string | null
): Promise<TranscriptionResult | null> {
  const result = await vertexAI.models.generateContent({
    model: MODEL_FLASH,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: audioMimeType, data: audioBuffer.toString("base64") } },
          {
            text: `Transcribe the audio exactly as spoken. If it contains no intelligible speech (only noise, a cough, a breath, or silence), set "no_speech": true and leave the transcript empty. Return ONLY the JSON.`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: TRANSCRIBE_SYSTEM_PROMPT,
      temperature: 0,
      responseMimeType: "application/json",
    },
  });

  const content = result.text;
  await logAIUsage({
    userId: userId ?? null,
    module: "practice",
    model: MODEL_FLASH,
    usage: result.usageMetadata,
    success: !!content,
    context: { topic: context.title, turn: turnIndex, stage: "transcribe" },
  });
  if (!content) return null;

  const parsed = JSON.parse(content);
  const transcript: string = typeof parsed.transcript === "string" ? parsed.transcript : "";

  const durationEstimate = Number(parsed.duration_estimate_seconds);
  const durationEstimateSeconds =
    Number.isFinite(durationEstimate) && durationEstimate > 0
      ? Math.min(durationEstimate, MAX_UTTERANCE_SECONDS)
      : null;

  return {
    transcript,
    durationEstimateSeconds,
    noSpeech: parsed.no_speech === true || isEffectivelySilent(transcript),
  };
}

export interface ConversationResult {
  reply: string;
  corrections: PracticeCorrection[];
}

/** Call 2: text-only reply + corrections, working from the real transcript. */
export async function converseAndCorrect(
  transcript: string,
  context: PracticeContext,
  history: PracticeTurn[],
  userId?: number | string | null
): Promise<ConversationResult> {
  const userPrompt = `${buildTurnBriefing(context)}

CONVERSATION SO FAR:
${buildHistoryBlock(history)}

The learner just replied. Here is a VERBATIM transcript of what they said (it may contain errors, fillers, or unfinished sentences — that is expected and correct):
"${transcript}"

Reply to them, and note any grammar mistakes in the transcript above.

OUTPUT JSON SCHEMA:
{
  "corrections": [
    { "original": string, "corrected": string, "explanation": string }
  ],
  "reply": "your spoken reply — max 2 sentences, ends with a question, no corrections in it"
}

- Every "original" must appear verbatim in the transcript above.

Return ONLY JSON.`;

  const result = await vertexAI.models.generateContent({
    model: MODEL_FLASH,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: buildSystemPrompt(context),
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  });

  await logAIUsage({
    userId: userId ?? null,
    module: "practice",
    model: MODEL_FLASH,
    usage: result.usageMetadata,
    success: !!result.text,
    context: { topic: context.title, turn: history.length, stage: "converse" },
  });

  const content = result.text;
  if (!content) return { reply: "", corrections: [] };

  const parsed = JSON.parse(content);

  // Drop any correction the model couldn't quote verbatim. The UI anchors these
  // onto the transcript by string match, and a highlight on the wrong words is
  // worse than no highlight — so enforce it here rather than hoping.
  const corrections: PracticeCorrection[] = Array.isArray(parsed.corrections)
    ? parsed.corrections
        .filter(
          (c: unknown): c is PracticeCorrection =>
            !!c &&
            typeof (c as PracticeCorrection).original === "string" &&
            typeof (c as PracticeCorrection).corrected === "string" &&
            typeof (c as PracticeCorrection).explanation === "string"
        )
        .filter((c: PracticeCorrection) =>
          transcript.toLowerCase().includes(c.original.toLowerCase().trim())
        )
        .slice(0, 3)
    : [];

  return {
    reply: typeof parsed.reply === "string" ? parsed.reply : "",
    corrections,
  };
}

export async function runPracticeTurn(
  audioBuffer: Buffer,
  context: PracticeContext,
  history: PracticeTurn[],
  userId?: number | string | null,
  audioMimeType: string = "audio/ogg"
): Promise<PracticeTurnResult | null> {
  try {
    const t0 = Date.now();
    const transcription = await transcribeUtterance(
      audioBuffer,
      audioMimeType,
      context,
      history.length,
      userId
    );
    const transcribeMs = Date.now() - t0;
    if (!transcription) return null;

    // No intelligible speech → stop here. Crucially, we do NOT make the
    // converse call, so the model is never given a chance to reply to (and
    // thereby invent) an answer for a turn that never happened.
    if (transcription.noSpeech) {
      return {
        transcript: "",
        corrections: [],
        reply: "",
        durationEstimateSeconds: transcription.durationEstimateSeconds,
        noSpeech: true,
        timings: { transcribeMs, converseMs: 0 },
      };
    }

    const t1 = Date.now();
    const { reply, corrections } = await converseAndCorrect(
      transcription.transcript,
      context,
      history,
      userId
    );
    const converseMs = Date.now() - t1;

    return {
      transcript: transcription.transcript,
      corrections,
      reply,
      durationEstimateSeconds: transcription.durationEstimateSeconds,
      noSpeech: false,
      timings: { transcribeMs, converseMs },
    };
  } catch (error) {
    console.error("[practice] Turn failed:", error);
    await logAIUsage({
      userId: userId ?? null,
      module: "practice",
      model: MODEL_FLASH,
      usage: undefined,
      success: false,
      context: { topic: context.title, turn: history.length, error: String(error) },
    });
    return null;
  }
}
