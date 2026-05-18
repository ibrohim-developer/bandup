"use client";

import { useEffect, useRef } from "react";
import type { TranscriptCue } from "@/lib/transcript-cues";
import { useActiveCueIndex } from "@/hooks/use-active-cue-index";
import { cn } from "@/lib/utils";

interface FollowAlongTranscriptProps {
  cues: TranscriptCue[] | null;
  currentTime: number;
  enabled: boolean;
  fallbackTranscript?: string;
}

export function FollowAlongTranscript({
  cues,
  currentTime,
  enabled,
  fallbackTranscript,
}: FollowAlongTranscriptProps) {
  const activeIndex = useActiveCueIndex(cues, currentTime);
  const spanRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const lastScrolledIndex = useRef(-1);

  useEffect(() => {
    if (activeIndex < 0 || activeIndex === lastScrolledIndex.current) return;
    const el = spanRefs.current.get(activeIndex);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const isOffscreen = rect.top < 80 || rect.bottom > viewportH - 80;
    if (isOffscreen) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    lastScrolledIndex.current = activeIndex;
  }, [activeIndex]);

  if (!enabled) return null;

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
    <div className="rounded-md border bg-card p-4 leading-relaxed text-sm md:text-base">
      {cues.map((cue, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) spanRefs.current.set(i, el);
            else spanRefs.current.delete(i);
          }}
          data-cue-index={i}
          className={cn(
            "rounded-md px-1 py-0.5 transition-colors duration-200",
            i === activeIndex && "bg-primary/20",
          )}
        >
          {cue.text}{" "}
        </span>
      ))}
    </div>
  );
}
