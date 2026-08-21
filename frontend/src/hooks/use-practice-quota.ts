"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface PracticeQuotaPayload {
  premium: boolean;
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string | null;
}

export const PRACTICE_QUOTA_QUERY_KEY = ["practice-quota"] as const;

/**
 * Remaining daily speaking-practice time. Separate from `useQuotaStatus`, which
 * reports the Energy pool for graded evaluations — the two currencies never
 * interact.
 *
 * Unlike Energy, practice time is spent *during* a session rather than at a
 * navigation boundary, so the turn route returns a fresh quota with every turn
 * and the runner pushes it into this cache via `setPracticeQuota`.
 */
export function usePracticeQuota(): PracticeQuotaPayload | null {
  const { data } = useQuery<PracticeQuotaPayload | null>({
    queryKey: PRACTICE_QUOTA_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/practice/quota");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30 * 1000,
  });

  return data ?? null;
}

/** Push the quota returned by a turn into the shared cache, avoiding a refetch. */
export function useSetPracticeQuota() {
  const queryClient = useQueryClient();
  return (quota: PracticeQuotaPayload) => {
    queryClient.setQueryData(PRACTICE_QUOTA_QUERY_KEY, quota);
  };
}
