import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find, update } from "@/lib/strapi/api";

// Mark any in-progress full-mock-test-attempts for this user+test as abandoned.
// Called on fresh entry to /lrw so the next session GET doesn't reuse a stale attempt.
export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { testId } = (await request.json()) as { testId: string };
    if (!testId) return NextResponse.json({ error: "testId required" }, { status: 400 });

    const sessions = await find("full-mock-test-attempts", {
        filters: {
            user: { id: { $eq: user.id } },
            test: { documentId: { $eq: testId } },
            status: { $eq: "in_progress" },
        },
        fields: ["documentId"],
    });

    await Promise.all(
        (sessions ?? []).map((s: { documentId: string }) =>
            update("full-mock-test-attempts", s.documentId, { status: "abandoned" }),
        ),
    );

    return NextResponse.json({ ok: true, abandoned: sessions?.length ?? 0 });
}
