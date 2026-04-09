"use server";

import { unstable_cache } from "next/cache";
import { find } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";

const PAGE_SIZE = 20;

export interface SpeakingTopicItem {
  id: string;
  topic: string;
  partNumber: number;
  preparationTime: number;
  speakingTime: number;
  questions: unknown;
}

export interface SpeakingTestItem {
  id: string;
  title: string;
  difficulty: string;
  topics: SpeakingTopicItem[];
  isCompleted?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const getSpeakingTests = unstable_cache(
  async (): Promise<SpeakingTestItem[]> => {
    const tests = await find("tests", {
      filters: {
        module_type: { $eq: "speaking" },
        is_published: { $eq: true },
      },
      fields: ["title", "difficulty_level"],
      populate: {
        speaking_topics: {
          fields: ["topic", "part_number", "preparation_time_seconds", "speaking_time_seconds", "questions"],
        },
      },
    });

    if (!tests?.length) return [];

    return tests.map((test: any) => ({
      id: test.documentId,
      title: test.title,
      difficulty: test.difficulty_level ?? "medium",
      topics: (test.speaking_topics ?? []).map((t: any) => ({
        id: t.documentId,
        topic: t.topic,
        partNumber: t.part_number,
        preparationTime: t.preparation_time_seconds,
        speakingTime: t.speaking_time_seconds,
        questions: t.questions,
      })),
    }));
  },
  ["speaking-tests"],
  { revalidate: 300 },
);

export async function fetchSpeakingTests(
  params: Record<string, string | undefined>,
  page: number,
) {
  const allTests = await getSpeakingTests();

  const completedTestIds = new Set<string>();
  const token = await getToken();
  if (token) {
    const user = await getCurrentUser();
    if (user) {
      const attempts = await find("test-attempts", {
        filters: {
          user: { id: { $eq: user.id } },
          module_type: { $eq: "speaking" },
          status: { $eq: "completed" },
        },
        populate: ["test"],
        fields: ["status"],
      }, token);
      attempts?.forEach((a: any) => {
        if (a.test?.documentId) completedTestIds.add(a.test.documentId);
      });
    }
  }

  const filtered = allTests
    .map((test) => ({ ...test, isCompleted: completedTestIds.has(test.id) }))
    .filter((test) => {
      if (params.q && !test.title.toLowerCase().includes(params.q.toLowerCase())) {
        return false;
      }
      if (params.difficulty && params.difficulty !== "all" && test.difficulty !== params.difficulty) {
        return false;
      }
      if (params.status && params.status !== "all") {
        if (params.status === "completed" && !test.isCompleted) return false;
        if (params.status === "new" && test.isCompleted) return false;
      }
      return true;
    });

  const start = page * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return {
    items,
    totalCount: filtered.length,
    hasMore: start + PAGE_SIZE < filtered.length,
  };
}
