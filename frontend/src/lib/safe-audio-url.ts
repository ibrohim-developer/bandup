/**
 * SSRF guard for user-supplied speaking-audio references.
 *
 * `audio_url` originates from the client (the speaking submit payload), so it
 * must never be fetched as-is — an attacker could point it at cloud metadata
 * (169.254.169.254), internal services, or arbitrary hosts. We only ever fetch
 * files that live under the trusted Strapi uploads origin (or an explicitly
 * allowlisted CDN origin once uploads move to S3/Spaces).
 *
 * Returns a safe absolute URL string to fetch, or null if the input is not a
 * trusted uploads reference.
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Optional extra trusted origins for CDN-hosted uploads, comma-separated
// (e.g. "https://cdn.bandup.uz"). Empty by default — local/Strapi uploads only.
const EXTRA_ALLOWED_ORIGINS = (process.env.MEDIA_ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export function resolveSafeAudioUrl(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;

  let parsed: URL;
  try {
    // Relative paths resolve against the Strapi origin; absolute URLs keep theirs.
    parsed = new URL(raw, STRAPI_URL);
  } catch {
    return null;
  }

  // Only http(s) — blocks file:, gopher:, data:, etc.
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  let strapiOrigin: string;
  try {
    strapiOrigin = new URL(STRAPI_URL).origin;
  } catch {
    return null;
  }

  // Same-origin Strapi uploads must live under /uploads/. Using the parsed
  // pathname (already normalized, so "/uploads/../secret" -> "/secret" is
  // rejected) prevents path-traversal out of the uploads directory.
  if (parsed.origin === strapiOrigin) {
    return parsed.pathname.startsWith("/uploads/") ? parsed.toString() : null;
  }

  // CDN-hosted uploads: the origin must be explicitly allowlisted.
  if (EXTRA_ALLOWED_ORIGINS.includes(parsed.origin)) {
    return parsed.toString();
  }

  return null;
}
