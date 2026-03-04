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

  // Fetch writing tasks for this test
  const tasks = await find("writing-tasks", {
    filters: { test: { documentId: { $eq: testDocId } } },
    sort: ["task_number"],
  });

  // Fetch writing submissions for this attempt
  const submissions = await find("writing-submissions", {
    filters: { test_attempt: { documentId: { $eq: attemptId } } },
    populate: ["writing_task"],
  });

  return NextResponse.json({
    attempt: {
      id: attempt.documentId,
      testId: testDocId,
      moduleType: attempt.module_type,
      status: attempt.status,
      bandScore: attempt.band_score,
      timeSpentSeconds: attempt.time_spent_seconds,
      completedAt: attempt.completed_at,
    },
    tasks: (tasks ?? []).map((t: any) => ({
      id: t.documentId,
      taskNumber: t.task_number,
      taskType: t.task_type,
      prompt: t.prompt,
      imageUrl: t.image_url,
      minWords: t.min_words,
      sampleAnswer: t.sample_answer,
    })),
    submissions: (submissions ?? []).map((s: any) => ({
      id: s.documentId,
      taskId: s.writing_task?.documentId,
      content: s.content,
      wordCount: s.word_count,
      taskAchievementScore: s.task_achievement_score,
      coherenceScore: s.coherence_score,
      lexicalScore: s.lexical_score,
      grammarScore: s.grammar_score,
      overallBandScore: s.overall_band_score,
      feedback: s.feedback,
    })),
  });
}
