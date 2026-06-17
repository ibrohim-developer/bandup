"use server";

import { unstable_cache } from "next/cache";
import { find } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";
import { buildBookTabResult, type FlatTest } from "@/lib/tests/book-grouping";

const PAGE_SIZE = 20;

type ReadingTest = Omit<FlatTest, "isCompleted">;

/* eslint-disable @typescript-eslint/no-explicit-any */
const getReadingTests = unstable_cache(
  async (): Promise<ReadingTest[]> => {
    const tests = await find("tests", {
      filters: {
        module_type: { $eq: "reading" },
        is_published: { $eq: true },
      },
      fields: ["title", "difficulty_level", "slug"],
      sort: ["createdAt:desc"],
      populate: {
        reading_passages: {
          fields: ["passage_number"],
          populate: { questions: { fields: ["question_number"] } },
        },
      },
    });

    if (!tests?.length) return [];

    return tests.map((test: any) => {
      const passages = test.reading_passages ?? [];
      const questions = passages.reduce(
        (sum: number, p: any) => sum + (p.questions?.length ?? 0),
        0,
      );
      return {
        id: test.documentId,
        slug: test.slug ?? test.documentId,
        title: test.title,
        difficulty: test.difficulty_level ?? "medium",
        metric: `${questions} questions`,
        type: "academic",
      };
    });
  },
  ["reading-tests"],
  { revalidate: 300 },
);

export async function fetchReadingTests(
  params: Record<string, string | undefined>,
  page: number,
) {
  const allTests = await getReadingTests();

  const completedTestIds = new Set<string>();
  const token = await getToken();
  if (token) {
    const user = await getCurrentUser();
    if (user) {
      const attempts = await find("test-attempts", {
        filters: {
          user: { id: { $eq: user.id } },
          module_type: { $eq: "reading" },
          status: { $eq: "completed" },
        },
        populate: ["test"],
        fields: ["status"],
      });
      attempts?.forEach((a: any) => {
        if (a.test?.documentId) completedTestIds.add(a.test.documentId);
      });
    }
  }

  const filtered: FlatTest[] = allTests
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
      if (params.type && params.type !== "all" && test.type !== params.type) {
        return false;
      }
      if (params.status && params.status !== "all") {
        if (params.status === "completed" && !test.isCompleted) return false;
        if (params.status === "new" && test.isCompleted) return false;
      }
      return true;
    });

  return buildBookTabResult(filtered, params.tab, page, PAGE_SIZE);
}
