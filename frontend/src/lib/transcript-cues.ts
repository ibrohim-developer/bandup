export type TranscriptCue = {
  text: string;
  startSec: number;
  endSec?: number;
};

export function coerceCues(raw: unknown): TranscriptCue[] | null {
  if (!Array.isArray(raw)) return null;
  const out: TranscriptCue[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const text = typeof obj.text === "string" ? obj.text : null;
    const startSec =
      typeof obj.startSec === "number"
        ? obj.startSec
        : typeof obj.start_sec === "number"
          ? obj.start_sec
          : null;
    if (text === null || startSec === null || !Number.isFinite(startSec)) continue;
    const endSecRaw =
      typeof obj.endSec === "number"
        ? obj.endSec
        : typeof obj.end_sec === "number"
          ? obj.end_sec
          : undefined;
    const endSec =
      endSecRaw !== undefined && Number.isFinite(endSecRaw) ? endSecRaw : undefined;
    out.push({ text, startSec, endSec });
  }
  out.sort((a, b) => a.startSec - b.startSec);
  return out.length ? out : null;
}
