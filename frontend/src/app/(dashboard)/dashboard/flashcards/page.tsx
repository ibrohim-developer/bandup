import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { getFlashcardCountByLevel } from "./actions";

export const metadata: Metadata = {
  title: "IELTS Flashcards — Vocabulary Practice",
  description:
    "Study IELTS vocabulary, idioms, and grammar with interactive flashcards. Free preparation on BandUp.",
  alternates: { canonical: "https://bandup.uz/dashboard/flashcards" },
};

const levels = [
  { level: "b1", label: "B1", name: "Intermediate",       description: "Essential IELTS vocabulary for Band 5–6" },
  { level: "b2", label: "B2", name: "Upper-Intermediate", description: "Core academic words for Band 6–7" },
  { level: "c1", label: "C1", name: "Advanced",           description: "Sophisticated vocabulary for Band 7–8" },
  { level: "c2", label: "C2", name: "Proficiency",        description: "Mastery-level words for Band 8–9" },
];

export default async function FlashcardsPage() {
  const counts = await getFlashcardCountByLevel();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-1">Flashcards</h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          Choose your level
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {levels.map(({ level, label, name, description }) => {
          const count = counts[level as keyof typeof counts] ?? 0;
          return (
            <Link
              key={level}
              href={`/dashboard/flashcards/${level}`}
              className="group relative flex flex-col gap-4 rounded-2xl border-2 border-border bg-card p-6 hover:border-foreground/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  {label}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>

              <div>
                <p className="text-lg font-black">{name}</p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>

              <p className="text-xs font-bold text-muted-foreground">
                {count} {count === 1 ? "card" : "cards"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
