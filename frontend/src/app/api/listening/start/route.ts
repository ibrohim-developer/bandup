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

  // Fetch listening sections with their questions populated
  const sections = await find("listening-sections", {
    filters: { test: { documentId: { $eq: testId } } },
    sort: ["section_number"],
    populate: {
      questions: {
        sort: ["question_number"],
        fields: ["question_number", "question_type", "question_text", "options", "metadata"],
      },
    },
  });

  if (!sections?.length) {
    return NextResponse.json(
      { error: "No sections found for this test" },
      { status: 404 }
    );
  }

  const sectionsWithQuestions = sections.map((section: any) => ({
    id: section.documentId,
    sectionNumber: section.section_number,
    audioUrl: section.audio_url,
    audioDurationSeconds: section.audio_duration_seconds,
    transcript: section.transcript,
    timeLimit: section.time_limit,
    questions: (section.questions ?? []).map((q: any) => ({
      id: q.documentId,
      questionNumber: q.question_number,
      type: q.question_type,
      text: q.question_text,
      options: q.options,
      metadata: q.metadata,
    })),
  }));

  const totalTimeLimit = sections.reduce(
    (sum: number, s: any) => sum + (s.time_limit || 0),
    0
  );

  return NextResponse.json({
    totalTimeLimit,
    sections: sectionsWithQuestions,
  });
}
