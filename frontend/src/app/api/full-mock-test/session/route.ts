import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, create, update, find } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Create a new full mock test session (returns the session documentId).
// If `stage === "lrw"` → create with status=in_progress. Caller then passes
// the returned ID to listening/reading/writing submit routes.
export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { testId } = (await request.json()) as { testId: string };
    if (!testId) return NextResponse.json({ error: "testId required" }, { status: 400 });

    const session = await create("full-mock-test-attempts", {
        user: user.id,
        test: testId,
        status: "in_progress",
        started_at: new Date().toISOString(),
    });

    return NextResponse.json({ sessionId: session.documentId });
}

// Update an existing session with scores + status.
export async function PATCH(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
        sessionId: string;
        listeningScore?: number | null;
        readingScore?: number | null;
        writingScore?: number | null;
        speakingScore?: number | null;
        complete?: boolean;
    };
    if (!body.sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const patch: Record<string, any> = {};
    if (body.listeningScore !== undefined) patch.listening_score = body.listeningScore;
    if (body.readingScore !== undefined) patch.reading_score = body.readingScore;
    if (body.writingScore !== undefined) patch.writing_score = body.writingScore;
    if (body.speakingScore !== undefined) patch.speaking_score = body.speakingScore;

    if (body.complete) {
        patch.status = "completed";
        patch.completed_at = new Date().toISOString();
        const bands = [
            body.listeningScore ?? patch.listening_score,
            body.readingScore ?? patch.reading_score,
            body.writingScore ?? patch.writing_score,
            body.speakingScore ?? patch.speaking_score,
        ].filter((b): b is number => typeof b === "number" && b > 0);
        if (bands.length === 4) {
            patch.overall_band_score = Math.round((bands.reduce((a, b) => a + b, 0) / 4) * 2) / 2;
        }
    }

    await update("full-mock-test-attempts", body.sessionId, patch);
    return NextResponse.json({ ok: true });
}

// Find the latest in-progress session for this user+test (used by speaking page).
export async function GET(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const testId = searchParams.get("testId");
    if (!testId) return NextResponse.json({ error: "testId required" }, { status: 400 });

    // Must use admin token: Strapi 5 rejects `user` as a filter key with user JWT.
    const sessions = await find("full-mock-test-attempts", {
        filters: {
            user: { id: { $eq: user.id } },
            test: { documentId: { $eq: testId } },
            status: { $eq: "in_progress" },
        },
        sort: ["createdAt:desc"],
        pagination: { pageSize: 1 },
    });

    return NextResponse.json({ sessionId: sessions?.[0]?.documentId ?? null });
}
