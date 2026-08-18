import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/strapi/api";
import { getQuotaStatus } from "@/lib/quota";

/** Current user's AI evaluation quota — feeds the indicator on the writing/speaking pages. */
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = await getQuotaStatus(user);
  return NextResponse.json(status, {
    headers: { "Cache-Control": "no-store" },
  });
}
