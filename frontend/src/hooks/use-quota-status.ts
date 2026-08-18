"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export type AiModule = "writing" | "speaking";

export interface EnergyBalance {
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string | null;
}

export interface QuotaStatusPayload {
  premium: boolean;
  windowDays: number;
  energy: EnergyBalance;
  costs: Record<AiModule, number>;
}

export const QUOTA_QUERY_KEY = ["quota-status"] as const;

/**
 * Current user's AI-evaluation Energy balance, shared app-wide via React
 * Query (the sidebar badge and page indicators dedupe into one fetch).
 * Returns null for guests (401) or while loading.
 *
 * Energy changes when an evaluation runs, which almost always involves a
 * navigation — so the balance is refetched on every route change. The one
 * same-page spend (free-write) invalidates QUOTA_QUERY_KEY directly.
 */
export function useQuotaStatus(): QuotaStatusPayload | null {
  const pathname = usePathname();

  const { data, refetch } = useQuery<QuotaStatusPayload | null>({
    queryKey: QUOTA_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/quota");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30 * 1000,
  });

  // Refetch on route change only — the mount fetch is useQuery's job.
  const lastPathname = useRef(pathname);
  useEffect(() => {
    if (lastPathname.current !== pathname) {
      lastPathname.current = pathname;
      refetch();
    }
  }, [pathname, refetch]);

  return data ?? null;
}
