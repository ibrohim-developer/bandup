"use client";

import { type ReactNode } from "react";
import { LoginRequiredLink } from "@/components/auth/login-required-link";
import { PremiumUpgradeDialog } from "@/components/premium-upgrade-dialog";
import { useQuotaStatus } from "@/hooks/use-quota-status";

/**
 * Start affordance for an AI-scored test, gated on Energy. When a signed-in,
 * non-Premium user can't afford `cost`, clicking opens the energy upsell modal
 * instead of entering the test — the whole test is AI-scored, so starting it
 * with too little energy would only dead-end at the evaluation paywall after
 * the user has already done the work.
 *
 * Everyone else navigates normally via LoginRequiredLink: guests (status is
 * null until sign-in), Premium users, free modules (cost omitted), and anyone
 * who can afford it. The server evaluate routes remain the real enforcement;
 * this is the up-front UX guard.
 */
export function EnergyGatedStart({
  href,
  cost,
  className,
  children,
}: {
  href: string;
  cost?: number;
  className?: string;
  children: ReactNode;
}) {
  const status = useQuotaStatus();
  const blocked =
    cost != null &&
    !!status &&
    !status.premium &&
    status.energy.remaining < cost;

  if (blocked) {
    return (
      <PremiumUpgradeDialog
        variant="energy"
        trigger={
          <button type="button" className={className}>
            {children}
          </button>
        }
      />
    );
  }

  return (
    <LoginRequiredLink href={href} className={className}>
      {children}
    </LoginRequiredLink>
  );
}
