"use client";

import { Star, Check } from "lucide-react";
import type { GrammarCorrection } from "@/lib/highlight-corrections";

export interface PanelCorrection extends GrammarCorrection {
  /** Turn index it came from, so repeated mistakes can be spotted. */
  turn: number;
}

/**
 * Running list of grammar mistakes, beside the conversation on desktop and
 * below it on mobile.
 *
 * Deliberately non-blocking: nothing here interrupts the conversation or
 * demands acknowledgement. A learner who stops to read every card mid-sentence
 * builds exactly the hesitation habit that costs marks under Fluency, so the
 * panel waits to be looked at.
 */
export function CorrectionsPanel({ corrections }: { corrections: PanelCorrection[] }) {
  return (
    <div className="flex flex-col rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3.5">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          Corrections
        </h2>
        {corrections.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-extrabold text-amber-950">
            {corrections.length}
          </span>
        )}
      </div>

      {corrections.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">Mistakes appear here as you speak.</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/70">
            Keep talking — don&apos;t stop to read them mid-sentence.
          </p>
        </div>
      ) : (
        <div className="max-h-[60vh] space-y-3 overflow-y-auto p-3">
          {/* Newest first — the mistake they just made is the one they can still feel. */}
          {[...corrections].reverse().map((c, i) => (
            <div key={`${c.turn}-${i}`} className="rounded-xl border bg-background/60 p-3.5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Grammar
              </p>
              <p className="text-sm text-red-500/90 line-through decoration-red-500/50">
                {c.original}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5 shrink-0" />
                {c.corrected}
              </p>
              <p className="mt-2.5 border-t pt-2.5 text-xs leading-relaxed text-muted-foreground">
                {c.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
