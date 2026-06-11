/**
 * Binds guest (not-logged-in) test attempts to the browser that created them,
 * so only that browser can later claim them into an account.
 *
 * When a guest submits a test we create an ownerless `test-attempt` and record
 * its documentId in a signed, httpOnly cookie. Claiming requires the attemptId
 * to be present in that cookie — otherwise any logged-in user could claim any
 * orphaned attempt just by knowing its (enumerable) documentId and sweep up
 * strangers' results.
 *
 * The cookie is HMAC-signed with a server-only secret so the client cannot
 * forge it (the documentIds themselves are not secret).
 */
import crypto from "crypto";

export const GUEST_ATTEMPTS_COOKIE = "guest_attempts";
export const GUEST_ATTEMPTS_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

const MAX_IDS = 30; // cap cookie size; keep the most recent attempts
const SECRET = process.env.STRAPI_API_TOKEN || "";

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

/** Encode + sign a list of attempt documentIds into a cookie value. */
export function encodeGuestAttempts(ids: string[]): string {
  const payload = Buffer.from(JSON.stringify(ids), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Verify the signature and return the attempt ids, or [] if missing/tampered. */
export function decodeGuestAttempts(cookieValue: string | undefined | null): string[] {
  if (!cookieValue || !SECRET) return [];
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return [];
  const payload = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
  const expected = sign(payload);
  // Constant-time comparison; timingSafeEqual requires equal-length buffers.
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return [];
  }
  try {
    const ids = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Array.isArray(ids) ? ids.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Append an attempt id to the (verified) existing cookie and re-encode. */
export function addGuestAttempt(
  cookieValue: string | undefined | null,
  attemptId: string,
): string {
  const ids = decodeGuestAttempts(cookieValue);
  if (!ids.includes(attemptId)) ids.push(attemptId);
  return encodeGuestAttempts(ids.slice(-MAX_IDS));
}

/** Whether the browser holding this cookie is allowed to claim the attempt. */
export function canClaimAttempt(
  cookieValue: string | undefined | null,
  attemptId: string,
): boolean {
  if (!attemptId) return false;
  return decodeGuestAttempts(cookieValue).includes(attemptId);
}
