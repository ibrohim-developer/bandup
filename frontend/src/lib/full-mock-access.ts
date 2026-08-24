import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/strapi/api";
import { isPremiumUser } from "@/lib/premium";

/**
 * Full mock test content (listening/reading/writing/speaking "start" routes)
 * is served through the same endpoints standalone practice tests use, so the
 * Premium gate can't live on the route — it has to check the specific test.
 * Returns a 401/403 NextResponse to short-circuit the caller, or null when
 * access is allowed (including: the test isn't a full mock test at all).
 */
export async function checkFullMockAccess(
  request: NextRequest,
  test: { is_full_mock_test?: boolean; is_free_preview?: boolean } | null,
): Promise<NextResponse | null> {
  if (!test?.is_full_mock_test || test.is_free_preview) return null;

  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isPremiumUser(user)) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }
  return null;
}
