"use client";

import { useMemo } from "react";
import type { TranscriptCue } from "@/lib/transcript-cues";
import { useActiveCueIndex } from "@/hooks/use-active-cue-index";
import { cn } from "@/lib/utils";

interface FollowAlongTranscriptProps {
  cues: TranscriptCue[] | null;
  currentTime: number;
  fallbackTranscript?: string;
}

// Detect a leading speaker label such as "Speaker 1:", "Speaker 1 (Farm Staff):",
// "Speaker 2 (Helen):", "Tom:", "Dr. Smith:" at the start of a cue. Returns true
// when the cue begins with a label; we then always start a new paragraph there
// (even if the speaker is the same as before — the explicit re-label in the
// transcript signals a turn boundary worth visualizing).
// Speaker label = starts with a letter, then up to 28 more chars of letters/
// digits/spaces/parens/periods, then a colon. Dashes are NOT terminators
// (so "questions 1–5." won't trigger), and the 30-char cap rejects narrator
// prefixes like "Conversation Begins Speaker 1 (Farm Staff):".
const SPEAKER_LABEL_RE = /^([A-Za-z][^:!?\n]{0,28}:)\s*(.*)$/;

function hasSpeakerLabel(text: string): boolean {
  return SPEAKER_LABEL_RE.test(text);
}

// Split a cue text into a speaker-label prefix and the remaining content.
// Returns label=null when the cue doesn't begin with a recognized label.
function splitSpeakerLabel(text: string): { label: string | null; rest: string } {
  const m = text.match(SPEAKER_LABEL_RE);
  if (!m) return { label: null, rest: text };
  return { label: m[1], rest: m[2] };
}

export function FollowAlongTranscript({
  cues,
  currentTime,
  fallbackTranscript,
}: FollowAlongTranscriptProps) {
  const activeIndex = useActiveCueIndex(cues, currentTime);

  // Group cues into paragraphs. A new paragraph starts whenever a cue begins
  // with an explicit speaker label. Cues without a label continue the current
  // paragraph as the same speaker's ongoing speech.
  const lines = useMemo(() => {
    const out: { startIndex: number; cues: TranscriptCue[] }[] = [];
    if (!cues?.length) return out;
    let currentLine: TranscriptCue[] = [];
    let currentStart = 0;
    cues.forEach((cue, i) => {
      if (hasSpeakerLabel(cue.text)) {
        if (currentLine.length > 0) {
          out.push({ startIndex: currentStart, cues: currentLine });
        }
        currentLine = [cue];
        currentStart = i;
      } else {
        currentLine.push(cue);
      }
    });
    if (currentLine.length > 0) {
      out.push({ startIndex: currentStart, cues: currentLine });
    }
    return out;
  }, [cues]);

  if (!cues?.length) {
    if (!fallbackTranscript) return null;
    return (
      <div className="rounded-md border bg-card p-4 leading-relaxed text-sm md:text-base">
        <p className="mb-2 text-xs text-muted-foreground italic">
          Transcript not yet aligned — playback highlight unavailable.
        </p>
        <div className="whitespace-pre-wrap">{fallbackTranscript}</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card p-4 text-sm md:text-base space-y-3">
      {lines.map((line) => (
        <p key={line.startIndex} className="leading-relaxed">
          {line.cues.map((cue, j) => {
            const globalIdx = line.startIndex + j;
            const { label, rest } = j === 0
              ? splitSpeakerLabel(cue.text)
              : { label: null, rest: cue.text };
            const highlightClass = cn(
              "rounded-md px-1 py-0.5 transition-colors duration-200",
              globalIdx === activeIndex && "bg-primary/40 dark:bg-primary/25",
            );
            return (
              <span key={globalIdx}>
                {label && (
                  <span className="mr-1 inline-block rounded-md bg-primary/15 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary dark:bg-primary/20">
                    {label.replace(/[:\-–—]\s*$/, "")}
                  </span>
                )}
                <span data-cue-index={globalIdx} className={highlightClass}>
                  {rest}
                </span>{" "}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
