import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, create } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { testId, submissions, timeSpentSeconds, fullMockAttemptId } = (await request.json()) as {
    testId: string;
    submissions: Array<{ taskId: string; content: string }>;
    timeSpentSeconds: number;
    fullMockAttemptId?: string;
  };

  if (!testId || !submissions?.length) {
    return NextResponse.json(
      { error: "testId and submissions are required" },
      { status: 400 }
    );
  }

  // Create the test attempt with "evaluating" status
  const attempt = await create("test-attempts", {
    user: user.id,
    test: testId,
    module_type: "writing",
    status: "evaluating",
    completed_at: new Date().toISOString(),
    time_spent_seconds: timeSpentSeconds,
    ...(fullMockAttemptId ? { full_mock_test_attempt: fullMockAttemptId } : {}),
  });

  if (!attempt) {
    return NextResponse.json(
      { error: "Failed to create test attempt" },
      { status: 500 }
    );
  }

  // Save writing submissions with null scores
  for (const sub of submissions) {
    const wordCount = sub.content
      .trim()
      .split(/\s+/)
      .filter((w: string) => w).length;

    await create("writing-submissions", {
      test_attempt: attempt.documentId,
      writing_task: sub.taskId,
      content: sub.content,
      word_count: wordCount,
    });
  }

  return NextResponse.json({ attemptId: attempt.documentId });
}
