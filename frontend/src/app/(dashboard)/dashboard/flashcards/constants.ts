export const CEFR_LEVELS = ["b1", "b2", "c1", "c2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];
