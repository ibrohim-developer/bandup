import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser, find, update } from "@/lib/strapi/api";
import { GUEST_ATTEMPTS_COOKIE, canClaimAttempt } from "@/lib/guest-claim";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { attemptId } = (await request.json()) as { attemptId?: string };
  if (!attemptId) {
    return NextResponse.json({ error: "attemptId required" }, { status: 400 });
  }

  // Only the browser that created this guest attempt (and therefore holds it in
  // its signed cookie) may claim it. Without this, any logged-in user could
  // claim any orphaned attempt by guessing its documentId.
  const cookieStore = await cookies();
  if (!canClaimAttempt(cookieStore.get(GUEST_ATTEMPTS_COOKIE)?.value, attemptId)) {
    return NextResponse.json({ error: "Not allowed to claim this attempt" }, { status: 403 });
  }

  const [attempt] = await find("test-attempts", {
    filters: { documentId: { $eq: attemptId } },
    populate: { user: { fields: ["id"] } },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (attempt.user) {
    return NextResponse.json({ error: "Already claimed" }, { status: 409 });
  }

  await update("test-attempts", attemptId, { user: user.id });
  return NextResponse.json({ success: true });
}
