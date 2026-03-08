"use client";

import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FillInBlankProps {
  questionId: string;
  questionNumber: number;
  questionText: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  reviewMode?: boolean;
  correctAnswer?: string;
  isCorrect?: boolean;
  isUnanswered?: boolean;
}

export function FillInBlank({
  questionId,
  questionNumber,
  questionText,
  value,
  onChange,
  disabled,
  reviewMode,
  correctAnswer,
  isCorrect,
  isUnanswered,
}: FillInBlankProps) {
  const getQuestionBadge = () => {
    if (!reviewMode) return null;

    if (isUnanswered) {
      return (
        <span className="ml-2 text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400">
          Unanswered
        </span>
      );
    }

    if (isCorrect) {
      return <CheckCircle className="ml-2 h-5 w-5 text-green-600 inline" />;
    } else {
      return <XCircle className="ml-2 h-5 w-5 text-red-600 inline" />;
    }
  };

  const displayValue = reviewMode && isUnanswered ? "N/A" : value;

  // Check if question has inline blank (marked with _____)
  const hasInlineBlank = questionText.includes("_____");

  if (hasInlineBlank) {
    const parts = questionText.split("_____");
    return (
      <div id={`question-${questionId}`} className="space-y-3">
        <div className="text-sm leading-relaxed flex flex-wrap items-center gap-1">
          {parts.map((part, index) => (
            <span key={index} className="inline-flex items-center gap-1">
              {part}
              {index < parts.length - 1 && (
                <Input
                  value={displayValue}
                  onChange={(e) => onChange(e.target.value)}
                  className={cn(
                    "inline-block w-32 h-8 text-center mx-1",
                    reviewMode && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                    reviewMode && !isCorrect && !isUnanswered && "border-red-500 bg-red-50 dark:bg-red-950/20",
                    reviewMode && isUnanswered && "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-500",
                  )}
                  placeholder={`${questionNumber}`}
                  disabled={disabled}
                  autoComplete="off"
                />
              )}
            </span>
          ))}
          {getQuestionBadge()}
        </div>
      </div>
    );
  }

  const isPlaceholderText = /^-{2,}$/.test(questionText.trim());

  return (
    <div id={`question-${questionId}`} className="space-y-3">
      {!isPlaceholderText && (
        <p className="text-sm leading-relaxed text-gray-800">
          {questionText}
          {getQuestionBadge()}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Input
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${questionNumber} ...`}
          autoComplete="off"
          className={cn(
            "max-w-md",
            reviewMode && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
            reviewMode && !isCorrect && !isUnanswered && "border-red-500 bg-red-50 dark:bg-red-950/20",
            reviewMode && isUnanswered && "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-500",
          )}
          disabled={disabled}
        />
        {isPlaceholderText && getQuestionBadge()}
      </div>
    </div>
  );
}
