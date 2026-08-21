/**
 * End-of-session statistics for speaking practice, computed from the session
 * transcript — no extra AI call, no cost. Client-safe and pure.
 */

export interface TranscriptTurn {
  role: "assistant" | "user";
  text: string;
  corrections?: unknown[];
}

export interface SessionStats {
  /** Words the learner spoke, across all their turns. */
  totalWords: number;
  /** Learner words per minute of billed speaking time. */
  wpm: number;
  /** Hesitation fillers ("um", "uh", "er", "you know") in learner speech. */
  fillerCount: number;
  /** Word count of the learner's longest single turn. */
  longestTurnWords: number;
  /** Distinct words used by the learner (case- and punctuation-insensitive). */
  uniqueWords: number;
  /** Grammar corrections collected across the session. */
  correctionCount: number;
}

// "like" is deliberately excluded — it's a filler sometimes, a real verb or
// preposition just as often, and false accusations undermine trust in the stat.
const FILLER_REGEX = /\b(?:um+|uh+|er+|erm)\b|\byou know\b/gi;

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function computeSessionStats(
  transcript: TranscriptTurn[],
  spokenSeconds: number
): SessionStats {
  const userTurns = transcript.filter((t) => t.role === "user" && typeof t.text === "string");

  let totalWords = 0;
  let longestTurnWords = 0;
  let fillerCount = 0;
  const unique = new Set<string>();

  for (const turn of userTurns) {
    const w = words(turn.text);
    totalWords += w.length;
    longestTurnWords = Math.max(longestTurnWords, w.length);
    for (const word of w) unique.add(word);
    fillerCount += turn.text.match(FILLER_REGEX)?.length ?? 0;
  }

  const correctionCount = transcript.reduce(
    (n, t) => n + (Array.isArray(t.corrections) ? t.corrections.length : 0),
    0
  );

  return {
    totalWords,
    wpm: spokenSeconds > 0 ? Math.round(totalWords / (spokenSeconds / 60)) : 0,
    fillerCount,
    longestTurnWords,
    uniqueWords: unique.size,
    correctionCount,
  };
}
