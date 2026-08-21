import { describe, it, expect } from "vitest";
import { computeSessionStats, type TranscriptTurn } from "@/lib/practice-stats";

const t = (role: "user" | "assistant", text: string, corrections?: unknown[]): TranscriptTurn =>
  corrections ? { role, text, corrections } : { role, text };

describe("computeSessionStats", () => {
  it("returns zeros for an empty transcript", () => {
    expect(computeSessionStats([], 60)).toEqual({
      totalWords: 0,
      wpm: 0,
      fillerCount: 0,
      longestTurnWords: 0,
      uniqueWords: 0,
      correctionCount: 0,
    });
  });

  it("guards against zero spoken seconds", () => {
    const stats = computeSessionStats([t("user", "hello there")], 0);
    expect(stats.totalWords).toBe(2);
    expect(stats.wpm).toBe(0);
  });

  it("counts only learner turns for word metrics", () => {
    const stats = computeSessionStats(
      [
        t("assistant", "What did you do yesterday in the city center"),
        t("user", "I went to the bazaar"),
      ],
      30
    );
    expect(stats.totalWords).toBe(5);
    expect(stats.wpm).toBe(10); // 5 words / 0.5 min
  });

  it("catches filler variants including stretched ones and 'you know'", () => {
    const stats = computeSessionStats(
      [t("user", "Um, I think, ummm, it was, you know, uh, quite nice, er...")],
      10
    );
    expect(stats.fillerCount).toBe(5); // um, ummm, you know, uh, er
  });

  it("does not flag 'like' or words containing filler substrings", () => {
    const stats = computeSessionStats(
      [t("user", "I like summer because the umbrella weather is nicer")],
      10
    );
    expect(stats.fillerCount).toBe(0);
  });

  it("tracks the longest turn across several", () => {
    const stats = computeSessionStats(
      [t("user", "one two three"), t("user", "one two three four five"), t("user", "one")],
      60
    );
    expect(stats.longestTurnWords).toBe(5);
  });

  it("counts unique words case- and punctuation-insensitively", () => {
    const stats = computeSessionStats([t("user", "Tashkent, tashkent! Beautiful city.")], 10);
    expect(stats.uniqueWords).toBe(3); // tashkent, beautiful, city
  });

  it("sums corrections across turns regardless of role", () => {
    const stats = computeSessionStats(
      [
        t("user", "he go home", [{ original: "he go" }]),
        t("assistant", "Nice!"),
        t("user", "she don't like it", [{ original: "she don't" }, { original: "like it" }]),
      ],
      30
    );
    expect(stats.correctionCount).toBe(3);
  });
});
