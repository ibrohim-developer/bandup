import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find, update } from "@/lib/strapi/api";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { attemptId } = (await request.json()) as { attemptId?: string };
  if (!attemptId) {
    return NextResponse.json({ error: "attemptId required" }, { status: 400 });
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
