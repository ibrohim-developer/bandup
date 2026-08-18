"use client";

import { useState, type ReactNode } from "react";
import { Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  FREE_DAILY_PRACTICE_SECONDS,
  PREMIUM_DAILY_PRACTICE_SECONDS,
} from "@/lib/practice-limits";

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "bandupuz_bot";
const BUY_LINK = `https://t.me/${BOT_USERNAME}?start=buy`;

/**
 * One Premium tier, three durations. Longer plans are the same entitlement
 * (`mock_test_expires_at` pushed further out — see lib/premium.ts), so nothing
 * downstream has to know which one was bought: the transferred amount is what
 * identifies the plan during receipt review in the Telegram bot.
 */
interface Plan {
  id: string;
  label: string;
  price: number;
  perMonth: string;
  save?: string;
  popular?: boolean;
  note?: string;
}

const PLANS: Plan[] = [
  { id: "1m", label: "1 month", price: 5, perMonth: "$5.00 / mo" },
  {
    id: "3m",
    label: "3 months",
    price: 12,
    perMonth: "$4.00 / mo",
    save: "Save 20%",
    popular: true,
    note: "Exam sprint",
  },
  { id: "12m", label: "12 months", price: 39, perMonth: "$3.25 / mo", save: "Save 35%" },
];

const DEFAULT_PLAN_ID = "3m";

/**
 * The lead benefit (rendered separately, variant-styled) already covers Energy,
 * and Energy buys nothing but Writing/Speaking evaluations — see energy.ts. So
 * these are the benefits on *other* meters: practice time is its own currency
 * (practice-limits.ts), mock tests gate on Premium directly.
 */
const BENEFITS = [
  `${Math.round(PREMIUM_DAILY_PRACTICE_SECONDS / 60)} min of AI speaking practice a day — ${Math.round(
    PREMIUM_DAILY_PRACTICE_SECONDS / FREE_DAILY_PRACTICE_SECONDS
  )}× the free limit`,
  "All full mock tests unlocked",
];

interface PremiumUpgradeDialogProps {
  /** Provide a trigger element for uncontrolled use. The dialog manages its own open state. */
  trigger?: ReactNode;
  /** Controlled open state. Required together with onOpenChange when triggering programmatically. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * "energy" frames the upsell around running out of Energy (Canvas 6b):
   * a refill badge on top and a purple lead benefit. Use when the dialog opens
   * from an energy widget or a quota paywall. Defaults to the generic upsell,
   * which leads with the same energy benefit in the brand crimson (Canvas 6a).
   */
  variant?: "default" | "energy";
}

export function PremiumUpgradeDialog({
  trigger,
  open,
  onOpenChange,
  variant = "default",
}: PremiumUpgradeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [planId, setPlanId] = useState<string>(DEFAULT_PLAN_ID);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;
  const isEnergy = variant === "energy";
  const selected = PLANS.find((p) => p.id === planId) ?? PLANS[0];

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          {isEnergy && (
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 px-3 py-1 mb-1 text-xs font-bold text-purple-700 dark:text-purple-300">
              <Zap className="h-3.5 w-3.5 fill-current" />
              Out of energy? Go unlimited
            </div>
          )}
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-primary text-primary-foreground text-[13px] font-black">
              B
            </span>
            BandUp Premium
          </DialogTitle>
          <DialogDescription>
            Every plan unlocks the same Premium. Longer plans just cost less per month.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2.5">
            {/* Energy leads the list — purple + bold in the energy variant,
                brand crimson otherwise (Canvas 6a/6b). The energy variant opens
                from a spent meter, so it names the currency the user just ran
                out of; the generic one names the outcome instead, since
                "energy" is jargon to someone who hasn't hit the wall yet. */}
            <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
              <Zap
                className={cn(
                  "h-4 w-4 shrink-0 fill-current",
                  isEnergy ? "text-purple-500" : "text-primary"
                )}
              />
              {isEnergy
                ? "Unlimited energy — no weekly cap on evaluations"
                : "Unlimited AI Writing & Speaking evaluations"}
            </div>
            {BENEFITS.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                <Zap className="h-4 w-4 text-primary fill-current shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <div role="radiogroup" aria-label="Choose a plan" className="space-y-2">
            {PLANS.map((plan) => {
              const isSelected = plan.id === selected.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setPlanId(plan.id)}
                  className={cn(
                    "relative w-full flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/40"
                  )}
                >
                  {plan.popular && (
                    <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary-foreground">
                      Most popular
                    </span>
                  )}
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                        isSelected ? "border-primary" : "border-muted-foreground/40"
                      )}
                    >
                      {isSelected && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-foreground">{plan.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {plan.note ? `${plan.note} · ${plan.perMonth}` : plan.perMonth}
                      </span>
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-lg font-black text-foreground">${plan.price}</span>
                    {plan.save && (
                      <span className="block text-[11px] font-bold text-primary">{plan.save}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2 text-sm text-foreground">
            <p className="font-semibold">How to buy:</p>
            <ol className="space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>Tap <span className="font-bold text-foreground">Buy in Telegram</span> below and send <span className="font-bold text-foreground">/buy</span> to the bot</li>
              <li>Transfer <span className="font-bold text-foreground">${selected.price}</span> for the <span className="font-bold text-foreground">{selected.label}</span> plan, then send your receipt right in the chat</li>
              <li>We verify it and your Premium activates automatically</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <a
            href={BUY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground font-bold py-3 rounded-xl transition-opacity text-sm shadow-lg shadow-primary/25"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.9 3.5 2.6 11.1c-1.2.5-1.2 1.2-.2 1.5l4.9 1.5 1.9 5.8c.2.6.4.8.9.8.5 0 .7-.2 1-.5l2.4-2.3 5 3.6c.9.5 1.5.2 1.8-.9L22.4 4.7c.3-1.3-.5-1.9-1.5-1.4z"/>
            </svg>
            Buy {selected.label} in Telegram — ${selected.price}
          </a>
          <p className="text-center text-xs text-muted-foreground">
            Need help? Contact{" "}
            <a
              href="https://t.me/bandup_admin"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:underline"
            >
              @bandup_admin
            </a>
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
