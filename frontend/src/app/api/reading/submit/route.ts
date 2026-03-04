import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find, create } from "@/lib/strapi/api";
import { calculateBandScore } from "@/lib/constants/test-config";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { testId, answers, timeSpentSeconds } = (await request.json()) as {
    testId: string;
    answers: Record<string, string>;
    timeSpentSeconds: number;
  };

  if (!testId || !answers) {
    return NextResponse.json(
      { error: "testId and answers are required" },
      { status: 400 }
    );
  }

  // Fetch correct answers for all answered questions
  const questionDocIds = Object.keys(answers);
  const questions = await find("questions", {
    filters: { documentId: { $in: questionDocIds } },
    fields: ["correct_answer"],
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

  const normalizeAnswer = (answer: string) =>
    answer.split(",").map((s) => s.trim().toLowerCase()).sort().join(",");

  let rawScore = 0;
  const scoredAnswers = questionDocIds.map((questionId) => {
    const userAnswer = answers[questionId];
    const correctAnswer = correctAnswerMap.get(questionId);
    const isCorrect =
      correctAnswer !== undefined &&
      normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
    if (isCorrect) rawScore++;
    return { questionId, userAnswer, isCorrect };
  });

  const bandScore = calculateBandScore(rawScore);

  // Create the test attempt
  const attempt = await create("test-attempts", {
    user: user.id,
    test: testId,
    module_type: "reading",
    status: "completed",
    raw_score: rawScore,
    band_score: bandScore,
    completed_at: new Date().toISOString(),
    time_spent_seconds: timeSpentSeconds,
  });

  if (!attempt) {
    return NextResponse.json(
      { error: "Failed to create test attempt" },
      { status: 500 }
    );
  }

  // Insert all user answers
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
    totalQuestions: questionDocIds.length,
  });
}
