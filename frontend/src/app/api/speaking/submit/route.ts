import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, create, findOne } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface TopicRecordings {
  topicId: string;
  recordings: { questionIndex: number; audioUrl: string; durationSeconds: number }[];
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const timeSpentSeconds: number = body.timeSpentSeconds ?? 0;

  // Normalize: support both multi-topic and legacy single-topic payload
  let testDocumentId: string | null = null;
  let topicGroups: TopicRecordings[];

  if (body.topics && Array.isArray(body.topics)) {
    // New multi-topic format: { testId, topics: [...], timeSpentSeconds }
    testDocumentId = body.testId ?? null;
    topicGroups = body.topics;
  } else if (body.topicId && body.recordings) {
    // Legacy single-topic format: { topicId, recordings: [...], timeSpentSeconds }
    const topic = await findOne("speaking-topics", body.topicId, { populate: ["test"] });
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }
    testDocumentId = topic.test?.documentId || null;
    topicGroups = [{ topicId: body.topicId, recordings: body.recordings }];
  } else {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!topicGroups.length || topicGroups.some((g) => !g.recordings?.length)) {
    return NextResponse.json({ error: "Missing recordings" }, { status: 400 });
  }

  const fullMockAttemptId: string | undefined = body.fullMockAttemptId;

  // Create ONE test attempt
  const attempt = await create("test-attempts", {
    user: user.id,
    test: testDocumentId,
    module_type: "speaking",
    status: "evaluating",
    started_at: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
    completed_at: new Date().toISOString(),
    time_spent_seconds: timeSpentSeconds,
    ...(fullMockAttemptId ? { full_mock_test_attempt: fullMockAttemptId } : {}),
  });

  // Create speaking submissions for all topics
  for (const group of topicGroups) {
    for (const rec of group.recordings) {
      await create("speaking-submissions", {
        test_attempt: attempt.documentId,
        speaking_topic: group.topicId,
        question_index: rec.questionIndex,
        audio_url: rec.audioUrl,
        duration_seconds: rec.durationSeconds,
      });
    }
  }

  return NextResponse.json({ attemptId: attempt.documentId });
}
