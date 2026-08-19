import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find } from "@/lib/strapi/api";
import { getPracticeQuota } from "@/lib/practice-quota";
import { PRACTICE_ENABLED } from "@/lib/feature-flags";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Prompt picker feed for the practice section, plus the user's remaining time. */
export async function GET(request: NextRequest) {
  if (!PRACTICE_ENABLED) {
    return new Response("Not found", { status: 404 });
  }
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [prompts, quota] = await Promise.all([
    find("practice-prompts", {
      filters: { is_active: { $eq: true } },
      fields: ["documentId", "title", "category", "difficulty", "opening_question"],
      sort: ["difficulty:asc", "title:asc"],
    }),
    getPracticeQuota(user),
  ]);

  return NextResponse.json(
    {
      prompts: (prompts ?? []).map((p: any) => ({
        id: p.documentId,
        title: p.title,
        category: p.category,
        difficulty: p.difficulty,
        openingQuestion: p.opening_question,
      })),
      quota,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
