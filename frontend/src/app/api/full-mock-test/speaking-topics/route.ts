import { NextRequest, NextResponse } from "next/server";
import { find } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(request: NextRequest) {
    const testId = request.nextUrl.searchParams.get("testId");
    if (!testId) {
        return NextResponse.json(
            { error: "testId is required" },
            { status: 400 },
        );
    }

    const speakingTopics = await find("speaking-topics", {
        filters: { test: { documentId: { $eq: testId } } },
        sort: ["part_number"],
    });

    if (!speakingTopics?.length) {
        return NextResponse.json(
            { error: "No speaking topics found for this test" },
            { status: 404 },
        );
    }

    const topics = speakingTopics.map((topic: any) => ({
        documentId: topic.documentId,
        topic: topic.topic,
        partNumber: topic.part_number,
        preparationTime: topic.preparation_time_seconds,
        speakingTime: topic.speaking_time_seconds,
        questions: Array.isArray(topic.questions) ? topic.questions : [],
    }));

    return NextResponse.json({ topics });
}
