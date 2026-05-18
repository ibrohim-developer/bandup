"use client";

import { useMemo } from "react";
import type { TranscriptCue } from "@/lib/transcript-cues";

export function useActiveCueIndex(
  cues: TranscriptCue[] | null | undefined,
  t: number,
): number {
  return useMemo(() => {
    if (!cues?.length) return -1;
    let lo = 0;
    let hi = cues.length - 1;
    let ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (cues[mid].startSec <= t) {
        ans = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  }, [cues, t]);
}
