"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PremiumUpgradeDialog } from "@/components/premium-upgrade-dialog";
import { type PracticeQuotaPayload } from "@/hooks/use-practice-quota";
import { MIN_SECONDS_TO_START } from "@/lib/practice-limits";
import { difficultyMeta, DIFFICULTY_CHIP_BASE, TimeChip, type Difficulty } from "./practice-ui";

interface PromptSummary {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  openingQuestion: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  daily_life: "Daily life",
  work_study: "Work & study",
  travel: "Travel",
  opinion: "Opinion",
  describe: "Describe",
};

type LevelFilter = Difficulty | "all";

const LEVEL_FILTERS: { value: LevelFilter; label: string }[] = [
  { value: "all", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export function PracticeClient() {
  const router = useRouter();
  // Drive the tapped-card spinner off the router transition itself, not a
  // manual flag. React owns `isPending`: it's true only while the navigation is
  // actually in flight and flips back to false once it lands — so coming Back to
  // this (state-preserved) page can never leave a card stuck "loading".
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [level, setLevel] = useState<LevelFilter>("all");

  const { data, isLoading } = useQuery<{
    prompts: PromptSummary[];
    quota: PracticeQuotaPayload;
  } | null>({
    queryKey: ["practice-prompts"],
    queryFn: async () => {
      const res = await fetch("/api/practice/prompts");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const prompts = data?.prompts ?? [];
  const quota = data?.quota;
  const outOfTime = !!quota && quota.remaining < MIN_SECONDS_TO_START;

  const levelCounts = {
    beginner: prompts.filter((p) => p.difficulty === "beginner").length,
    intermediate: prompts.filter((p) => p.difficulty === "intermediate").length,
    advanced: prompts.filter((p) => p.difficulty === "advanced").length,
  };
  const visiblePrompts = level === "all" ? prompts : prompts.filter((p) => p.difficulty === level);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight">Speaking Practice</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Pick a topic and speak at length — the AI keeps drawing you out with
            deeper questions. Mistakes collect on the side to review after.
          </p>
        </div>
        {quota && <TimeChip remaining={quota.remaining} outOfTime={outOfTime} />}
      </div>

      {quota && !quota.premium && outOfTime && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50/60 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            You&apos;ve used today&apos;s practice time. It refills on a rolling 24-hour window.
          </p>
          <PremiumUpgradeDialog
            variant="energy"
            trigger={
              <Button size="sm" variant="outline" className="shrink-0">
                Get more practice time
              </Button>
            }
          />
        </div>
      )}

      {prompts.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
          No practice topics yet.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {LEVEL_FILTERS.map((f) => {
              const active = level === f.value;
              const count = f.value === "all" ? prompts.length : levelCounts[f.value];
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setLevel(f.value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    active
                      ? "border-primary bg-card text-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f.value !== "all" && (
                    <span className={cn("h-2 w-2 rounded-full", difficultyMeta(f.value).dot)} />
                  )}
                  {f.label}
                  <span className="text-[11px] font-bold text-muted-foreground/70 tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {visiblePrompts.length === 0 ? (
            <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
              No {level} topics yet.
            </div>
          ) : (
            <div className="grid items-stretch gap-4 sm:grid-cols-2">
              {visiblePrompts.map((prompt) => {
                const meta = difficultyMeta(prompt.difficulty);
                const disabled = outOfTime || isPending;
                return (
                  <button
                    key={prompt.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setPendingId(prompt.id);
                      startTransition(() => {
                        router.push(`/dashboard/practice/${prompt.id}`);
                      });
                    }}
                    className="group flex flex-col rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm sm:p-5"
                  >
                    <span className="flex flex-1 flex-col gap-2.5">
                      <span className="flex items-center gap-2">
                        <span className={cn(DIFFICULTY_CHIP_BASE, meta.badge)}>{meta.label}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {CATEGORY_LABELS[prompt.category] ?? prompt.category}
                        </span>
                      </span>

                      <span className="text-base font-bold leading-snug">{prompt.title}</span>
                      <span className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {prompt.openingQuestion}
                      </span>

                      <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform group-hover:scale-[1.02] group-active:scale-95">
                        {isPending && pendingId === prompt.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                        Start talking
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
