"use client";

import { Sparkles, Zap } from "lucide-react";
import { PremiumUpgradeDialog } from "@/components/premium-upgrade-dialog";
import { Button } from "@/components/ui/button";
import { useQuotaStatus, type AiModule } from "@/hooks/use-quota-status";

export function formatResetDate(resetsAt: string | null): string | null {
  if (!resetsAt) return null;
  const date = new Date(resetsAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Shows a free user their weekly Energy balance, translated into how many
 * evaluations of this page's module it buys, with an upgrade path once they
 * can't afford one. Hidden for guests (energy only applies to signed-in
 * evaluation flows) and for Premium users (unlimited; the fair-use cap is an
 * abuse guard, not a feature to advertise).
 */
export function AiQuotaIndicator({ module }: { module: AiModule }) {
  const status = useQuotaStatus();

  if (!status || status.premium) return null;

  const { energy, costs } = status;
  const cost = costs[module];
  const affordable = Math.floor(energy.remaining / cost);
  const resetDate = formatResetDate(energy.resetsAt);

  if (affordable > 0) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 px-4 py-3 text-sm">
        <Zap className="h-4 w-4 text-purple-500 shrink-0" />
        <span>
          <span className="font-bold">{energy.remaining}</span> of {energy.limit}{" "}
          energy left this week — enough for{" "}
          <span className="font-bold">{affordable}</span> {module} evaluation
          {affordable === 1 ? "" : "s"} ({cost} energy each)
        </span>
        <PremiumUpgradeDialog
          variant="energy"
          trigger={
            <button className="ml-auto text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline shrink-0">
              Get unlimited
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 px-4 py-3 text-sm">
      <Zap className="h-4 w-4 text-amber-500 shrink-0" />
      <span>
        Not enough energy for an AI {module} evaluation — it costs {cost} and
        you have {energy.remaining}
        {resetDate ? `. Refills ${resetDate}` : ""}.
      </span>
      <PremiumUpgradeDialog
        variant="energy"
        trigger={
          <Button size="sm" className="ml-auto shrink-0">
            Upgrade
          </Button>
        }
      />
    </div>
  );
}

/**
 * Card shown in place of AI scores when an evaluation was blocked by the
 * energy limit (HTTP 402 from an evaluate route). The user's work is already
 * saved — evaluation can be re-triggered after upgrading or when energy refills.
 */
export function QuotaPaywallCard({
  title = "Out of energy",
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {message ??
              "Your answers are saved. Upgrade to Premium for unlimited AI evaluations, or come back when your weekly energy refills."}
          </p>
        </div>
        <PremiumUpgradeDialog
          variant="energy"
          trigger={<Button className="shrink-0">Upgrade to Premium</Button>}
        />
      </div>
    </div>
  );
}
