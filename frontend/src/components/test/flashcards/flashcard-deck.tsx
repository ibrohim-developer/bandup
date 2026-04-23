"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, RotateCcw, Shuffle, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/app/(dashboard)/dashboard/flashcards/actions";

const categoryColor: Record<string, string> = {
  vocabulary: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
  grammar: "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400",
  idioms: "text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400",
  collocations: "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400",
  academic: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400",
};

interface PronunciationData {
  phonetic: string | null;
  audioUrl: string | null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [deck, setDeck] = useState(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loadingPronunciation, setLoadingPronunciation] = useState(false);
  const pronunciationCache = useRef<Map<string, PronunciationData>>(new Map());
  const [currentPronunciation, setCurrentPronunciation] = useState<PronunciationData | null>(null);

  const card = deck[index];
  const total = deck.length;

  function next() {
    setFlipped(false);
    setCurrentPronunciation(null);
    setTimeout(() => setIndex((i) => Math.min(i + 1, total - 1)), 150);
  }

  function prev() {
    setFlipped(false);
    setCurrentPronunciation(null);
    setTimeout(() => setIndex((i) => Math.max(i - 1, 0)), 150);
  }

  function handleShuffle() {
    setFlipped(false);
    setCurrentPronunciation(null);
    setIndex(0);
    setTimeout(() => setDeck(shuffle(cards)), 150);
  }

  function handleReset() {
    setFlipped(false);
    setCurrentPronunciation(null);
    setIndex(0);
    setTimeout(() => setDeck(cards), 150);
  }

  async function handlePronunciation(e: React.MouseEvent) {
    e.stopPropagation();

    const word = card.word.toLowerCase();
    const cached = pronunciationCache.current.get(word);

    if (cached) {
      setCurrentPronunciation(cached);
      if (cached.audioUrl) new Audio(cached.audioUrl).play().catch(() => {});
      return;
    }

    setLoadingPronunciation(true);
    try {
      const res = await fetch(`/api/pronunciation/${encodeURIComponent(word)}`);
      const data: PronunciationData = await res.json();
      pronunciationCache.current.set(word, data);
      setCurrentPronunciation(data);
      if (data.audioUrl) new Audio(data.audioUrl).play().catch(() => {});
    } catch {
      pronunciationCache.current.set(word, { phonetic: null, audioUrl: null });
    } finally {
      setLoadingPronunciation(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress */}
      <div className="w-full max-w-xl">
        <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2">
          <span>{index + 1} / {total}</span>
          <span>{Math.round(((index + 1) / total) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-xl cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "260px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card border-2 border-border rounded-2xl p-8 text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full",
                categoryColor[card.category],
              )}
            >
              {card.category}
            </span>
            <p className="text-3xl md:text-4xl font-black tracking-tight">
              {card.word}
            </p>
            {currentPronunciation?.phonetic && (
              <p className="text-sm text-muted-foreground font-medium">
                {currentPronunciation.phonetic}
              </p>
            )}
            <p className="text-xs text-muted-foreground font-bold">
              tap to reveal definition
            </p>

            {/* Pronunciation button — outside flip zone via stopPropagation */}
            <button
              onClick={handlePronunciation}
              disabled={loadingPronunciation}
              className="absolute bottom-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              title="Pronounce"
            >
              {loadingPronunciation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-primary text-primary-foreground rounded-2xl p-8 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-lg font-black leading-snug">{card.definition}</p>
            {card.example_sentence && (
              <p className="text-sm opacity-80 italic border-t border-primary-foreground/20 pt-3 w-full">
                &ldquo;{card.example_sentence}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="p-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={prev}
          disabled={index === 0}
          className="p-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={next}
          disabled={index === total - 1}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-black text-sm hover:opacity-90 transition-all disabled:opacity-30 flex items-center gap-2"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={handleShuffle}
          className="p-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
          title="Shuffle"
        >
          <Shuffle className="h-4 w-4" />
        </button>
      </div>

      {index === total - 1 && (
        <div className="text-center">
          <p className="text-sm font-black text-primary mb-2">
            You&apos;ve finished the deck!
          </p>
          <button
            onClick={handleReset}
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
