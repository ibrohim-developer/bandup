"use client";

import { useState, useTransition, useEffect } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/app/api/videos/quiz/route";

interface VideoQuizProps {
  videoId: string;
  initialQuestions: QuizQuestion[];
}

export function VideoQuiz({ videoId, initialQuestions }: VideoQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [selected, setSelected] = useState<(number | null)[]>(
    new Array(initialQuestions.length).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [generating, startGenerating] = useTransition();

  // Auto-generate quiz on load if none exists yet
  useEffect(() => {
    if (initialQuestions.length === 0) {
      startGenerating(async () => {
        const res = await fetch("/api/videos/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId }),
        });
        const data = await res.json();
        if (data.questions?.length) {
          setQuestions(data.questions);
          setSelected(new Array(data.questions.length).fill(null));
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(qIndex: number, optIndex: number) {
    if (submitted) return;
    setSelected((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  }

  function handleSubmit() {
    if (selected.some((s) => s === null)) return;
    setSubmitted(true);
  }

  function handleRetry() {
    setSelected(new Array(questions.length).fill(null));
    setSubmitted(false);
  }

  const score = submitted
    ? questions.filter((q, i) => selected[i] === q.answer).length
    : 0;

  if (generating || (questions.length === 0 && !generating)) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-bold">Generating your quiz...</p>
        <p className="text-xs text-muted-foreground">
          Reading the video transcript with AI
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black">Comprehension Quiz</h3>
        {submitted && (
          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        )}
      </div>

      {submitted && (
        <div
          className={cn(
            "rounded-xl p-4 text-center font-black",
            score >= 4
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : score >= 3
                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
          )}
        >
          {score} / {questions.length} correct
          {score === questions.length && " — Perfect score!"}
        </div>
      )}

      <div className="space-y-5">
        {questions.map((q, qi) => (
          <div key={qi} className="space-y-2">
            <p className="text-sm font-black">
              {qi + 1}. {q.question}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt, oi) => {
                const isSelected = selected[qi] === oi;
                const isCorrect = oi === q.answer;
                const showResult = submitted;

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(qi, oi)}
                    disabled={submitted}
                    className={cn(
                      "flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border text-sm font-bold transition-all",
                      !showResult && isSelected
                        ? "border-primary bg-primary/10"
                        : !showResult
                          ? "border-border hover:border-primary/50 hover:bg-muted"
                          : isCorrect
                            ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : isSelected && !isCorrect
                              ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                              : "border-border opacity-60",
                    )}
                  >
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                      {showResult && isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : showResult && isSelected && !isCorrect ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          {String.fromCharCode(65 + oi)}
                        </span>
                      )}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="text-xs text-muted-foreground pl-1">
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected.some((s) => s === null)}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-black text-sm hover:opacity-90 transition-all disabled:opacity-40"
        >
          Submit Answers
        </button>
      )}
    </div>
  );
}
