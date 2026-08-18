"use client";

import { useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { anchorCorrections, type GrammarCorrection } from "@/lib/highlight-corrections";

/**
 * A learner turn with its grammar mistakes underlined in place.
 *
 * Anchoring is best-effort by design: `anchorCorrections` locates each quoted
 * span by normalised whole-word match and drops anything it cannot place, since
 * underlining the wrong words teaches the wrong lesson. Whatever fails to anchor
 * still reaches the learner through the corrections side panel.
 */
export function MarkedTranscript({
  text,
  corrections,
  className,
}: {
  text: string;
  corrections?: GrammarCorrection[];
  className?: string;
}) {
  const { segments } = useMemo(
    () => anchorCorrections(text, corrections),
    [text, corrections]
  );

  return (
    <p className={className}>
      {segments.map((segment, i) =>
        segment.correction ? (
          <Popover key={i}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="cursor-pointer rounded-sm underline decoration-amber-500 decoration-wavy decoration-2 underline-offset-4 transition-colors hover:bg-amber-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                aria-label={`Grammar mistake: ${segment.text}. Tap to see the correction.`}
              >
                {segment.text}
              </button>
            </PopoverTrigger>
            <PopoverContent className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="line-through text-red-500/80">
                  {segment.correction.original}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {segment.correction.corrected}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {segment.correction.explanation}
              </p>
            </PopoverContent>
          </Popover>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </p>
  );
}
