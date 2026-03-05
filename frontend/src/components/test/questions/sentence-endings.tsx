"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";

interface QuestionData {
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

interface SentenceEndingsProps {
  contextHtml?: string;
  options: string[];
  questions: QuestionData[];
  flaggedQuestions?: string[];
  onToggleFlag?: (questionId: string) => void;
}

export function SentenceEndings({
  contextHtml,
  options,
  questions,
  flaggedQuestions,
  onToggleFlag,
}: SentenceEndingsProps) {
  // Generate letter options (A, B, C, ...)
  const letterOptions = options.map((_, i) => String.fromCharCode(65 + i));

  return (
    <div className="space-y-4">
      {/* Options box showing the sentence endings */}
      {contextHtml ? (
        <div
          className="border rounded-lg p-4 text-sm leading-relaxed rich-html"
          dangerouslySetInnerHTML={{ __html: contextHtml }}
        />
      ) : (
        <div className="border rounded-lg p-4 text-sm leading-relaxed space-y-1">
          {options.map((option, i) => (
            <p key={i}>
              <strong>{String.fromCharCode(65 + i)}.</strong> {option}
            </p>
          ))}
        </div>
      )}

      {/* Questions as compact rows */}
      <div className="space-y-0">
        {questions.map((q) => {
          const isIncorrect = q.reviewMode && !q.isCorrect && !q.isUnanswered;

          return (
            <div
              key={q.questionId}
              id={`question-${q.questionId}`}
              className="group/q flex items-center gap-3 py-2.5 border-b border-border last:border-b-0"
            >
              <span className="font-bold text-sm shrink-0">{q.questionNumber}</span>
              <span className="flex-1 text-sm leading-relaxed">{q.questionText}</span>
              <Select
                value={q.value || undefined}
                onValueChange={q.onChange}
                disabled={q.disabled}
              >
                <SelectTrigger
                  className={cn(
                    "w-16 h-8 text-sm shrink-0",
                    q.reviewMode && q.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                    q.reviewMode && isIncorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                    q.reviewMode && q.isUnanswered && "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-500",
                  )}
                >
                  <SelectValue placeholder={`${q.questionNumber}`} />
                </SelectTrigger>
                <SelectContent>
                  {letterOptions.map((letter) => (
                    <SelectItem key={letter} value={letter}>
                      {letter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {onToggleFlag && (
                <button
                  type="button"
                  onClick={() => onToggleFlag(q.questionId)}
                  className={cn(
                    "shrink-0 p-1 transition-all",
                    flaggedQuestions?.includes(q.questionId) ? "opacity-100" : "opacity-0 group-hover/q:opacity-100",
                  )}
                  title={flaggedQuestions?.includes(q.questionId) ? "Remove flag" : "Flag for review"}
                >
                  <Bookmark
                    className={cn(
                      "h-4 w-4",
                      flaggedQuestions?.includes(q.questionId)
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground/40 hover:text-muted-foreground",
                    )}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Show correct answers in review mode for incorrect ones */}
      {questions.some((q) => q.reviewMode && !q.isCorrect) && (
        <div className="text-xs space-y-1 mt-2">
          {questions
            .filter((q) => q.reviewMode && !q.isCorrect)
            .map((q) => (
              <p key={q.questionId} className="text-green-600">
                {q.questionNumber}: Correct answer: {q.correctAnswer}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
