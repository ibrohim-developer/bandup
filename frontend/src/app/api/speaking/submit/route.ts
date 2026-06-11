import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, create, findOne } from "@/lib/strapi/api";
import { resolveSafeAudioUrl } from "@/lib/safe-audio-url";
import { ownsFullMockSession } from "@/lib/full-mock";

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
  let topicGroups: TopicRecordings[];

  if (body.topics && Array.isArray(body.topics)) {
    // New multi-topic format: { testId, topics: [...], timeSpentSeconds }
    topicGroups = body.topics;
  } else if (body.topicId && body.recordings) {
    // Legacy single-topic format: { topicId, recordings: [...], timeSpentSeconds }
    topicGroups = [{ topicId: body.topicId, recordings: body.recordings }];
  } else {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!topicGroups.length || topicGroups.some((g) => !g.recordings?.length)) {
    return NextResponse.json({ error: "Missing recordings" }, { status: 400 });
  }

  // SSRF guard: audio_url is fetched server-side during evaluation, so every
  // recording must point at a trusted uploads location — never an arbitrary
  // host (e.g. cloud metadata or internal services).
  for (const group of topicGroups) {
    for (const rec of group.recordings) {
      if (!resolveSafeAudioUrl(rec.audioUrl)) {
        return NextResponse.json({ error: "Invalid audio reference" }, { status: 400 });
      }
    }
  }

  // Validate every topic exists and derive the authoritative test from them.
  // We deliberately ignore the client-supplied testId so a user can't attach
  // submissions to an arbitrary/mismatched test, and we reject a payload whose
  // topics don't all belong to the same test.
  let testDocumentId: string | null = null;
  let firstTopic = true;
  for (const group of topicGroups) {
    const topic = await findOne("speaking-topics", group.topicId, {
      fields: ["id"],
      populate: { test: { fields: ["documentId"] } },
    });
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }
    const topicTestId = (topic as any).test?.documentId ?? null;
    if (firstTopic) {
      testDocumentId = topicTestId;
      firstTopic = false;
    } else if (topicTestId !== testDocumentId) {
      return NextResponse.json({ error: "Topics belong to different tests" }, { status: 400 });
    }
  }

  const fullMockAttemptId: string | undefined = body.fullMockAttemptId;

  // Only link this attempt to a full-mock session the caller actually owns,
  // otherwise a user could inject their attempt into a stranger's session.
  if (fullMockAttemptId && !(await ownsFullMockSession(fullMockAttemptId, user.id))) {
    return NextResponse.json({ error: "Invalid full mock session" }, { status: 403 });
  }

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
