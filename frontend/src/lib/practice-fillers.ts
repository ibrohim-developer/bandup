/**
 * The pre-generated filler reaction clips (see scripts/generate-practice-fillers.ts).
 *
 * Played the instant an utterance closes, while the turn request is still in
 * flight — the learner hears an immediate human-like acknowledgement instead of
 * dead air. Static files, so a filler costs nothing.
 */

export const FILLER_URLS = [
  "/practice-fillers/filler-01.wav",
  "/practice-fillers/filler-02.wav",
  "/practice-fillers/filler-03.wav",
  "/practice-fillers/filler-04.wav",
  "/practice-fillers/filler-05.wav",
  "/practice-fillers/filler-06.wav",
  "/practice-fillers/filler-07.wav",
  "/practice-fillers/filler-08.wav",
] as const;

/**
 * Pick a random filler, never repeating the previous one — hearing "Mm-hmm…"
 * twice in a row breaks the illusion instantly.
 */
export function pickFiller(lastIndex: number | null): { url: string; index: number } {
  let index = Math.floor(Math.random() * FILLER_URLS.length);
  if (lastIndex !== null && FILLER_URLS.length > 1 && index === lastIndex) {
    index = (index + 1) % FILLER_URLS.length;
  }
  return { url: FILLER_URLS[index], index };
}
