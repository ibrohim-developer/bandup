"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumUpgradeDialog } from "@/components/premium-upgrade-dialog";
import { formatResetDate } from "@/components/ai-quota-indicator";
import { useQuotaStatus } from "@/hooks/use-quota-status";

/**
 * Always-visible Energy balance in the dashboard chrome (desktop sidebar +
 * mobile top header). Free users see their weekly balance and can tap it to
 * open the upgrade dialog; Premium users see "Unlimited"; guests see nothing.
 */
export function EnergyBadge({ variant }: { variant: "sidebar" | "mobile" }) {
  const status = useQuotaStatus();

  if (!status) return null;

  if (status.premium) {
    if (variant === "mobile") {
      return (
        <span className="flex items-center gap-1 h-8 px-2.5 rounded-full border border-border text-xs font-bold text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          &infin;
        </span>
      );
    }
    return (
      <div className="px-4 pb-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border text-sm font-bold text-muted-foreground">
          <Zap className="h-5 w-5 shrink-0 text-amber-500 fill-amber-500" />
          <span>Unlimited Energy</span>
        </div>
      </div>
    );
  }

  const { energy, costs } = status;
  // Below the cheapest action = effectively broke; tint the meter as a warning.
  const broke = energy.remaining < Math.min(...Object.values(costs));
  const resetDate = formatResetDate(energy.resetsAt);
  const fillPct = energy.limit > 0 ? (energy.remaining / energy.limit) * 100 : 0;

  // Compact pill for the mobile header — opens the energy upsell on tap.
  if (variant === "mobile") {
    return (
      <PremiumUpgradeDialog
        variant="energy"
        trigger={
          <button
            aria-label={`${energy.remaining} of ${energy.limit} energy left`}
            className={cn(
              "flex items-center gap-1 h-8 px-2.5 rounded-full border text-xs font-bold transition-colors",
              broke
                ? "border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400"
                : "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400"
            )}
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            {energy.remaining}
          </button>
        }
      />
    );
  }

  // Canvas 5b: energy card at the bottom of the sidebar — balance, a progress
  // meter, refill date, and a "Get more" CTA. The whole card is the trigger, so
  // clicking anywhere opens the energy upsell (not just the "Get more" text).
  return (
    <div className="px-4 pb-2">
      <PremiumUpgradeDialog
        variant="energy"
        trigger={
          <button
            type="button"
            aria-label="Get more energy"
            className="w-full text-left cursor-pointer rounded-2xl border border-purple-300/60 dark:border-purple-800/70 bg-gradient-to-br from-purple-500/15 to-purple-500/5 p-4 transition-colors hover:border-purple-400 dark:hover:border-purple-700 hover:from-purple-500/20 hover:to-purple-500/10"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Zap
                className={cn(
                  "h-4 w-4 shrink-0 fill-current",
                  broke ? "text-amber-500" : "text-purple-500"
                )}
              />
              <span className="text-sm font-bold text-foreground">
                {energy.remaining} / {energy.limit} Energy
              </span>
            </div>

            <div className="h-[7px] w-full rounded-full bg-purple-500/15 overflow-hidden mb-2.5">
              <div
                className={cn(
                  "h-full rounded-full transition-[width]",
                  broke
                    ? "bg-gradient-to-r from-amber-500 to-amber-400"
                    : "bg-gradient-to-r from-purple-500 to-purple-400"
                )}
                style={{ width: `${fillPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground truncate">
                {resetDate ? `Refills ${resetDate}` : "Refills weekly"}
              </span>
              <span className="shrink-0 text-[11.5px] font-bold text-purple-600 dark:text-purple-400">
                Get more ›
              </span>
            </div>
          </button>
        }
      />
    </div>
  );
}
