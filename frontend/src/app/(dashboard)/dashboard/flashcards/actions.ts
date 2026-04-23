"use server";

import { unstable_cache } from "next/cache";
import { find } from "@/lib/strapi/api";
import type { CefrLevel } from "./constants";

export interface Flashcard {
  id: string;
  word: string;
  definition: string;
  example_sentence: string;
  category: "vocabulary" | "grammar" | "idioms" | "collocations" | "academic";
  difficulty: "b1" | "b2" | "c1" | "c2";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const getAllFlashcards = unstable_cache(
  async (): Promise<Flashcard[]> => {
    const cards = await find("flashcards", {
      filters: { is_published: { $eq: true } },
      fields: ["word", "definition", "example_sentence", "category", "difficulty"],
      sort: ["difficulty:asc", "category:asc"],
      pagination: { pageSize: 1000 },
    });

    if (!cards?.length) return [];

    return cards.map((c: any) => ({
      id: c.documentId,
      word: c.word,
      definition: c.definition,
      example_sentence: c.example_sentence ?? "",
      category: c.category ?? "vocabulary",
      difficulty: c.difficulty ?? "b2",
    }));
  },
  ["flashcards"],
  { revalidate: 300 },
);

export async function fetchFlashcardsByLevel(level: string): Promise<Flashcard[]> {
  const all = await getAllFlashcards();
  return all.filter((c) => c.difficulty === level);
}

export async function getFlashcardCountByLevel(): Promise<Record<CefrLevel, number>> {
  const all = await getAllFlashcards();
  const counts = { b1: 0, b2: 0, c1: 0, c2: 0 };
  for (const c of all) {
    if (c.difficulty in counts) counts[c.difficulty as CefrLevel]++;
  }
  return counts;
}
