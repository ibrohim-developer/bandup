"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface QuestionData {
  questionId: string;
  questionNumber: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  reviewMode?: boolean;
  correctAnswer?: string;
  isCorrect?: boolean;
  isUnanswered?: boolean;
}

interface MultipleAnswerGroupProps {
  options: string[];
  questions: QuestionData[];
  disabled?: boolean;
  reviewMode?: boolean;
}

const splitLetters = (s: string | undefined) =>
  s ? s.split(",").map((x) => x.trim()).filter(Boolean) : [];

export function MultipleAnswerGroup({
  options,
  questions,
  disabled,
  reviewMode,
}: MultipleAnswerGroupProps) {
  const maxSelections = questions.length;

  // Each sub-question stores the same combined value (e.g. "B,C") so it can be
  // graded against the stored correct_answer ("B,C") on each row.
  const combinedValue = questions.find((q) => q.value)?.value ?? "";
  const selectedLetters = splitLetters(combinedValue);
  const limitReached = selectedLetters.length >= maxSelections;

  // In review mode, prefer the per-row userAnswer (back-compat for older
  // attempts where each row stored only one letter).
  const reviewSelected = reviewMode
    ? Array.from(
        new Set(questions.flatMap((q) => splitLetters(q.value))),
      )
    : selectedLetters;

  const correctLetters = Array.from(
    new Set(questions.flatMap((q) => splitLetters(q.correctAnswer))),
  );

  const allCorrect = questions.every((q) => q.isCorrect);
  const allUnanswered = questions.every((q) => q.isUnanswered);

  const writeAll = (letters: string[]) => {
    const next = [...letters].sort().join(",");
    questions.forEach((q) => q.onChange(next));
  };

  const toggleOption = (optionLetter: string) => {
    if (disabled) return;
    if (selectedLetters.includes(optionLetter)) {
      writeAll(selectedLetters.filter((l) => l !== optionLetter));
    } else {
      if (limitReached) return;
      writeAll([...selectedLetters, optionLetter]);
    }
  };

  const visibleSelected = reviewMode ? reviewSelected : selectedLetters;

  return (
    <div>
      {reviewMode && (
        <div className="flex items-center gap-2 mb-3">
          {allUnanswered ? (
            <span className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400">
              Unanswered
            </span>
          ) : allCorrect ? (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="h-4 w-4" /> Correct
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-red-600">
              <XCircle className="h-4 w-4" /> Incorrect
            </span>
          )}
        </div>
      )}

      {!reviewMode && (
        <p className="text-xs text-muted-foreground mb-2">
          Choose {maxSelections} answers ({selectedLetters.length}/{maxSelections} selected)
        </p>
      )}

      <div className="space-y-2">
        {options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index);
          const isSelected = visibleSelected.includes(optionLetter);
          const isCorrectOption = correctLetters.includes(optionLetter);
          const isDisabledByLimit = !reviewMode && !isSelected && limitReached && !disabled;

          return (
            <div
              key={index}
              id={isSelected ? `question-${questions[0]?.questionId}` : undefined}
              className={cn(
                "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                !disabled && !isDisabledByLimit && "cursor-pointer",
                isDisabledByLimit && "cursor-not-allowed opacity-50",
                reviewMode &&
                  isSelected &&
                  isCorrectOption &&
                  "border-green-500 bg-green-50 dark:bg-green-950/20",
                reviewMode &&
                  isSelected &&
                  !isCorrectOption &&
                  "border-red-500 bg-red-50 dark:bg-red-950/20",
                reviewMode &&
                  !isSelected &&
                  isCorrectOption &&
                  "border-green-300 bg-green-50/50 dark:bg-green-950/10",
                !reviewMode &&
                  isSelected &&
                  "border-primary bg-primary/5",
                !reviewMode && !isSelected && !isDisabledByLimit && "hover:bg-muted/50",
              )}
              onClick={() => toggleOption(optionLetter)}
            >
              <Checkbox
                checked={isSelected}
                disabled={disabled || isDisabledByLimit}
                className="pointer-events-none"
              />
              <Label className={cn("flex-1", !disabled && !isDisabledByLimit && "cursor-pointer")}>
                <span className="font-semibold mr-2">{optionLetter}.</span>
                {option}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
