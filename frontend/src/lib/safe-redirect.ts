/**
 * Returns `path` only if it is a safe same-site relative path, otherwise the
 * `fallback`. Prevents open redirects via a user-controlled `?redirect=` param:
 * absolute URLs ("https://evil.com"), protocol-relative ("//evil.com"), and
 * backslash tricks ("/\\evil.com") are all rejected.
 */
export function safeRedirectPath(
  path: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!path || typeof path !== "string") return fallback;
  if (path[0] !== "/") return fallback; // must be rooted at the site
  if (path[1] === "/" || path[1] === "\\") return fallback; // // or /\ → off-site
  return path;
}
