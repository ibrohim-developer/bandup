"use server";

import { find } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";

export interface FullMockAttempt {
  id: string;
  testTitle: string;
  date: string;
  listening: number | null;
  reading: number | null;
  writing: number | null;
  speaking: number | null;
  overall: number | null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchFullMockAttempts(): Promise<FullMockAttempt[]> {
  const token = await getToken();
  if (!token) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const attempts = await find(
    "full-mock-test-attempts",
    {
      filters: {
        user: { id: { $eq: user.id } },
        status: { $eq: "completed" },
      },
      fields: ["listening_score", "reading_score", "writing_score", "speaking_score", "overall_band_score", "completed_at"],
      populate: { test: { fields: ["title"] } },
      sort: ["completed_at:desc"],
      pagination: { pageSize: 100 },
    },
    token,
  );

  if (!attempts?.length) return [];

  return attempts.map((a: any) => ({
    id: a.documentId,
    testTitle: a.test?.title ?? "Full Mock Test",
    date: new Date(a.completed_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    listening: a.listening_score ?? null,
    reading: a.reading_score ?? null,
    writing: a.writing_score ?? null,
    speaking: a.speaking_score ?? null,
    overall: a.overall_band_score ?? null,
  }));
}

export interface AttemptPoint {
  date: string;
  band_score: number;
  raw_score: number;
  module_type: string;
}

export interface ModuleStat {
  module: string;
  completed: number;
  avg_band: number;
  best_band: number;
  total_time_hours: number;
}

export interface ProgressData {
  totalCompleted: number;
  avgBandScore: number;
  bestBandScore: number;
  totalHours: number;
  trendPoints: AttemptPoint[];
  activityMap: Record<string, number>; // "YYYY-MM-DD" -> count
  moduleStats: ModuleStat[];
  recentAttempts: {
    id: string;
    title: string;
    module_type: string;
    band_score: number | null;
    raw_score: number | null;
    date: string;
    status: string;
  }[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchProgressData(): Promise<ProgressData | null> {
  const token = await getToken();
  if (!token) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  const attempts = await find("test-attempts", {
    filters: {
      user: { id: { $eq: user.id } },
      status: { $eq: "completed" },
    },
    fields: [
      "module_type",
      "band_score",
      "raw_score",
      "time_spent_seconds",
      "completed_at",
      "status",
    ],
    populate: { test: { fields: ["title"] } },
    sort: ["completed_at:asc"],
    pagination: { pageSize: 1000 },
  });

  if (!attempts?.length) {
    return {
      totalCompleted: 0,
      avgBandScore: 0,
      bestBandScore: 0,
      totalHours: 0,
      trendPoints: [],
      moduleStats: [],
      recentAttempts: [],
      activityMap: {},
    };
  }

  const completed = attempts.filter(
    (a: any) => a.band_score != null && a.band_score > 0,
  );

  const totalCompleted = completed.length;
  const avgBandScore =
    totalCompleted > 0
      ? Math.round(
          (completed.reduce((s: number, a: any) => s + a.band_score, 0) /
            totalCompleted) *
            10,
        ) / 10
      : 0;
  const bestBandScore =
    totalCompleted > 0
      ? Math.max(...completed.map((a: any) => a.band_score))
      : 0;
  const totalSeconds = attempts.reduce(
    (s: number, a: any) => s + (a.time_spent_seconds ?? 0),
    0,
  );
  const totalHours = Math.round((totalSeconds / 3600) * 10) / 10;

  // Trend: all completed attempts with a score, sorted by date
  const trendPoints: AttemptPoint[] = completed.map((a: any) => ({
    date: new Date(a.completed_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    band_score: a.band_score,
    raw_score: a.raw_score ?? 0,
    module_type: a.module_type,
  }));

  // Per-module stats
  const modules = ["reading", "listening", "writing", "speaking", "full"];
  const moduleStats: ModuleStat[] = modules
    .map((mod) => {
      const modAttempts = completed.filter((a: any) => a.module_type === mod);
      if (!modAttempts.length) return null;
      const avg =
        Math.round(
          (modAttempts.reduce((s: number, a: any) => s + a.band_score, 0) /
            modAttempts.length) *
            10,
        ) / 10;
      const best = Math.max(...modAttempts.map((a: any) => a.band_score));
      const secs = modAttempts.reduce(
        (s: number, a: any) => s + (a.time_spent_seconds ?? 0),
        0,
      );
      return {
        module: mod,
        completed: modAttempts.length,
        avg_band: avg,
        best_band: best,
        total_time_hours: Math.round((secs / 3600) * 10) / 10,
      };
    })
    .filter(Boolean) as ModuleStat[];

  // Recent 6 attempts (any status shown in recent)
  const allRecent = [...attempts]
    .sort(
      (a: any, b: any) =>
        new Date(b.completed_at ?? 0).getTime() -
        new Date(a.completed_at ?? 0).getTime(),
    )
    .slice(0, 6);

  const recentAttempts = allRecent.map((a: any) => ({
    id: a.documentId,
    title: a.test?.title ?? null,
    module_type: a.module_type,
    band_score: a.band_score ?? null,
    raw_score: a.raw_score ?? null,
    date: new Date(a.completed_at).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: a.status,
  }));

  // Activity heatmap: count all attempts (any status) per calendar day
  const activityMap: Record<string, number> = {};
  for (const a of attempts) {
    const day = (a.completed_at ?? a.createdAt ?? "").slice(0, 10);
    if (day) activityMap[day] = (activityMap[day] ?? 0) + 1;
  }

  return {
    totalCompleted,
    avgBandScore,
    bestBandScore,
    totalHours,
    trendPoints,
    moduleStats,
    recentAttempts,
    activityMap,
  };
}
