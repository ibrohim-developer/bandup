import { NextRequest, NextResponse, after } from "next/server";
import { getAuthUser, create } from "@/lib/strapi/api";

// The response itself is fast (~hundreds of ms), but the `after()` background
// callback awaits the writing/evaluate fetch (~10-30s). Keep the function alive
// long enough to let that complete on Vercel.
export const maxDuration = 60;

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

  // For full-mock submissions, kick off evaluation server-side so it runs in
  // parallel with the speaking section. `after()` is critical here: on serverless
  // (Vercel) a plain fire-and-forget fetch dies the moment we return the response,
  // because the runtime terminates the function. `after()` tells the platform to
  // keep the instance alive until the callback finishes — without delaying the
  // response to the client.
  if (fullMockAttemptId) {
    const origin = request.nextUrl.origin;
    const cookie = request.headers.get("cookie") ?? "";
    const attemptDocId = attempt.documentId;
    after(async () => {
      try {
        await fetch(`${origin}/api/writing/evaluate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            cookie,
          },
          body: JSON.stringify({ attemptId: attemptDocId }),
        });
      } catch (err) {
        console.error("[writing/submit] background evaluate failed:", err);
      }
    });
  }

  return NextResponse.json({ attemptId: attempt.documentId });
}
