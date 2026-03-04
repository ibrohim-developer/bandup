"use server";

import { unstable_cache } from "next/cache";
import { find } from "@/lib/strapi/api";

const PAGE_SIZE = 20;

import type { SpeakingTopicItem } from "@/components/test/speaking/speaking-topic-card";

/* eslint-disable @typescript-eslint/no-explicit-any */
const getSpeakingTopics = unstable_cache(
  async (): Promise<SpeakingTopicItem[]> => {
    const topics = await find("speaking-topics", {
      filters: { test: { is_published: { $eq: true } } },
      populate: {
        test: { fields: ["title", "difficulty_level", "is_published"] },
      },
    });

    if (!topics?.length) return [];

    return topics.map((t: any) => ({
      id: t.documentId,
      testId: t.test?.documentId,
      title: t.test?.title,
      topic: t.topic,
      partNumber: t.part_number,
      preparationTime: t.preparation_time_seconds,
      speakingTime: t.speaking_time_seconds,
      difficulty: t.test?.difficulty_level ?? "medium",
      questions: t.questions,
    }));
  },
  ["speaking-topics"],
  { revalidate: 300 },
);

export async function fetchSpeakingTopics(
  params: Record<string, string | undefined>,
  page: number,
) {
  const allTopics = await getSpeakingTopics();

  const filtered = allTopics.filter((topic) => {
    if (
      params.q &&
      !topic.topic.toLowerCase().includes(params.q.toLowerCase())
    ) {
      return false;
    }
    if (
      params.difficulty &&
      params.difficulty !== "all" &&
      topic.difficulty !== params.difficulty
    ) {
      return false;
    }
    if (
      params.part &&
      params.part !== "all" &&
      topic.partNumber !== Number(params.part)
    ) {
      return false;
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
