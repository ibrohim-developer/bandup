"use server";

import { unstable_cache } from "next/cache";
import { find } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";

const PAGE_SIZE = 20;

interface WritingTest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  tasks: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const getWritingTests = unstable_cache(
  async (): Promise<WritingTest[]> => {
    const tasks = await find("writing-tasks", {
      filters: { test: { is_published: { $eq: true } } },
      populate: {
        test: { fields: ["title", "description", "difficulty_level", "is_published"] },
      },
    });

    if (!tasks?.length) return [];

    const testMap = new Map<string, any>();
    tasks.forEach((task: any) => {
      const test = task.test;
      if (!test) return;
      const testDocId = test.documentId;
      if (!testMap.has(testDocId)) {
        testMap.set(testDocId, {
          id: testDocId,
          title: test.title,
          description: test.description ?? "",
          difficulty: test.difficulty_level ?? "medium",
          duration: 60,
          tasks: 0,
        });
      }
      const testData = testMap.get(testDocId);
      testData.tasks += 1;
    });

    return Array.from(testMap.values());
  },
  ["writing-tests"],
  { revalidate: 300 },
);

export async function fetchWritingTests(
  params: Record<string, string | undefined>,
  page: number,
) {
  const allTests = await getWritingTests();

  const completedTestIds = new Set<string>();
  const token = await getToken();
  if (token) {
    const user = await getCurrentUser();
    if (user) {
      const attempts = await find("test-attempts", {
        filters: {
          user: { id: { $eq: user.id } },
          module_type: { $eq: "writing" },
          status: { $in: ["completed", "evaluating"] },
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
      if (
        params.q &&
        !test.title.toLowerCase().includes(params.q.toLowerCase())
      ) {
        return false;
      }
      if (
        params.difficulty &&
        params.difficulty !== "all" &&
        test.difficulty !== params.difficulty
      ) {
        return false;
      }
      if (params.task && params.task !== "all") {
        const taskNum = Number(params.task.replace("task", ""));
        if (test.tasks !== taskNum) return false;
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
