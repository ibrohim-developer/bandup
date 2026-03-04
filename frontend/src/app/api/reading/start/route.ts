import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { testId } = await request.json();
  if (!testId) {
    return NextResponse.json({ error: "testId is required" }, { status: 400 });
  }

  // Fetch reading passages with their questions populated
  const passages = await find("reading-passages", {
    filters: { test: { documentId: { $eq: testId } } },
    sort: ["passage_number"],
    populate: {
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

  const passagesWithQuestions = passages.map((passage: any) => ({
    id: passage.documentId,
    passageNumber: passage.passage_number,
    title: passage.title,
    content: passage.content,
    wordCount: passage.word_count,
    timeLimit: passage.time_limit,
    questions: (passage.questions ?? []).map((q: any) => ({
      id: q.documentId,
      questionNumber: q.question_number,
      type: q.question_type,
      text: q.question_text,
      options: q.options,
      metadata: q.metadata,
    })),
  }));

  const totalTimeLimit = passages.reduce(
    (sum: number, p: any) => sum + (p.time_limit || 0),
    0
  );

  return NextResponse.json({
    totalTimeLimit,
    passages: passagesWithQuestions,
  });
}
