/**
 * AI-evaluation Energy costs — client-safe constants (no server imports), so
 * card components can render the cost of a test. The server-side quota logic
 * in `lib/quota.ts` re-exports these as its source of truth.
 */

export type AiModule = "writing" | "speaking";

export const ENERGY_COSTS: Record<AiModule, number> = {
  writing: 2,
  speaking: 4,
};

export const WRITING_ENERGY_COST = ENERGY_COSTS.writing;
export const SPEAKING_ENERGY_COST = ENERGY_COSTS.speaking;
