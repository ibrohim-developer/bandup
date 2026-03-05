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

export function MultipleAnswerGroup({
  options,
  questions,
  disabled,
  reviewMode,
}: MultipleAnswerGroupProps) {
  // Each sub-question holds one selected answer (e.g. "C" or "E")
  const selectedLetters = questions
    .map((q) => q.value)
    .filter(Boolean);

  const correctLetters = questions
    .map((q) => q.correctAnswer)
    .filter(Boolean) as string[];

  const allCorrect = questions.every((q) => q.isCorrect);
  const allUnanswered = questions.every((q) => q.isUnanswered);

  const toggleOption = (optionLetter: string) => {
    if (disabled) return;

    if (selectedLetters.includes(optionLetter)) {
      // Deselect: find which sub-question has this value and clear it
      const qIdx = questions.findIndex((q) => q.value === optionLetter);
      if (qIdx >= 0) questions[qIdx].onChange("");
    } else {
      // Select: find first empty sub-question slot
      const emptyIdx = questions.findIndex((q) => !q.value);
      if (emptyIdx >= 0) {
        questions[emptyIdx].onChange(optionLetter);
      } else {
        // All slots full — replace the last one
        questions[questions.length - 1].onChange(optionLetter);
      }
    }
  };

  return (
    <div>
      {/* Review badge */}
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

      <div className="space-y-2">
        {options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index);
          const isSelected = selectedLetters.includes(optionLetter);
          const isCorrectOption = correctLetters.includes(optionLetter);

          return (
            <div
              key={index}
              id={
                isSelected
                  ? `question-${questions[questions.findIndex((q) => q.value === optionLetter)]?.questionId}`
                  : undefined
              }
              className={cn(
                "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                !disabled && "cursor-pointer",
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
                !reviewMode && !isSelected && "hover:bg-muted/50",
              )}
              onClick={() => toggleOption(optionLetter)}
            >
              <Checkbox
                checked={isSelected}
                disabled={disabled}
                className="pointer-events-none"
              />
              <Label className={cn("flex-1", !disabled && "cursor-pointer")}>
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
