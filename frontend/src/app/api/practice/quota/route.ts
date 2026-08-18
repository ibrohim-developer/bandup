import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/strapi/api";
import { getPracticeQuota } from "@/lib/practice-quota";

/**
 * Remaining practice time — feeds the sidebar badge.
 *
 * Separate from `/api/quota`, which reports the Energy pool for graded
 * evaluations. The two currencies never interact.
 */
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quota = await getPracticeQuota(user);
  return NextResponse.json(quota, { headers: { "Cache-Control": "no-store" } });
}
