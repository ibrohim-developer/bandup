import { describe, it, expect } from "vitest";
import {
  buildSystemPrompt,
  buildTurnBriefing,
  isEffectivelySilent,
  TRANSCRIBE_SYSTEM_PROMPT,
  type PracticeContext,
} from "@/lib/practice-conversation";

const base: PracticeContext = {
  title: "A trip you remember",
  openingQuestion: "Tell me about a trip that stayed with you.",
  difficulty: "intermediate",
};

describe("buildSystemPrompt", () => {
  it("uses the speaking-coach persona (Part 2 prompts)", () => {
    const p = buildSystemPrompt(base);
    expect(p).toContain("speaking coach");
    expect(p).toContain("PART-2-STYLE PROMPTS");
  });

  it("applies the correction rules but never transcribes", () => {
    const p = buildSystemPrompt(base);
    for (const marker of ["CORRECTION RULES", "verbatim substring"]) {
      expect(p).toContain(marker);
    }
    // Transcription is a separate, context-free call — the converse prompt must
    // never claim to transcribe audio itself.
    expect(p).not.toContain("You are a microphone");
    expect(p).toContain("do NOT transcribe audio yourself");
  });
});

describe("buildTurnBriefing", () => {
  it("includes the topic and level, without cue-card details", () => {
    const b = buildTurnBriefing(base);
    expect(b).toContain("A trip you remember");
    expect(b).not.toContain("CUE CARD");
  });
});

describe("TRANSCRIBE_SYSTEM_PROMPT", () => {
  it("declares non-speech noises and forbids inventing context", () => {
    expect(TRANSCRIBE_SYSTEM_PROMPT).toContain("Throat clears, coughs");
    expect(TRANSCRIBE_SYSTEM_PROMPT).toContain("no_speech");
    expect(TRANSCRIBE_SYSTEM_PROMPT).toContain("NO conversation context");
    // The transcriber must not be told the question — that isolation is the fix.
    expect(TRANSCRIBE_SYSTEM_PROMPT).not.toContain("reply");
  });
});

describe("isEffectivelySilent", () => {
  it("treats empty or whitespace transcripts as silent", () => {
    expect(isEffectivelySilent("")).toBe(true);
    expect(isEffectivelySilent("   ")).toBe(true);
  });

  it("treats filler-only noise (a stray throat sound) as silent", () => {
    for (const t of ["uh", "Um…", "mm", "uh, um", "hmm.", "ah uh mm"]) {
      expect(isEffectivelySilent(t)).toBe(true);
    }
  });

  it("keeps any real content", () => {
    for (const t of ["uh I read a book", "yes", "mm I think so"]) {
      expect(isEffectivelySilent(t)).toBe(false);
    }
  });
});
