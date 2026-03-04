"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchingSelectProps {
  questionId: string;
  questionNumber: number;
  questionText: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  reviewMode?: boolean;
  correctAnswer?: string;
  isCorrect?: boolean;
  isUnanswered?: boolean;
  placeholder?: string;
}

export function MatchingSelect({
  questionId,
  questionNumber,
  questionText,
  options,
  value,
  onChange,
  disabled,
  reviewMode,
  correctAnswer,
  isCorrect,
  isUnanswered,
  placeholder = "Select an option",
}: MatchingSelectProps) {
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

  return (
    <div id={`question-${questionId}`} className="space-y-3">
      <div className="flex gap-2 items-start">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-700">
          {questionNumber}
        </span>
        <p className="text-sm leading-relaxed text-gray-800">
          {questionText}
          {getQuestionBadge()}
        </p>
      </div>

      <div className="ml-8">
        <Select
          value={value || undefined}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn(
              "w-full max-w-xs",
              reviewMode &&
                isCorrect &&
                "border-green-500 bg-green-50 dark:bg-green-950/20",
              reviewMode &&
                !isCorrect &&
                !isUnanswered &&
                "border-red-500 bg-red-50 dark:bg-red-950/20",
              reviewMode &&
                isUnanswered &&
                "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-500",
            )}
          >
            <SelectValue
              placeholder={
                reviewMode && isUnanswered ? "N/A" : placeholder
              }
            />
          </SelectTrigger>
          <SelectContent>
            {options
              .filter((option) => option !== "")
              .map((option, index) => (
                <SelectItem key={`${index}-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {reviewMode && !isCorrect && correctAnswer && (
          <p className="mt-1.5 text-xs text-green-600">
            Correct answer: {correctAnswer}
          </p>
        )}
      </div>
    </div>
  );
}
