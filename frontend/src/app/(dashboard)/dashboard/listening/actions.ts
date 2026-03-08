"use server";

import { unstable_cache } from "next/cache";
import { find } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";

const PAGE_SIZE = 20;

interface ListeningTest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  questions: number;
  sections: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const getListeningTests = unstable_cache(
  async (): Promise<ListeningTest[]> => {
    const tests = await find("tests", {
      filters: {
        module_type: { $eq: "listening" },
        is_published: { $eq: true },
      },
      fields: ["title", "description", "difficulty_level"],
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
      return {
        id: test.documentId,
        title: test.title,
        description: test.description ?? "",
        difficulty: test.difficulty_level ?? "medium",
        duration: 30,
        questions: sections.reduce(
          (sum: number, s: any) => sum + (s.questions?.length ?? 0),
          0,
        ),
        sections: sections.length,
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
      if (
        params.sections &&
        params.sections !== "all" &&
        test.sections !== Number(params.sections)
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
