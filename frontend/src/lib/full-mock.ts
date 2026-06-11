import { findOne } from "@/lib/strapi/api";

/**
 * Whether `userId` owns the given full-mock session.
 *
 * Submit routes accept a `fullMockAttemptId` and link the module attempt to
 * that session. Without this check, a user could pass another user's session
 * id and inject their attempt into a stranger's full-mock (corrupting its
 * scores / module set). Callers should reject the submit when this is false.
 */
export async function ownsFullMockSession(
  fullMockAttemptId: string,
  userId: number | string | undefined | null,
): Promise<boolean> {
  if (!fullMockAttemptId || userId == null) return false;
  const session = await findOne("full-mock-test-attempts", fullMockAttemptId, {
    fields: ["status"],
    populate: { user: { fields: ["id"] } },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!session && (session as any).user?.id === userId;
}
