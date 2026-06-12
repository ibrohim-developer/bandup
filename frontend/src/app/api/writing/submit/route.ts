import { NextRequest, NextResponse, after } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser, create, resolveTestId } from "@/lib/strapi/api";
import { GUEST_ATTEMPTS_COOKIE, GUEST_ATTEMPTS_MAX_AGE, addGuestAttempt } from "@/lib/guest-claim";
import { ownsFullMockSession } from "@/lib/full-mock";

// The response itself is fast (~hundreds of ms), but the `after()` background
// callback awaits the writing/evaluate fetch (~10-30s). Keep the function alive
// long enough to let that complete on Vercel.
export const maxDuration = 60;

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);

  const { testId: testIdOrSlug, submissions, timeSpentSeconds, fullMockAttemptId } = (await request.json()) as {
    testId: string;
    submissions: Array<{ taskId: string; content: string; typedChars?: number }>;
    timeSpentSeconds: number;
    fullMockAttemptId?: string;
  };

  if (!testIdOrSlug || !submissions?.length) {
    return NextResponse.json(
      { error: "testId and submissions are required" },
      { status: 400 }
    );
  }

  const testId = await resolveTestId(testIdOrSlug);
  if (!testId) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 });
  }

  // Only link this attempt to a full-mock session the caller actually owns,
  // otherwise a user could inject their attempt into a stranger's session.
  if (fullMockAttemptId && !(await ownsFullMockSession(fullMockAttemptId, user?.id))) {
    return NextResponse.json({ error: "Invalid full mock session" }, { status: 403 });
  }

  // Create the test attempt with "evaluating" status
  const attempt = await create("test-attempts", {
    ...(user ? { user: user.id } : {}),
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

  // Guest attempt: bind it to this browser so only this browser can claim it.
  if (!user) {
    const cookieStore = await cookies();
    cookieStore.set(
      GUEST_ATTEMPTS_COOKIE,
      addGuestAttempt(cookieStore.get(GUEST_ATTEMPTS_COOKIE)?.value, attempt.documentId),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: GUEST_ATTEMPTS_MAX_AGE,
      },
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

  return NextResponse.json({ attemptId: attempt.documentId, isGuest: !user });
}
