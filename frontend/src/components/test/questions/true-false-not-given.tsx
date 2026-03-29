"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface TrueFalseNotGivenProps {
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

const options = [
  { value: "TRUE", label: "TRUE" },
  { value: "FALSE", label: "FALSE" },
  { value: "NOT_GIVEN", label: "NOT GIVEN" },
];

export function TrueFalseNotGiven({
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
}: TrueFalseNotGivenProps) {
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
    <div id={`question-${questionId}`} className="space-y-2">
      <p className="text-sm leading-relaxed">
        <span className="mr-2 font-bold">{questionNumber}</span>
        {questionText}
        {getQuestionBadge()}
      </p>

      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className="space-y-0 gap-1"
      >
        {options.map((option) => {
          const isUserAnswer = value === option.value;
          const isSelectedInReview = reviewMode && isUserAnswer;

          return (
            <div
              key={option.value}
              className={cn(
                "flex items-center gap-3 px-4 py-3 w-full transition-colors",
                !disabled && "cursor-pointer",
                isSelectedInReview && isCorrect && "bg-green-100 dark:bg-green-950/30",
                isSelectedInReview && !isCorrect && "bg-red-100 dark:bg-red-950/30",
                !reviewMode && isUserAnswer && "bg-gray-200 dark:bg-muted",
                !reviewMode && !isUserAnswer && "hover:bg-gray-100 dark:hover:bg-muted/50",
              )}
              onClick={() => !disabled && onChange(option.value)}
            >
              <RadioGroupItem
                value={option.value}
                id={`${questionId}-${option.value}`}
                className="shrink-0"
              />
              <Label
                htmlFor={`${questionId}-${option.value}`}
                className={cn(
                  "text-sm font-medium tracking-wide text-foreground",
                  !disabled && "cursor-pointer",
                )}
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
