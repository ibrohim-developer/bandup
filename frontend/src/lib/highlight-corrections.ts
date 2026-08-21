/**
 * Anchors AI grammar corrections onto the transcript they came from.
 *
 * The model returns corrections as `{ original, corrected, explanation }` with no
 * character offsets, and asking for offsets gets unreliable numbers back. So we
 * locate each `original` in the transcript ourselves, matching on a normalised
 * form (case-folded, punctuation-stripped, whitespace-collapsed) so that a quote
 * like "what is you doing" still matches "What is you doing?" in the transcript.
 *
 * A highlight on the wrong words is worse than no highlight, so anything that
 * does not match cleanly is dropped and rendered in the plain corrections list
 * instead.
 */

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface TranscriptSegment {
  text: string;
  /** Present when this segment is a located mistake; null for ordinary text. */
  correction: GrammarCorrection | null;
}

export interface AnchoredTranscript {
  segments: TranscriptSegment[];
  /** Corrections we could not locate — still worth showing, just not inline. */
  unmatched: GrammarCorrection[];
}

const WORD_CHAR = /[a-z0-9']/i;

/**
 * Normalised text plus a per-character map back to indices in the source, so a
 * match found in normalised space can be projected onto the original string.
 */
function normalizeWithMap(input: string): { norm: string; map: number[] } {
  let norm = "";
  const map: number[] = [];
  let pendingSpace = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (WORD_CHAR.test(ch)) {
      if (pendingSpace) {
        if (norm.length > 0) {
          norm += " ";
          map.push(i);
        }
        pendingSpace = false;
      }
      norm += ch.toLowerCase();
      map.push(i);
    } else {
      pendingSpace = true;
    }
  }

  return { norm, map };
}

/** True when [start, end) sits on word boundaries — stops "is" matching inside "this". */
function isWholeWordMatch(norm: string, start: number, end: number): boolean {
  const before = start === 0 || norm[start - 1] === " ";
  const after = end === norm.length || norm[end] === " ";
  return before && after;
}

interface Match {
  start: number;
  end: number;
  correction: GrammarCorrection;
}

export function anchorCorrections(
  transcript: string,
  corrections: GrammarCorrection[] | undefined | null
): AnchoredTranscript {
  if (!transcript || !corrections?.length) {
    return {
      segments: transcript ? [{ text: transcript, correction: null }] : [],
      unmatched: corrections ?? [],
    };
  }

  const { norm, map } = normalizeWithMap(transcript);
  const matches: Match[] = [];
  const unmatched: GrammarCorrection[] = [];

  for (const correction of corrections) {
    const needle = normalizeWithMap(correction.original ?? "").norm;
    if (!needle) {
      unmatched.push(correction);
      continue;
    }

    // First whole-word occurrence wins. Repeated phrases are rare enough that
    // guessing a later one would be less accurate, not more.
    let found = -1;
    let from = 0;
    for (;;) {
      const at = norm.indexOf(needle, from);
      if (at === -1) break;
      if (isWholeWordMatch(norm, at, at + needle.length)) {
        found = at;
        break;
      }
      from = at + 1;
    }

    if (found === -1) {
      unmatched.push(correction);
      continue;
    }

    matches.push({
      start: map[found],
      end: map[found + needle.length - 1] + 1,
      correction,
    });
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: TranscriptSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    // Overlapping quotes would produce nested highlights; keep the earlier one
    // and demote the loser to the plain list.
    if (match.start < cursor) {
      unmatched.push(match.correction);
      continue;
    }
    if (match.start > cursor) {
      segments.push({ text: transcript.slice(cursor, match.start), correction: null });
    }
    segments.push({
      text: transcript.slice(match.start, match.end),
      correction: match.correction,
    });
    cursor = match.end;
  }

  if (cursor < transcript.length) {
    segments.push({ text: transcript.slice(cursor), correction: null });
  }

  return { segments, unmatched };
}
