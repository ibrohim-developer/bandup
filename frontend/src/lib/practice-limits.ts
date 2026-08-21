/**
 * Practice allowance — client-safe constants (no server imports), so the
 * sidebar badge and practice UI can render remaining time. The server-side
 * meter in `lib/practice-quota.ts` re-exports these as its source of truth.
 *
 * Deliberately NOT part of `lib/energy.ts`. Energy pays for graded AI
 * evaluations (writing 2, speaking 4, 8/week free); practice is a separate,
 * much cheaper currency so daily conversation can never eat a free user's
 * two weekly mock evaluations.
 */

/** Free tier: 10 minutes of speech per rolling 24h. */
export const FREE_DAILY_PRACTICE_SECONDS = 600;

/** Premium fair-use: 60 minutes per rolling 24h. */
export const PREMIUM_DAILY_PRACTICE_SECONDS = 3600;

/**
 * Longest single utterance we accept. Anything beyond this is either a stuck
 * VAD or someone trying to push a long recording through the turn endpoint.
 * Sized for a long-turn answer (up to 2 minutes plus a little slack);
 * ~130s of Opus voice is ~1.6MB, under the route's 2MB cap.
 */
export const MAX_UTTERANCE_SECONDS = 130;

/**
 * Shortest utterance worth sending to the model.
 *
 * Below this there is not enough speech to transcribe, and handing an audio
 * model near-silence plus a question it just asked is what invites it to invent
 * a plausible answer. Rejecting here is both safer and cheaper than paying for
 * a call that can only produce noise or fiction.
 */
export const MIN_UTTERANCE_SECONDS = 1;

/** A session with less than this left can't fit a useful turn — start blocked. */
export const MIN_SECONDS_TO_START = 15;

export function formatPracticeTime(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}
