import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Normalize options: convert [{optionKey, optionText}] objects to string[] */
function normalizeOptions(options: any): string[] | null {
  if (!options || !Array.isArray(options)) return null;
  if (options.length === 0) return [];
  // Already strings
  if (typeof options[0] === 'string') return options;
  // Object format from imported data: {optionKey: "A", optionText: "..."}
  if (typeof options[0] === 'object' && options[0].optionText !== undefined) {
    return options.map((o: any) => o.optionText || o.optionKey || '');
  }
  return options;
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { testId } = await request.json();
  if (!testId) {
    return NextResponse.json({ error: "testId is required" }, { status: 400 });
  }

  // Fetch reading passages with question groups and questions populated
  const passages = await find("reading-passages", {
    filters: { test: { documentId: { $eq: testId } } },
    sort: ["passage_number"],
    populate: {
      question_groups: {
        sort: ["group_number"],
        fields: ["group_number", "question_type", "instruction", "context", "points", "options", "metadata"],
        populate: {
          questions: {
            sort: ["question_number"],
            fields: ["question_number", "question_type", "question_text", "options", "metadata"],
          },
        },
      },
      questions: {
        sort: ["question_number"],
        fields: ["question_number", "question_type", "question_text", "options", "metadata"],
      },
    },
  });

  if (!passages?.length) {
    return NextResponse.json(
      { error: "No passages found for this test" },
      { status: 404 }
    );
  }

  const passagesWithQuestions = passages.map((passage: any) => {
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

    // Fallback: questions not in any group (legacy data)
    const ungroupedQuestions = (passage.questions ?? []).map((q: any) => ({
      id: q.documentId,
      questionNumber: q.question_number,
      type: q.question_type,
      text: q.question_text,
      options: normalizeOptions(q.options),
      metadata: q.metadata,
    }));

    // Build flat questions array: prefer grouped questions, fall back to ungrouped
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
      timeLimit: passage.time_limit,
      questionGroups,
      questions: allQuestions,
    };
  });

  const totalTimeLimit = passages.reduce(
    (sum: number, p: any) => sum + (p.time_limit || 0),
    0
  );

  return NextResponse.json({
    totalTimeLimit,
    passages: passagesWithQuestions,
  });
}
