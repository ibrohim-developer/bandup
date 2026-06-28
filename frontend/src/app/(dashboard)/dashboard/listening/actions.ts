"use server";

import { unstable_cache } from "next/cache";
import { find } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";
import { buildBookTabResult, type FlatTest } from "@/lib/tests/book-grouping";

const PAGE_SIZE = 20;

type ListeningTest = Omit<FlatTest, "isCompleted">;

/* eslint-disable @typescript-eslint/no-explicit-any */
const getListeningTests = unstable_cache(
  async (): Promise<ListeningTest[]> => {
    const tests = await find("tests", {
      filters: {
        module_type: { $eq: "listening" },
        is_published: { $eq: true },
      },
      fields: ["title", "difficulty_level", "slug"],
      sort: ["createdAt:desc"],
      populate: {
        listening_sections: {
          fields: ["section_number"],
          populate: { questions: { fields: ["question_number"] } },
        },
      },
    });

    if (!tests?.length) return [];

    return tests.map((test: any) => {
      const sections = test.listening_sections ?? [];
      const questions = sections.reduce(
        (sum: number, s: any) => sum + (s.questions?.length ?? 0),
        0,
      );
      const partNumbers: number[] = sections
        .map((s: any) => s.section_number)
        .filter((n: any) => typeof n === "number");
      const partLabels = [...new Set(partNumbers)]
        .sort((a, b) => a - b)
        .map((n) => `Part ${n}`)
        .join(" · ");
      return {
        id: test.documentId,
        slug: test.slug ?? test.documentId,
        title: test.title,
        difficulty: test.difficulty_level ?? "medium",
        metric: partLabels || `${questions} questions`,
        type: "academic",
      };
    });
  },
  ["listening-tests"],
  { revalidate: 300 },
);

export async function fetchListeningTests(
  params: Record<string, string | undefined>,
  page: number,
) {
  const allTests = await getListeningTests();

  const completedTestIds = new Set<string>();
  const token = await getToken();
  if (token) {
    const user = await getCurrentUser();
    if (user) {
      const attempts = await find("test-attempts", {
        filters: {
          user: { id: { $eq: user.id } },
          module_type: { $eq: "listening" },
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
      if (params.status && params.status !== "all") {
        if (params.status === "completed" && !test.isCompleted) return false;
        if (params.status === "new" && test.isCompleted) return false;
      }
      return true;
    });

  return buildBookTabResult(filtered, params.tab, page, PAGE_SIZE);
}
