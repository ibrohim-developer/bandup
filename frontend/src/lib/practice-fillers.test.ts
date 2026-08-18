import { describe, it, expect } from "vitest";
import { FILLER_URLS, pickFiller } from "@/lib/practice-fillers";

describe("pickFiller", () => {
  it("returns a url from the list with its index", () => {
    const { url, index } = pickFiller(null);
    expect(FILLER_URLS[index]).toBe(url);
  });

  it("never repeats the previous clip", () => {
    let last: number | null = null;
    for (let i = 0; i < 200; i++) {
      const { index } = pickFiller(last);
      expect(index).not.toBe(last);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(FILLER_URLS.length);
      last = index;
    }
  });
});
