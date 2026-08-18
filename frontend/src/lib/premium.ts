/**
 * Premium access is tracked by the `mock_test_expires_at` datetime on the user.
 * A user is Premium while that timestamp is in the future. Premium unlocks:
 * - full mock tests beyond the first one
 * - unlimited AI writing/speaking evaluations (fair-use capped — see lib/quota.ts;
 *   free users get a weekly Energy allowance instead)
 */
export interface PremiumUserFields {
  mock_test_expires_at?: string | null;
}

export function isPremiumUser(user: PremiumUserFields | null | undefined): boolean {
  if (!user?.mock_test_expires_at) return false;
  const expires = new Date(user.mock_test_expires_at);
  return !Number.isNaN(expires.getTime()) && expires.getTime() > Date.now();
}
