import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, create, update, find, findOne, resolveTestId } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Create a new full mock test session (returns the session documentId).
// If `stage === "lrw"` → create with status=in_progress. Caller then passes
// the returned ID to listening/reading/writing submit routes.
export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { testId: testIdOrSlug } = (await request.json()) as { testId: string };
    if (!testIdOrSlug) return NextResponse.json({ error: "testId required" }, { status: 400 });

    const testId = await resolveTestId(testIdOrSlug);
    if (!testId) return NextResponse.json({ error: "Test not found" }, { status: 404 });

    const session = await create("full-mock-test-attempts", {
        user: user.id,
        test: testId,
        status: "in_progress",
        started_at: new Date().toISOString(),
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bandup.uz";
    await update("full-mock-test-attempts", session.documentId, {
        result_url: `${origin}/dashboard/full-mock-test/results/${session.documentId}`,
    });

    return NextResponse.json({ sessionId: session.documentId });
}

// Update an existing session's status. Scores are NOT taken from the client —
// they're derived server-side from the linked module attempts (see below).
export async function PATCH(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // `complete` is the only client-controlled input now. Any score fields in
    // the body are intentionally ignored — they used to be written verbatim,
    // letting a user forge their own band scores.
    const body = (await request.json()) as { sessionId: string; complete?: boolean };
    if (!body.sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const session = await findOne("full-mock-test-attempts", body.sessionId, {
        fields: ["status"],
        populate: {
            user: { fields: ["id"] },
            test_attempts: { fields: ["module_type", "band_score"] },
        },
    });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    // Ownership: only the session's owner may update it. Without this, any
    // logged-in user could PATCH another user's session by id and overwrite
    // their scores or flip status to completed (IDOR).
    if ((session as any).user?.id !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Authoritative per-module band scores come from the linked module attempts,
    // not the request body. Last numeric band_score per module wins.
    const attempts = (((session as any).test_attempts ?? []) as Array<{
        module_type?: string;
        band_score?: number | null;
    }>);
    const byModule: Record<string, number> = {};
    for (const a of attempts) {
        if (a.module_type && typeof a.band_score === "number") {
            byModule[a.module_type] = a.band_score;
        }
    }

    const patch: Record<string, any> = {};
    if ("listening" in byModule) patch.listening_score = byModule.listening;
    if ("reading" in byModule) patch.reading_score = byModule.reading;
    if ("writing" in byModule) patch.writing_score = byModule.writing;
    if ("speaking" in byModule) patch.speaking_score = byModule.speaking;

    if (body.complete) {
        // Only mark completed when all four module attempts are linked. Without
        // this, finishing speaking first would close the session before LRW could
        // join it, orphaning the speaking attempt in a separate session.
        const linked = new Set<string>(
            attempts.map((a) => a.module_type).filter((m): m is string => !!m),
        );
        const allModulesPresent =
            linked.has("listening") &&
            linked.has("reading") &&
            linked.has("writing") &&
            linked.has("speaking");

        if (allModulesPresent) {
            patch.status = "completed";
            patch.completed_at = new Date().toISOString();

            const bands = [
                byModule.listening,
                byModule.reading,
                byModule.writing,
                byModule.speaking,
            ].filter((b): b is number => typeof b === "number");
            if (bands.length === 4) {
                // Official IELTS rounding: average to nearest whole or half band.
                // .25 rounds up to the next half; .75 rounds up to the next whole.
                const avg = bands.reduce((a, b) => a + b, 0) / 4;
                const whole = Math.floor(avg);
                const frac = avg - whole;
                let rounded: number;
                if (frac < 0.25) rounded = whole;
                else if (frac < 0.75) rounded = whole + 0.5;
                else rounded = whole + 1;
                patch.overall_band_score = rounded;
            }
        }
    }

    await update("full-mock-test-attempts", body.sessionId, patch);
    return NextResponse.json({ ok: true, completed: patch.status === "completed" });
}

// Find the latest in-progress session for this user+test (used by speaking page).
export async function GET(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const testIdOrSlug = searchParams.get("testId");
    if (!testIdOrSlug) return NextResponse.json({ error: "testId required" }, { status: 400 });

    const testId = await resolveTestId(testIdOrSlug);
    if (!testId) return NextResponse.json({ sessionId: null });

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
