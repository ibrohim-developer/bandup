import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

function normalizeOptions(options: any): string[] | null {
  if (!options || !Array.isArray(options)) return null;
  if (options.length === 0) return [];
  if (typeof options[0] === 'string') return options;
  if (typeof options[0] === 'object' && options[0].optionText !== undefined) {
    return options.map((o: any) => o.optionText || o.optionKey || '');
  }
  return options;
}

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

  // Fetch passages with question groups and questions populated
  const passages = await find("reading-passages", {
    filters: { test: { documentId: { $eq: testDocId } } },
    sort: ["passage_number"],
    populate: {
      question_groups: {
        sort: ["group_number"],
        fields: ["group_number", "question_type", "instruction", "context", "points", "options", "metadata"],
        populate: {
          questions: {
            sort: ["question_number"],
            fields: ["question_number", "question_type", "question_text", "options", "metadata", "correct_answer"],
          },
        },
      },
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

  // Build enriched answers for ALL questions (prefer grouped questions)
  const allQuestions = (passages ?? []).flatMap((p: any) => {
    const grouped = (p.question_groups ?? []).flatMap((g: any) => g.questions ?? []);
    return grouped.length > 0 ? grouped : (p.questions ?? []);
  });
  const enrichedUserAnswers = allQuestions.map((q: any) => {
    const ua = userAnswersMap.get(q.documentId);
    return {
      question_id: q.documentId,
      user_answer: ua?.user_answer || "",
      is_correct: ua?.is_correct ?? false,
      correct_answer: q.correct_answer || "",
    };
  });

  const passagesWithQuestions = (passages ?? []).map((passage: any) => {
    const questionGroups = (passage.question_groups ?? []).map((g: any) => ({
      id: g.documentId,
      groupNumber: g.group_number,
      type: g.question_type,
      instruction: g.instruction,
      context: g.context || null,
      points: g.points,
      options: g.question_type === 'flow_chart_completion' ? (g.options || null) : normalizeOptions(g.options),
      metadata: g.metadata,
      questions: (g.questions ?? []).map((q: any) => ({
        id: q.documentId,
        questionNumber: q.question_number,
        type: q.question_type,
        text: q.question_text,
        options: normalizeOptions(q.options),
        metadata: q.metadata,
      })),
    }));

    const ungroupedQuestions = (passage.questions ?? []).map((q: any) => ({
      id: q.documentId,
      questionNumber: q.question_number,
      type: q.question_type,
      text: q.question_text,
      options: normalizeOptions(q.options),
      metadata: q.metadata,
    }));

    const groupedQuestions = questionGroups.flatMap((g: any) => g.questions);
    const allQuestions = groupedQuestions.length > 0
      ? groupedQuestions.sort((a: any, b: any) => a.questionNumber - b.questionNumber)
      : ungroupedQuestions;

    return {
      id: passage.documentId,
      passageNumber: passage.passage_number,
      title: passage.title,
      content: passage.content,
      wordCount: passage.word_count,
      questionGroups,
      questions: allQuestions,
    };
  });

  return NextResponse.json({
    passages: passagesWithQuestions,
    userAnswers: enrichedUserAnswers,
  });
}
