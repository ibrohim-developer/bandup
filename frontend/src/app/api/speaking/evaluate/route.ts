import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find, update } from "@/lib/strapi/api";
import { evaluateSpeaking } from "@/lib/evaluate-speaking";

export const maxDuration = 120;

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { attemptId } = (await request.json()) as { attemptId: string };
  if (!attemptId) {
    return NextResponse.json({ error: "attemptId is required" }, { status: 400 });
  }

  // Verify the attempt
  const attempts = await find("test-attempts", {
    filters: { documentId: { $eq: attemptId } },
    populate: ["user"],
  });

  const attempt = attempts?.[0];
  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }
  if (attempt.user?.id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (attempt.status !== "evaluating") {
    return NextResponse.json({ error: "Already evaluated" }, { status: 400 });
  }

  // Lock against concurrent re-fires (e.g. results page reload while audio scoring is still running).
  // Cap the lock at maxDuration so a crashed eval doesn't freeze the attempt forever.
  const LOCK_MS = 120 * 1000;
  const startedAt = (attempt as any).evaluation_started_at
    ? new Date((attempt as any).evaluation_started_at).getTime()
    : 0;
  if (startedAt && Date.now() - startedAt < LOCK_MS) {
    return NextResponse.json(
      { error: "Evaluation in progress" },
      { status: 409 }
    );
  }

  // Claim the lock immediately so a parallel request bounces off the check above.
  await update("test-attempts", attemptId, {
    evaluation_started_at: new Date().toISOString(),
  });

  // Fetch submissions
  const submissions = await find("speaking-submissions", {
    filters: { test_attempt: { documentId: { $eq: attemptId } } },
    populate: ["speaking_topic"],
    sort: ["question_index:asc"],
  });

  if (!submissions?.length) {
    return NextResponse.json({ error: "No submissions found" }, { status: 404 });
  }

  // Evaluate all submissions in parallel. A full mock has ~9 questions; running them
  // serially took ~3 min because each Gemini Pro call is ~20s. Parallel = ~20-30s total.
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const results = await Promise.all(
    submissions.map(async (sub: any) => {
      const topic = sub.speaking_topic;
      const questions = Array.isArray(topic?.questions) ? topic.questions : [];
      const questionText = questions[sub.question_index] || `Question ${sub.question_index + 1}`;

      const audioUrl = sub.audio_url?.startsWith("http")
        ? sub.audio_url
        : `${STRAPI_URL}${sub.audio_url}`;

      try {
        const audioRes = await fetch(audioUrl);
        if (!audioRes.ok) {
          console.error(`[speaking/evaluate] Failed to fetch audio: ${audioRes.status}`);
          return null;
        }

        const audioBuffer = await audioRes.arrayBuffer();
        // Strapi serves files with the proper Content-Type based on extension.
        const audioMime = (audioRes.headers.get("content-type") || "audio/webm").split(";")[0].trim();
        const evaluation = await evaluateSpeaking(
          questionText,
          topic?.topic || "",
          topic?.part_number || 1,
          Buffer.from(audioBuffer),
          user.id,
          audioMime
        );

        if (!evaluation) return null;

        await update("speaking-submissions", sub.documentId, {
          transcript: evaluation.transcript,
          fluency_score: evaluation.fluencyScore,
          lexical_score: evaluation.lexicalScore,
          grammar_score: evaluation.grammarScore,
          pronunciation_score: evaluation.pronunciationScore,
          overall_band_score: evaluation.overallBandScore,
          feedback: JSON.stringify(evaluation.feedback),
        });

        return evaluation.overallBandScore;
      } catch (err) {
        console.error(`[speaking/evaluate] Error evaluating submission:`, err);
        return null;
      }
    })
  );

  const scored = results.filter((b): b is number => typeof b === "number");
  const bandScore = scored.length > 0
    ? Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 2) / 2
    : null;

  await update("test-attempts", attemptId, {
    status: "completed",
    band_score: bandScore,
  });

  return NextResponse.json({ success: true, bandScore });
}
