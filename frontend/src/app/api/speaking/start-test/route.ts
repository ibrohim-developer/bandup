import { NextRequest, NextResponse } from "next/server";
import { findOne } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: NextRequest) {
  const testId = request.nextUrl.searchParams.get("testId");
  if (!testId) {
    return NextResponse.json({ error: "testId is required" }, { status: 400 });
  }

  const test = await findOne("tests", testId, {
    fields: ["title"],
    populate: {
      speaking_topics: {
        fields: ["topic", "part_number", "preparation_time_seconds", "speaking_time_seconds", "questions"],
      },
    },
  });

  if (!test) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 });
  }

  const topics = (test.speaking_topics ?? [])
    .sort((a: any, b: any) => a.part_number - b.part_number)
    .map((t: any) => ({
      documentId: t.documentId,
      topic: t.topic,
      partNumber: t.part_number,
      preparationTime: t.preparation_time_seconds,
      speakingTime: t.speaking_time_seconds,
      questions: Array.isArray(t.questions) ? t.questions : [],
    }));

  return NextResponse.json({
    test: {
      documentId: test.documentId,
      title: test.title,
      topics,
    },
  });
}
