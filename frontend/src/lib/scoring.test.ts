import { describe, it, expect } from "vitest";
import { isAnswerCorrect } from "@/lib/scoring";

describe("isAnswerCorrect — free text", () => {
  it("matches identical answers case-insensitively", () => {
    expect(isAnswerCorrect("gap_fill", "Colour", "colour")).toBe(true);
  });

  it("treats thousands separators as equivalent", () => {
    expect(isAnswerCorrect("gap_fill", "60000", "60,000")).toBe(true);
    expect(isAnswerCorrect("gap_fill", "60,000", "60000")).toBe(true);
  });

  it("accepts %, percent and 'per cent' equivalently", () => {
    expect(isAnswerCorrect("gap_fill", "20 percent", "20%")).toBe(true);
    expect(isAnswerCorrect("gap_fill", "20%", "20 per cent")).toBe(true);
  });

  it("accepts British/American spellings in both directions", () => {
    expect(isAnswerCorrect("gap_fill", "color", "colour")).toBe(true);
    expect(isAnswerCorrect("gap_fill", "organise", "organize")).toBe(true);
    expect(isAnswerCorrect("gap_fill", "metres", "meters")).toBe(true);
  });

  it("does not create false positives", () => {
    expect(isAnswerCorrect("gap_fill", "four", "for")).toBe(false);
    expect(isAnswerCorrect("gap_fill", "hour", "our")).toBe(false);
    expect(isAnswerCorrect("gap_fill", "30 percent", "20 percent")).toBe(false);
    expect(isAnswerCorrect("gap_fill", "cat", "dog")).toBe(false);
  });

  it("never auto-passes a blank correct answer", () => {
    expect(isAnswerCorrect("gap_fill", "", "")).toBe(false);
  });
});

describe("isAnswerCorrect — tfng / ynng equivalence", () => {
  it("treats TRUE and YES as equivalent in both directions", () => {
    expect(isAnswerCorrect("ynng", "TRUE", "YES")).toBe(true);
    expect(isAnswerCorrect("tfng", "YES", "TRUE")).toBe(true);
  });

  it("treats FALSE and NO as equivalent in both directions", () => {
    expect(isAnswerCorrect("ynng", "FALSE", "NO")).toBe(true);
    expect(isAnswerCorrect("tfng", "NO", "FALSE")).toBe(true);
  });

  it("keeps NOT GIVEN distinct", () => {
    expect(isAnswerCorrect("ynng", "NOT GIVEN", "YES")).toBe(false);
    expect(isAnswerCorrect("tfng", "TRUE", "NOT GIVEN")).toBe(false);
    expect(isAnswerCorrect("ynng", "NOT GIVEN", "NOT GIVEN")).toBe(true);
  });

  it("does not pass a blank correct answer", () => {
    expect(isAnswerCorrect("ynng", "YES", "")).toBe(false);
  });
});

describe("isAnswerCorrect — mcq_multiple", () => {
  it("is order-independent and case-insensitive", () => {
    expect(isAnswerCorrect("mcq_multiple", "E,C", "C,E")).toBe(true);
    expect(isAnswerCorrect("mcq_multiple", "c,e", "C,E")).toBe(true);
  });

  it("requires the full set (no partial credit)", () => {
    expect(isAnswerCorrect("mcq_multiple", "C", "C,E")).toBe(false);
    expect(isAnswerCorrect("mcq_multiple", "", "C,E")).toBe(false);
  });
});
