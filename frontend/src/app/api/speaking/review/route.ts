import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const attemptId = request.nextUrl.searchParams.get("attemptId");
  if (!attemptId) {
    return NextResponse.json({ error: "attemptId is required" }, { status: 400 });
  }

  const attempts = await find("test-attempts", {
    filters: { documentId: { $eq: attemptId } },
    populate: ["user", "test"],
  });

  const attempt = attempts?.[0];
  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }
  if (attempt.user?.id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const submissions = await find("speaking-submissions", {
    filters: { test_attempt: { documentId: { $eq: attemptId } } },
    populate: ["speaking_topic"],
    sort: ["question_index:asc"],
  });

  return NextResponse.json({
    attempt: {
      documentId: attempt.documentId,
      status: attempt.status,
      bandScore: attempt.band_score,
      timeSpentSeconds: attempt.time_spent_seconds,
      test: attempt.test
        ? { documentId: attempt.test.documentId, title: attempt.test.title }
        : null,
    },
    submissions: (submissions || []).map((s: any) => {
      const topic = s.speaking_topic;
      const questions = Array.isArray(topic?.questions) ? topic.questions : [];
      return {
        documentId: s.documentId,
        questionIndex: s.question_index,
        questionText: questions[s.question_index] || `Question ${s.question_index + 1}`,
        audioUrl: s.audio_url,
        durationSeconds: s.duration_seconds,
        transcript: s.transcript,
        fluencyScore: s.fluency_score,
        lexicalScore: s.lexical_score,
        grammarScore: s.grammar_score,
        pronunciationScore: s.pronunciation_score,
        overallBandScore: s.overall_band_score,
        feedback: s.feedback ? JSON.parse(s.feedback) : null,
      };
    }),
  });
}
