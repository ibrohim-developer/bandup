/**
 * Practice-time meter for the AI speaking practice section.
 *
 * Modelled on `lib/quota.ts`, but a SEPARATE currency. Energy pays for graded
 * evaluations (a whole test-attempt is the billable unit); practice bills
 * *seconds of learner speech* on a rolling 24h window, because a practice
 * session is many small Flash calls rather than one big Pro one.
 *
 * The billable unit is `practice-session.spoken_seconds`, which the turn route
 * increments from the duration of the audio it actually received. It is never
 * taken from a client-supplied number — otherwise the meter is advisory only.
 *
 * Server-side only — uses the admin-token Strapi helpers.
 */

import { find } from "./strapi/api";
import { isPremiumUser, type PremiumUserFields } from "./premium";
import {
  FREE_DAILY_PRACTICE_SECONDS,
  PREMIUM_DAILY_PRACTICE_SECONDS,
  MIN_SECONDS_TO_START,
} from "./practice-limits";

export {
  FREE_DAILY_PRACTICE_SECONDS,
  PREMIUM_DAILY_PRACTICE_SECONDS,
  MIN_SECONDS_TO_START,
};

const DAY_MS = 24 * 60 * 60 * 1000;

export interface PracticeQuotaStatus {
  premium: boolean;
  /** Seconds of speech already used in the current window. */
  used: number;
  /** Total seconds allowed per window. */
  limit: number;
  remaining: number;
  /** When the oldest counted session leaves the window, refunding its seconds. */
  resetsAt: string | null;
}

interface PracticeUser extends PremiumUserFields {
  id: number;
}

async function sumSpokenSeconds(
  userId: number,
  since: Date
): Promise<{ used: number; oldest: string | null }> {
  const rows = await find("practice-sessions", {
    filters: {
      user: { id: { $eq: userId } },
      started_at: { $gte: since.toISOString() },
    },
    fields: ["documentId", "spoken_seconds", "started_at"],
    sort: ["started_at:asc"],
  });

  return {
    used: rows.reduce(
      (sum: number, row: { spoken_seconds?: number | null }) =>
        sum + (Number(row.spoken_seconds) || 0),
      0
    ),
    oldest: rows[0]?.started_at ?? null,
  };
}

export async function getPracticeQuota(
  user: PracticeUser
): Promise<PracticeQuotaStatus> {
  const premium = isPremiumUser(user);
  const limit = premium
    ? PREMIUM_DAILY_PRACTICE_SECONDS
    : FREE_DAILY_PRACTICE_SECONDS;

  const since = new Date(Date.now() - DAY_MS);
  const { used, oldest } = await sumSpokenSeconds(user.id, since);

  return {
    premium,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    resetsAt: oldest ? new Date(new Date(oldest).getTime() + DAY_MS).toISOString() : null,
  };
}

/**
 * Gate the turn route. Called BEFORE the Gemini call — a turn that is refused
 * must not cost anything.
 *
 * `minRequired` defaults to 1s: mid-conversation we only need *some* allowance
 * left, and the turn that crosses the limit is allowed to finish rather than
 * being cut off mid-sentence. Starting a new session uses MIN_SECONDS_TO_START.
 */
export async function checkPracticeQuota(
  user: PracticeUser,
  minRequired: number = 1
): Promise<{ allowed: boolean; status: PracticeQuotaStatus }> {
  const status = await getPracticeQuota(user);
  return { allowed: status.remaining >= minRequired, status };
}

/** JSON body for the HTTP 402 the practice routes return when the meter is spent. */
export function practiceQuotaExceededBody(status: PracticeQuotaStatus) {
  const minutes = Math.round(status.limit / 60);
  return {
    error: status.premium
      ? `You've reached today's fair-use practice limit (${minutes} minutes). It resets on a rolling 24-hour window.`
      : `You've used today's ${minutes} minutes of speaking practice. Upgrade to Premium for more, or come back tomorrow.`,
    code: "practice_quota_exceeded" as const,
    quota: status,
  };
}
