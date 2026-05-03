"use server";

import { unstable_cache } from "next/cache";
import { find } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";

const PAGE_SIZE = 20;

export interface FullMockTest {
  id: string;
  title: string;
  description: string;
  listeningQuestions: number;
  listeningSections: number;
  readingQuestions: number;
  readingPassages: number;
  writingTasks: number;
  speakingTopics: number;
  duration: number;
  isLocked: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const getFullMockTests = unstable_cache(
  async (): Promise<FullMockTest[]> => {
    const tests = await find("tests", {
      filters: {
        is_full_mock_test: { $eq: true },
        is_published: { $eq: true },
      },
      fields: ["title", "description"],
      populate: {
        listening_sections: {
          fields: ["section_number"],
          populate: { questions: { fields: ["question_number"] } },
        },
        reading_passages: {
          fields: ["passage_number"],
          populate: { questions: { fields: ["question_number"] } },
        },
        writing_tasks: { fields: ["task_number"] },
        speaking_topics: { fields: ["part_number"] },
      },
    });

    if (!tests?.length) return [];

    return tests.map((test: any, index: number) => {
      const listenings = test.listening_sections ?? [];
      const readings = test.reading_passages ?? [];
      const writings = test.writing_tasks ?? [];
      const speakings = test.speaking_topics ?? [];

      const listeningQ = listenings.reduce(
        (sum: number, s: any) => sum + (s.questions?.length ?? 0),
        0,
      );
      const readingQ = readings.reduce(
        (sum: number, p: any) => sum + (p.questions?.length ?? 0),
        0,
      );

      return {
        id: test.documentId,
        title: test.title,
        description: test.description ?? "",
        listeningQuestions: listeningQ,
        listeningSections: listenings.length,
        readingQuestions: readingQ,
        readingPassages: readings.length,
        writingTasks: writings.length,
        speakingTopics: speakings.length,
        duration: 165, // ~2h 45min total
        isLocked: index > 0,
      };
    });
  },
  ["full-mock-tests"],
  { revalidate: 300 },
);

export async function fetchFullMockTests(
  params: Record<string, string | undefined>,
  page: number,
) {
  const allTests = await getFullMockTests();

  const completedTestIds = new Set<string>();
  const token = await getToken();
  if (token) {
    const user = await getCurrentUser();
    if (user) {
      // Get all sessions sorted newest-first. A test is "completed" only if
      // its MOST RECENT session is completed — so an in-progress retake
      // correctly removes the "Completed" badge.
      const allSessions = await find("full-mock-test-attempts", {
        filters: {
          user: { id: { $eq: user.id } },
        },
        sort: ["createdAt:desc"],
        populate: ["test"],
        fields: ["status"],
      });
      const seenTests = new Set<string>();
      allSessions?.forEach((a: any) => {
        const tid = a.test?.documentId;
        if (tid && !seenTests.has(tid)) {
          seenTests.add(tid);
          if (a.status === "completed") completedTestIds.add(tid);
        }
      });
    }
  }

  const filtered = allTests
    .map((test) => ({ ...test, isCompleted: completedTestIds.has(test.id) }))
    .filter((test) => {
      if (
        params.q &&
        !test.title.toLowerCase().includes(params.q.toLowerCase())
      ) {
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
