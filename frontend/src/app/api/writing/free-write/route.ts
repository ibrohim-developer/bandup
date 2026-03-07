import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, create, update } from "@/lib/strapi/api";
import { evaluateEssay } from "@/lib/evaluate-essay";

export const maxDuration = 120;

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, taskType, content, minWords } = (await request.json()) as {
    topic?: string;
    taskType: string;
    content: string;
    minWords: number;
  };

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "Essay content is required" },
      { status: 400 }
    );
  }

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((w: string) => w).length;

  // Create test attempt (test: null for free write)
  const attempt = await create("test-attempts", {
    user: user.id,
    module_type: "writing",
    status: "evaluating",
    completed_at: new Date().toISOString(),
  });

  if (!attempt) {
    return NextResponse.json(
      { error: "Failed to create test attempt" },
      { status: 500 }
    );
  }

  // Create writing submission (writing_task: null for free write)
  const submission = await create("writing-submissions", {
    test_attempt: attempt.documentId,
    content,
    word_count: wordCount,
    submitted_at: new Date().toISOString(),
  });

  if (!submission) {
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }

  // Evaluate the essay
  const prompt = topic?.trim() || "Free writing practice. Evaluate this essay.";
  const evaluation = await evaluateEssay(
    prompt,
    taskType || "essay",
    content,
    minWords || 250
  );

  if (!evaluation) {
    await update("test-attempts", attempt.documentId, {
      status: "completed",
      band_score: null,
    });
    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }

  // Update submission with scores
  await update("writing-submissions", submission.documentId, {
    task_achievement_score: evaluation.taskAchievementScore,
    coherence_score: evaluation.coherenceScore,
    lexical_score: evaluation.lexicalScore,
    grammar_score: evaluation.grammarScore,
    overall_band_score: evaluation.overallBandScore,
    feedback: evaluation.feedback,
  });

  // Update attempt to completed
  await update("test-attempts", attempt.documentId, {
    status: "completed",
    band_score: evaluation.overallBandScore,
  });

  return NextResponse.json({
    attemptId: attempt.documentId,
    evaluation: {
      taskAchievementScore: evaluation.taskAchievementScore,
      coherenceScore: evaluation.coherenceScore,
      lexicalScore: evaluation.lexicalScore,
      grammarScore: evaluation.grammarScore,
      overallBandScore: evaluation.overallBandScore,
      feedback: evaluation.feedback,
    },
  });
}
