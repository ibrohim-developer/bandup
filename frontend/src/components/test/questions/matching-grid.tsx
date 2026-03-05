"use client";

import { cn } from "@/lib/utils";

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

interface MatchingGridProps {
  options: string[];
  questions: QuestionData[];
}

export function MatchingGrid({ options, questions }: MatchingGridProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left p-2 border-b border-border" />
            {options.map((option) => (
              <th
                key={option}
                className="p-2 text-center font-bold border-b border-border min-w-[48px]"
              >
                {option}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => {
            const isIncorrect =
              q.reviewMode && !q.isCorrect && !q.isUnanswered;
            const isCorrectReview = q.reviewMode && q.isCorrect;

            return (
              <tr
                key={q.questionId}
                id={`question-${q.questionId}`}
                className="border-b border-border"
              >
                <td className="p-2 pr-4">
                  <div className="flex items-start gap-2">
                    <span className="font-bold shrink-0">
                      {q.questionNumber}.
                    </span>
                    <span className="leading-relaxed">{q.questionText}</span>
                  </div>
                </td>
                {options.map((option) => {
                  const isSelected = q.value === option;
                  const isCorrectOption =
                    q.reviewMode && q.correctAnswer === option;

                  return (
                    <td key={option} className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => !q.disabled && q.onChange(option)}
                        disabled={q.disabled}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 inline-flex items-center justify-center transition-colors",
                          // Default state
                          !isSelected &&
                            !q.reviewMode &&
                            "border-muted-foreground/40 hover:border-primary",
                          // Selected (non-review)
                          isSelected &&
                            !q.reviewMode &&
                            "border-primary bg-primary text-primary-foreground",
                          // Review: correct selection
                          isSelected &&
                            isCorrectReview &&
                            "border-green-500 bg-green-500 text-white",
                          // Review: incorrect selection
                          isSelected &&
                            isIncorrect &&
                            "border-red-500 bg-red-200 dark:bg-red-900/40",
                          // Review: show correct answer hint
                          !isSelected &&
                            isCorrectOption &&
                            isIncorrect &&
                            "border-green-500 bg-green-100 dark:bg-green-900/30",
                          // Unanswered + correct answer hint
                          !isSelected &&
                            isCorrectOption &&
                            q.isUnanswered &&
                            "border-green-500 bg-green-100 dark:bg-green-900/30",
                          q.disabled && "cursor-default",
                        )}
                      >
                        {isSelected && (
                          <div
                            className={cn(
                              "w-2.5 h-2.5 rounded-full",
                              !q.reviewMode && "bg-primary-foreground",
                              isCorrectReview && "bg-white",
                              isIncorrect && "bg-red-500",
                            )}
                          />
                        )}
                        {!isSelected && isCorrectOption && (q.isUnanswered || isIncorrect) && (
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
