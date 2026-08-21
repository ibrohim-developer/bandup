/**
 * AI evaluation Energy (monetization Phase 1 — docs/monetization-strategy.md).
 *
 * One shared currency instead of per-module limits: each AI evaluation costs
 * energy (writing 2, speaking 4 — speaking is ~2× the Gemini spend), and free
 * users get a weekly grant. Energy replenishes on a rolling window and is not
 * purchasable — a purchasable-credit ledger comes with the payments phase.
 *
 * The billable unit is one *evaluation session*: a test-attempt whose AI
 * evaluation actually started (`evaluation_started_at` set by the evaluate
 * route when it claims the lock). Raw `ai-usage-log` rows are the wrong unit —
 * a single speaking test fires ~9 Gemini calls, a writing test 2.
 *
 * Premium (`mock_test_expires_at` in the future) is effectively unlimited,
 * fair-use capped over a rolling 30-day window.
 *
 * Server-side only — uses the admin-token Strapi helpers.
 */

import { find } from "./strapi/api";
import { isPremiumUser, type PremiumUserFields } from "./premium";
import { ENERGY_COSTS, type AiModule } from "./energy";

export { ENERGY_COSTS };
export type { AiModule };

/** Free weekly grant: 4 writings, or 2 speakings, or 2 writings + 1 speaking. */
export const FREE_WEEKLY_ENERGY = 12;

/** Fair-use cap for Premium (≈200 writings or 100 speakings a month). */
export const PREMIUM_MONTHLY_ENERGY = 400;

const DAY_MS = 24 * 60 * 60 * 1000;
const FREE_WINDOW_DAYS = 7;
const PREMIUM_WINDOW_DAYS = 30;

export interface EnergyBalance {
  used: number;
  limit: number;
  remaining: number;
  /** When the oldest counted evaluation leaves the window, refunding its cost. */
  resetsAt: string | null;
}

export interface QuotaStatus {
  premium: boolean;
  /** Length of the rolling window the grant applies to. */
  windowDays: number;
  energy: EnergyBalance;
  costs: Record<AiModule, number>;
}

interface QuotaUser extends PremiumUserFields {
  id: number;
}

async function sumSpentEnergy(
  userId: number,
  since: Date,
  excludeAttemptId?: string
): Promise<{ used: number; oldest: string | null }> {
  const filters: Record<string, unknown> = {
    user: { id: { $eq: userId } },
    module_type: { $in: Object.keys(ENERGY_COSTS) },
    // "failed" evaluations don't spend energy (the user got nothing);
    // "evaluating" ones do, so parallel submissions can't slip past the limit.
    status: { $in: ["evaluating", "completed"] },
    evaluation_started_at: { $gte: since.toISOString() },
  };
  // An attempt never blocks its own retry (crashed or re-fired evals update
  // the same row, so it is only ever charged once).
  if (excludeAttemptId) filters.documentId = { $ne: excludeAttemptId };

  const rows = await find("test-attempts", {
    filters,
    fields: ["documentId", "module_type", "evaluation_started_at"],
    sort: ["evaluation_started_at:asc"],
  });
  return {
    used: rows.reduce(
      (sum: number, row: { module_type: AiModule }) =>
        sum + (ENERGY_COSTS[row.module_type] ?? 0),
      0
    ),
    oldest: rows[0]?.evaluation_started_at ?? null,
  };
}

export async function getQuotaStatus(
  user: QuotaUser,
  excludeAttemptId?: string
): Promise<QuotaStatus> {
  const premium = isPremiumUser(user);
  const windowDays = premium ? PREMIUM_WINDOW_DAYS : FREE_WINDOW_DAYS;
  const limit = premium ? PREMIUM_MONTHLY_ENERGY : FREE_WEEKLY_ENERGY;

  const since = new Date(Date.now() - windowDays * DAY_MS);
  const { used, oldest } = await sumSpentEnergy(user.id, since, excludeAttemptId);

  return {
    premium,
    windowDays,
    energy: {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      resetsAt: oldest
        ? new Date(new Date(oldest).getTime() + windowDays * DAY_MS).toISOString()
        : null,
    },
    costs: ENERGY_COSTS,
  };
}

/**
 * Gate an evaluate route. Call BEFORE claiming the evaluation lock — claiming
 * sets `evaluation_started_at`, which is what makes the attempt spend energy
 * for every subsequent check.
 */
export async function checkEvaluationQuota(
  user: QuotaUser,
  module: AiModule,
  excludeAttemptId?: string
): Promise<{ allowed: boolean; status: QuotaStatus }> {
  const status = await getQuotaStatus(user, excludeAttemptId);
  return { allowed: status.energy.remaining >= ENERGY_COSTS[module], status };
}

/** JSON body for the HTTP 402 response evaluate routes return when blocked. */
export function quotaExceededBody(status: QuotaStatus, module: AiModule) {
  const cost = ENERGY_COSTS[module];
  return {
    error: status.premium
      ? "You've reached this month's fair-use limit for AI evaluations."
      : `Not enough energy for an AI ${module} evaluation — it costs ${cost} and you have ${status.energy.remaining} left this week. Upgrade to Premium for unlimited evaluations.`,
    code: "quota_exceeded" as const,
    quota: status,
  };
}
