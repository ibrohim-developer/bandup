import { NextRequest, NextResponse } from "next/server";
import { find } from "@/lib/strapi/api";

export async function GET(request: NextRequest) {
  const attemptId = request.nextUrl.searchParams.get("attemptId");
  if (!attemptId) {
    return NextResponse.json({ error: "attemptId is required" }, { status: 400 });
  }

  const attempts = await find("test-attempts", {
    filters: { documentId: { $eq: attemptId } },
  });

  const attempt = attempts?.[0];
  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ status: attempt.status, bandScore: attempt.band_score });
}
