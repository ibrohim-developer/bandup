import { NextRequest, NextResponse } from "next/server";
import { find, resolveTestId } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const { testId: testIdOrSlug } = await request.json();
  if (!testIdOrSlug) {
    return NextResponse.json(
      { error: "testId is required" },
      { status: 400 }
    );
  }

  const testId = await resolveTestId(testIdOrSlug);
  if (!testId) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 });
  }

  const tasks = await find("writing-tasks", {
    filters: { test: { documentId: { $eq: testId } } },
    sort: ["task_number"],
  });

  if (!tasks?.length) {
    return NextResponse.json(
      { error: "No writing tasks found for this test" },
      { status: 404 }
    );
  }

  const totalTimeLimit = tasks.reduce((sum: number, t: any) => sum + (t.time_limit || 0), 0);

  return NextResponse.json({
    totalTimeLimit,
    tasks: tasks.map((t: any) => ({
      id: t.documentId,
      taskNumber: t.task_number,
      taskType: t.task_type,
      prompt: t.prompt,
      imageUrl: t.image_url,
      minWords: t.min_words,
      timeLimit: t.time_limit,
    })),
  });
}
