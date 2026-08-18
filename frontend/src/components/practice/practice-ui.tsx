"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPracticeTime } from "@/lib/practice-limits";

export type Difficulty = "beginner" | "intermediate" | "advanced";

/**
 * Per-difficulty accent — a QUIET palette (design 9a): Beginner = slate,
 * Intermediate = amber, Advanced = violet. Deliberately no green and no red, and
 * crimson is reserved for actions (the Start button, the active filter border)
 * so it never competes with a difficulty tag. `dot` colours the filter pill;
 * `badge` is the tinted chip on cards and the session header. Explicit Tailwind
 * colours (not theme tokens) with light/dark text variants.
 */
export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; dot: string; badge: string }
> = {
  beginner: {
    label: "Beginner",
    dot: "bg-slate-400",
    badge: "border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-300",
  },
  intermediate: {
    label: "Intermediate",
    dot: "bg-amber-400",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  advanced: {
    label: "Advanced",
    dot: "bg-violet-400",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  },
};

export function difficultyMeta(difficulty: string) {
  return DIFFICULTY_META[difficulty as Difficulty] ?? DIFFICULTY_META.intermediate;
}

/** Structural classes for a difficulty chip; combine with a level's `badge` colour. */
export const DIFFICULTY_CHIP_BASE =
  "rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider";

/**
 * Compact "time left today" pill for the topic-picker header. Turns amber when
 * the learner is out of time — the upgrade CTA lives beside it, not in here.
 */
export function TimeChip({
  remaining,
  outOfTime = false,
  className,
}: {
  remaining: number;
  outOfTime?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm",
        outOfTime &&
          "border-amber-300 bg-amber-50/60 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400",
        className
      )}
    >
      <Clock className={cn("h-4 w-4", !outOfTime && "text-emerald-500")} />
      {outOfTime ? (
        <span className="font-semibold">No time left</span>
      ) : (
        <>
          <span className="font-bold tabular-nums text-foreground">
            {formatPracticeTime(remaining)}
          </span>
          <span className="text-muted-foreground">left today</span>
        </>
      )}
    </span>
  );
}
