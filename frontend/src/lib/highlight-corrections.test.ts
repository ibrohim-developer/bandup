import { describe, it, expect } from "vitest";
import { anchorCorrections } from "@/lib/highlight-corrections";

const marked = (text: string, corrections: Parameters<typeof anchorCorrections>[1]) =>
  anchorCorrections(text, corrections)
    .segments.filter((s) => s.correction)
    .map((s) => s.text);

describe("anchorCorrections", () => {
  const gc = (original: string) => ({
    original,
    corrected: "are",
    explanation: "Use 'are' with 'you'.",
  });

  it("anchors a quote onto the matching span", () => {
    const { segments } = anchorCorrections("What is you doing today?", [gc("is you")]);
    expect(segments.map((s) => s.text).join("")).toBe("What is you doing today?");
    expect(marked("What is you doing today?", [gc("is you")])).toEqual(["is you"]);
  });

  it("matches across case and punctuation differences", () => {
    expect(marked("What is you doing?", [gc("What is you")])).toEqual(["What is you"]);
    expect(marked("Yesterday, I go to school.", [gc("i go")])).toEqual(["I go"]);
  });

  it("does not match inside a longer word", () => {
    // The motivating bug: "is" must never highlight the "is" inside "this".
    const { unmatched } = anchorCorrections("This isn't right", [gc("is")]);
    expect(unmatched).toHaveLength(1);
  });

  it("skips a substring occurrence to reach the real standalone word", () => {
    // "This is right" contains "is" twice — inside "This", then standalone.
    const { segments } = anchorCorrections("This is right", [gc("is")]);
    const markedIdx = segments.findIndex((s) => s.correction);
    expect(segments[markedIdx].text).toBe("is");
    expect(segments[markedIdx - 1].text).toBe("This ");
  });

  it("reports quotes it cannot locate instead of guessing", () => {
    const result = anchorCorrections("I went to the shop", [gc("I goed to the shop")]);
    expect(result.unmatched).toHaveLength(1);
    expect(result.segments.every((s) => s.correction === null)).toBe(true);
  });

  it("keeps the earlier of two overlapping quotes", () => {
    const result = anchorCorrections("what is you doing", [gc("is you"), gc("you doing")]);
    expect(result.segments.filter((s) => s.correction)).toHaveLength(1);
    expect(result.unmatched).toHaveLength(1);
  });

  it("preserves the full transcript verbatim in all cases", () => {
    const text = "Um, what is you doing there, my friend?";
    for (const corrections of [
      [gc("is you")],
      [gc("nonexistent phrase")],
      [gc("is you"), gc("you doing")],
      [],
    ]) {
      const { segments } = anchorCorrections(text, corrections);
      expect(segments.map((s) => s.text).join("")).toBe(text);
    }
  });

  it("handles empty and missing input", () => {
    expect(anchorCorrections("", [gc("x")]).segments).toEqual([]);
    expect(anchorCorrections("hello", undefined).segments).toEqual([
      { text: "hello", correction: null },
    ]);
  });
});
