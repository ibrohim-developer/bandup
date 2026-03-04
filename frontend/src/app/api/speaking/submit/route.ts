import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, create, findOne } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topicId, recordings, timeSpentSeconds } = (await request.json()) as {
    topicId: string;
    recordings: { questionIndex: number; audioUrl: string; durationSeconds: number }[];
    timeSpentSeconds: number;
  };

  if (!topicId || !recordings?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Get the topic to find its test
  const topic = await findOne("speaking-topics", topicId, { populate: ["test"] });
  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  // Create test attempt
  const attempt = await create("test-attempts", {
    user: user.id,
    test: topic.test?.documentId || null,
    module_type: "speaking",
    status: "evaluating",
    started_at: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
    completed_at: new Date().toISOString(),
    time_spent_seconds: timeSpentSeconds,
  });

  // Create speaking submissions
  for (const rec of recordings) {
    await create("speaking-submissions", {
      test_attempt: attempt.documentId,
      speaking_topic: topicId,
      question_index: rec.questionIndex,
      audio_url: rec.audioUrl,
      duration_seconds: rec.durationSeconds,
    });
  }

  return NextResponse.json({ attemptId: attempt.documentId });
}
