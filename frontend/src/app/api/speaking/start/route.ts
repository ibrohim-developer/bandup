import { NextRequest, NextResponse } from "next/server";
import { findOne } from "@/lib/strapi/api";

export async function GET(request: NextRequest) {
  const topicId = request.nextUrl.searchParams.get("topicId");
  if (!topicId) {
    return NextResponse.json({ error: "topicId is required" }, { status: 400 });
  }

  const topic = await findOne("speaking-topics", topicId, {
    populate: ["test"],
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  const questions = Array.isArray(topic.questions) ? topic.questions : [];

  return NextResponse.json({
    topic: {
      documentId: topic.documentId,
      topic: topic.topic,
      partNumber: topic.part_number,
      preparationTime: topic.preparation_time_seconds,
      speakingTime: topic.speaking_time_seconds,
      questions,
      test: topic.test
        ? { documentId: topic.test.documentId, title: topic.test.title }
        : null,
    },
  });
}
