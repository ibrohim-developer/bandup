import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find, update } from "@/lib/strapi/api";
import { evaluateEssay } from "@/lib/evaluate-essay";

export const maxDuration = 120;

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { attemptId } = (await request.json()) as { attemptId: string };
  if (!attemptId) {
    return NextResponse.json(
      { error: "attemptId is required" },
      { status: 400 }
    );
  }

  // Verify the attempt belongs to this user and is in "evaluating" status
  const attempts = await find("test-attempts", {
    filters: { documentId: { $eq: attemptId } },
    populate: ["user", "test", "full_mock_test_attempt"],
  });

  const attempt = attempts?.[0];
  if (!attempt) {
    return NextResponse.json(
      { error: "Test attempt not found" },
      { status: 404 }
    );
  }

  if (attempt.user?.id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (attempt.status !== "evaluating" && attempt.status !== "failed") {
    return NextResponse.json({ error: "Already evaluated" }, { status: 400 });
  }

  // Flip a previously-failed attempt back to evaluating so the UI shows the spinner during retry.
  if (attempt.status === "failed") {
    await update("test-attempts", attemptId, { status: "evaluating" });
  }

  // Fetch writing submissions for this attempt
  const submissions = await find("writing-submissions", {
    filters: { test_attempt: { documentId: { $eq: attemptId } } },
    populate: ["writing_task"],
  });

  if (!submissions?.length) {
    return NextResponse.json(
      { error: "No submissions found" },
      { status: 404 }
    );
  }

  // Evaluate all essays in parallel
  const evaluationPromises = submissions.map(async (sub: any) => {
    const task = sub.writing_task;
    if (!task) return { submissionDocId: sub.documentId, evaluation: null, task: null };

    const evaluation = await evaluateEssay(
      task.prompt,
      task.task_type,
      sub.content,
      task.min_words
    );

    return { submissionDocId: sub.documentId, evaluation, task };
  });

  const results = await Promise.all(evaluationPromises);

  // Update each writing submission with scores
  for (const r of results) {
    if (!r.evaluation) continue;

    await update("writing-submissions", r.submissionDocId, {
      task_achievement_score: r.evaluation.taskAchievementScore,
      coherence_score: r.evaluation.coherenceScore,
      lexical_score: r.evaluation.lexicalScore,
      grammar_score: r.evaluation.grammarScore,
      overall_band_score: r.evaluation.overallBandScore,
      feedback: r.evaluation.feedback,
    });
  }

  // Calculate overall band score
  const scoredResults = results.filter((r) => r.evaluation !== null);
  let bandScore: number | null = null;

  if (scoredResults.length > 0) {
    if (scoredResults.length === 1) {
      bandScore = scoredResults[0].evaluation!.overallBandScore;
    } else {
      const sorted = scoredResults.sort(
        (a, b) =>
          ((a.task as any)?.task_number ?? 0) -
          ((b.task as any)?.task_number ?? 0)
      );
      const task1Band = sorted[0].evaluation!.overallBandScore;
      const task2Band = sorted[1].evaluation!.overallBandScore;
      const weighted = (task1Band + task2Band * 2) / 3;
      bandScore = Math.round(weighted * 2) / 2;
    }
  }

  // If any Gemini call failed, mark the attempt as failed so the UI can offer a clean retry
  // instead of saving a partial result (or a fake band 0 when all failed).
  if (scoredResults.length < submissions.length) {
    await update("test-attempts", attemptId, { status: "failed" });
    return NextResponse.json(
      { error: "Evaluation failed for one or more submissions" },
      { status: 502 }
    );
  }

  await update("test-attempts", attemptId, {
    status: "completed",
    band_score: bandScore,
  });

  return NextResponse.json({ success: true, bandScore });
}
