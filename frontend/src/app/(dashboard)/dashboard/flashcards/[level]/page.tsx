import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { FlashcardDeck } from "@/components/test/flashcards/flashcard-deck";
import { fetchFlashcardsByLevel } from "../actions";
import { CEFR_LEVELS } from "../constants";

const levelMeta: Record<string, { label: string; name: string }> = {
  b1: { label: "B1", name: "Intermediate" },
  b2: { label: "B2", name: "Upper-Intermediate" },
  c1: { label: "C1", name: "Advanced" },
  c2: { label: "C2", name: "Proficiency" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const meta = levelMeta[level];
  if (!meta) return {};
  return {
    title: `${meta.label} ${meta.name} Flashcards — BandUp`,
    description: `Study ${meta.label} ${meta.name} IELTS vocabulary with interactive flashcards on BandUp.`,
  };
}

export default async function FlashcardLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;

  if (!CEFR_LEVELS.includes(level as (typeof CEFR_LEVELS)[number])) {
    notFound();
  }

  const cards = await fetchFlashcardsByLevel(level);
  const meta = levelMeta[level];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/flashcards"
          className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          All Levels
        </Link>
      </div>

      <div>
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl md:text-3xl font-black">{meta.label} {meta.name}</h2>
        </div>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
          {cards.length} {cards.length === 1 ? "card" : "cards"}
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-muted-foreground font-bold text-sm">
            No flashcards found for this level yet.
          </p>
          <Link
            href="/dashboard/flashcards"
            className="mt-4 text-xs font-bold text-primary hover:underline"
          >
            Back to all levels
          </Link>
        </div>
      ) : (
        <FlashcardDeck cards={cards} />
      )}
    </div>
  );
}
