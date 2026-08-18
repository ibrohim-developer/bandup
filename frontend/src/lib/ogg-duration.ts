/**
 * Exact duration of an OGG-Opus buffer, read from the container itself.
 *
 * The practice meter bills seconds of speech, so the duration has to come from
 * the audio the server actually received — not from a number the client sends
 * alongside it, which a user could simply understate.
 *
 * Every OGG page carries a granule position; for Opus that is a count of 48kHz
 * samples decoded up to the end of that page. The last page's granule position
 * is therefore the stream length. We scan backwards for the final "OggS"
 * capture pattern and read it.
 *
 * The OpusHead pre-skip (typically ~6.5ms, at most a few hundred ms) is not
 * subtracted — it is far below the resolution the meter cares about.
 */

const OGG_CAPTURE = 0x4f676753; // "OggS"
const OPUS_SAMPLE_RATE = 48000;
const GRANULE_OFFSET = 6;
const MIN_PAGE_BYTES = 27; // fixed part of an OGG page header

// Built rather than written as a literal: the tsconfig target predates BigInt
// literal syntax, though the runtime supports BigInt itself.
const GRANULE_NONE = BigInt("0xFFFFFFFFFFFFFFFF");

export function getOggOpusDurationSeconds(buffer: Buffer): number | null {
  if (buffer.length < MIN_PAGE_BYTES) return null;

  // Scan backwards for the last page header. Bounded so a corrupt or non-OGG
  // buffer can't turn this into a long linear scan of a multi-MB payload.
  for (let i = buffer.length - MIN_PAGE_BYTES; i >= 0; i--) {
    if (buffer.readUInt32BE(i) !== OGG_CAPTURE) continue;

    const granule = buffer.readBigUInt64LE(i + GRANULE_OFFSET);
    // -1 marks a page that completes no packet; keep looking for a real one.
    if (granule === GRANULE_NONE) continue;

    const seconds = Number(granule) / OPUS_SAMPLE_RATE;
    if (!Number.isFinite(seconds) || seconds < 0) return null;
    return seconds;
  }

  return null;
}

/**
 * Duration for metering, with a conservative fallback.
 *
 * If the container can't be parsed (unexpected format, truncated upload), fall
 * back to the model's own estimate of the audio it heard. That is still
 * server-side — it is never a client-supplied figure. If both are unavailable
 * we charge `fallbackSeconds` so an unparseable turn is never free.
 */
export function measureSpokenSeconds(
  buffer: Buffer,
  modelEstimateSeconds?: number | null,
  fallbackSeconds: number = 10
): number {
  const exact = getOggOpusDurationSeconds(buffer);
  if (exact !== null && exact > 0) return Math.round(exact);

  const estimate = Number(modelEstimateSeconds);
  if (Number.isFinite(estimate) && estimate > 0) return Math.round(estimate);

  return fallbackSeconds;
}
