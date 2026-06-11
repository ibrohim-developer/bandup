import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser, find, create, resolveTestId } from "@/lib/strapi/api";
import { calculateBandScore } from "@/lib/constants/test-config";
import { isAnswerCorrect } from "@/lib/scoring";
import { GUEST_ATTEMPTS_COOKIE, GUEST_ATTEMPTS_MAX_AGE, addGuestAttempt } from "@/lib/guest-claim";
import { ownsFullMockSession } from "@/lib/full-mock";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);

  const { testId: testIdOrSlug, answers, timeSpentSeconds, fullMockAttemptId } = (await request.json()) as {
    testId: string;
    answers: Record<string, string>;
    timeSpentSeconds: number;
    fullMockAttemptId?: string;
  };

  if (!testIdOrSlug || !answers) {
    return NextResponse.json(
      { error: "testId and answers are required" },
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

  const questionDocIds = Object.keys(answers);
  const questions = await find("questions", {
    filters: { documentId: { $in: questionDocIds } },
    fields: ["correct_answer", "question_type"],
  });

  if (!questions?.length) {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }

  const correctAnswerMap = new Map(
    questions.map((q: any) => [q.documentId, q.correct_answer])
  );
  const questionTypeMap = new Map(
    questions.map((q: any) => [q.documentId, q.question_type])
  );

  let rawScore = 0;
  const scoredAnswers = questionDocIds.map((questionId) => {
    const userAnswer = answers[questionId];
    const correctAnswer = correctAnswerMap.get(questionId);
    const isCorrect = isAnswerCorrect(
      questionTypeMap.get(questionId),
      userAnswer,
      correctAnswer
    );
    if (isCorrect) rawScore++;
    return { questionId, userAnswer, isCorrect };
  });

  const bandScore = calculateBandScore(rawScore, "listening");

  const sections = await find("listening-sections", {
    filters: { test: { documentId: { $eq: testId } } },
    populate: { questions: { fields: ["documentId"] } },
  });
  const totalQuestionIds = new Set<string>();
  for (const s of sections ?? []) {
    for (const q of s.questions ?? []) totalQuestionIds.add(q.documentId);
  }
  const totalQuestions = totalQuestionIds.size;

  const attempt = await create("test-attempts", {
    ...(user ? { user: user.id } : {}),
    test: testId,
    module_type: "listening",
    status: "completed",
    raw_score: rawScore,
    total_questions: totalQuestions,
    band_score: bandScore,
    started_at: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
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

  for (const sa of scoredAnswers) {
    await create("user-answers", {
      test_attempt: attempt.documentId,
      question: sa.questionId,
      user_answer: sa.userAnswer,
      is_correct: sa.isCorrect,
      points_earned: sa.isCorrect ? 1 : 0,
    });
  }

  return NextResponse.json({
    attemptId: attempt.documentId,
    rawScore,
    bandScore,
    totalQuestions,
    isGuest: !user,
  });
}
