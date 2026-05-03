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
    submissions: Array<{ taskId: string; content: string; typedChars?: number }>;
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

    const typedChars = sub.typedChars ?? 0;
    // Treat as paste-suspected when the final content is materially longer
    // than what was actually typed. The 32-char cushion absorbs IME quirks
    // and small autocomplete replacements that bypass the typed counter.
    const pasteSuspected = sub.content.length > typedChars + 32;

    await create("writing-submissions", {
      test_attempt: attempt.documentId,
      writing_task: sub.taskId,
      content: sub.content,
      word_count: wordCount,
      typed_chars: typedChars,
      paste_suspected: pasteSuspected,
    });
  }

  return NextResponse.json({ attemptId: attempt.documentId });
}
