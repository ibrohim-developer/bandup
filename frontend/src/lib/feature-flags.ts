/**
 * Ship-gates for features that are merged but not yet launched.
 *
 * Client-safe (NEXT_PUBLIC_), so the same constant hides nav entries and
 * guards the route handlers behind them. Default is OFF: a feature has to be
 * switched on deliberately in the environment, so merging to main never
 * exposes it by itself.
 */

/**
 * Turn-based AI speaking practice (/dashboard/practice).
 *
 * Off until the opening questions are seeded in production
 * (frontend/scripts/seed-practice-prompts.ts) — without them the topic list is
 * empty and a session has nothing to open with. The API routes are gated too,
 * not just the links: they spend Vertex quota and are reachable by URL.
 */
export const PRACTICE_ENABLED = process.env.NEXT_PUBLIC_PRACTICE_ENABLED === "true";
