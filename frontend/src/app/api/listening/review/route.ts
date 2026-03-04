import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const attemptId = searchParams.get("attemptId");

  if (!attemptId) {
    return NextResponse.json(
      { error: "attemptId is required" },
      { status: 400 }
    );
  }

  // Fetch the test attempt
  const attempts = await find("test-attempts", {
    filters: {
      documentId: { $eq: attemptId },
      user: { id: { $eq: user.id } },
    },
    populate: ["test"],
  });

  const attempt = attempts?.[0];
  if (!attempt) {
    return NextResponse.json(
      { error: "Test attempt not found" },
      { status: 404 }
    );
  }

  const testDocId = attempt.test?.documentId;

  // Fetch sections with questions populated
  const sections = await find("listening-sections", {
    filters: { test: { documentId: { $eq: testDocId } } },
    sort: ["section_number"],
    populate: {
      questions: {
        sort: ["question_number"],
        fields: ["question_number", "question_type", "question_text", "options", "metadata", "correct_answer"],
      },
    },
  });

  // Fetch user answers for this attempt
  const userAnswers = await find("user-answers", {
    filters: { test_attempt: { documentId: { $eq: attemptId } } },
    populate: ["question"],
  });

  const userAnswersMap = new Map(
    (userAnswers ?? []).map((ua: any) => [ua.question?.documentId, ua])
  );

  const allQuestions = (sections ?? []).flatMap((s: any) => s.questions ?? []);
  const enrichedUserAnswers = allQuestions.map((q: any) => {
    const ua = userAnswersMap.get(q.documentId);
    return {
      question_id: q.documentId,
      user_answer: ua?.user_answer || "",
      is_correct: ua?.is_correct ?? false,
      correct_answer: q.correct_answer || "",
    };
  });

  const sectionsWithQuestions = (sections ?? []).map((section: any) => ({
    id: section.documentId,
    sectionNumber: section.section_number,
    audioUrl: section.audio_url,
    audioDurationSeconds: section.audio_duration_seconds,
    transcript: section.transcript,
    questions: (section.questions ?? []).map((q: any) => ({
      id: q.documentId,
      questionNumber: q.question_number,
      type: q.question_type,
      text: q.question_text,
      options: q.options,
      metadata: q.metadata,
    })),
  }));

  return NextResponse.json({
    sections: sectionsWithQuestions,
    userAnswers: enrichedUserAnswers,
  });
}
