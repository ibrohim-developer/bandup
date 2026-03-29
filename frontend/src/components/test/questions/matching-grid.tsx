"use client";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Bookmark } from "lucide-react";

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
  flaggedQuestions?: string[];
  onToggleFlag?: (questionId: string) => void;
}

function OptionButton({
  option,
  isSelected,
  isCorrectOption,
  isCorrectReview,
  isIncorrect,
  isUnanswered,
  disabled,
  reviewMode,
  onClick,
  size = "sm",
}: {
  option: string;
  isSelected: boolean;
  isCorrectOption: boolean;
  isCorrectReview: boolean;
  isIncorrect: boolean;
  isUnanswered: boolean;
  disabled?: boolean;
  reviewMode?: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}) {
  const isMd = size === "md";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full border-2 inline-flex items-center justify-center transition-colors shrink-0",
        isMd ? "w-9 h-9 text-xs font-semibold" : "w-7 h-7",
        // Default state
        !isSelected &&
        !reviewMode &&
        "border-muted-foreground/40 hover:border-primary",
        // Selected (non-review)
        isSelected &&
        !reviewMode &&
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
        isUnanswered &&
        "border-green-500 bg-green-100 dark:bg-green-900/30",
        disabled && "cursor-default",
      )}
    >
      {isMd ? (
        <span
          className={cn(
            isSelected && !reviewMode && "text-primary-foreground",
            isSelected && isCorrectReview && "text-white",
            isSelected && isIncorrect && "text-red-500",
            !isSelected &&
            isCorrectOption &&
            (isIncorrect || isUnanswered) &&
            "text-green-500",
            !isSelected && !reviewMode && "text-muted-foreground",
          )}
        >
          {option}
        </span>
      ) : (
        <>
          {isSelected && (
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                !reviewMode && "bg-primary-foreground",
                isCorrectReview && "bg-white",
                isIncorrect && "bg-red-500",
              )}
            />
          )}
          {!isSelected &&
            isCorrectOption &&
            (isUnanswered || isIncorrect) && (
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            )}
        </>
      )}
    </button>
  );
}

/** Mobile card with circle buttons — for short options (single letters) */
function MobileCircleCard({
  q,
  options,
  isIncorrect,
  isCorrectReview,
  isFlagged,
  onToggleFlag,
}: {
  q: QuestionData;
  options: string[];
  isIncorrect: boolean;
  isCorrectReview: boolean;
  isFlagged?: boolean;
  onToggleFlag?: (id: string) => void;
}) {
  return (
    <div
      key={q.questionId}
      id={`question-${q.questionId}`}
      className="rounded-lg border border-border p-3 space-y-3"
    >
      <div className="flex items-start gap-2">
        <span className="font-bold shrink-0">{q.questionNumber}.</span>
        <span className="flex-1 text-sm leading-relaxed">{q.questionText}</span>
        {onToggleFlag && (
          <button type="button" onClick={() => onToggleFlag(q.questionId)} className="shrink-0 p-0.5">
            <Bookmark className={cn("h-5 w-5", isFlagged ? "fill-black text-black dark:fill-white dark:text-white" : "text-muted-foreground/40")} />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {options.map((option) => {
          const isSelected = q.value === option;
          const isCorrectOption = q.reviewMode && q.correctAnswer === option;

          return (
            <OptionButton
              key={option}
              option={option}
              isSelected={isSelected}
              isCorrectOption={!!isCorrectOption}
              isCorrectReview={isCorrectReview}
              isIncorrect={isIncorrect}
              isUnanswered={!!q.isUnanswered}
              disabled={q.disabled}
              reviewMode={q.reviewMode}
              onClick={() => !q.disabled && q.onChange(option)}
              size="md"
            />
          );
        })}
      </div>
      {q.reviewMode && !q.isCorrect && q.correctAnswer && (
        <p className="text-xs text-green-600">Correct: {q.correctAnswer}</p>
      )}
    </div>
  );
}

/** Mobile card with select dropdown — for long text options */
function MobileSelectCard({
  q,
  options,
  isFlagged,
  onToggleFlag,
}: {
  q: QuestionData;
  options: string[];
  isFlagged?: boolean;
  onToggleFlag?: (id: string) => void;
}) {
  return (
    <div id={`question-${q.questionId}`} className="space-y-1">
      <div className="flex gap-2 items-center">
        <span className="font-bold shrink-0">{q.questionNumber}.</span>
        <Select
          value={q.value || undefined}
          onValueChange={q.onChange}
          disabled={q.disabled}
        >
          <SelectTrigger
            className={cn(
              "w-full",
              q.reviewMode &&
              q.isCorrect &&
              "border-green-500 bg-green-50 dark:bg-green-950/20",
              q.reviewMode &&
              !q.isCorrect &&
              !q.isUnanswered &&
              "border-red-500 bg-red-50 dark:bg-red-950/20",
              q.reviewMode &&
              q.isUnanswered &&
              "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-500",
            )}
          >
            <SelectValue
              placeholder={
                q.reviewMode && q.isUnanswered ? "N/A" : "Select an option"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {options
              .filter((o) => o !== "")
              .map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                return (
                  <SelectItem key={`${index}-${option}`} value={option}>
                    {letter}. {option}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
        {q.reviewMode && !q.isUnanswered && q.isCorrect && (
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
        )}
        {q.reviewMode && !q.isUnanswered && !q.isCorrect && (
          <XCircle className="h-5 w-5 text-red-600 shrink-0" />
        )}
        {onToggleFlag && (
          <button type="button" onClick={() => onToggleFlag(q.questionId)} className="shrink-0 p-0.5">
            <Bookmark className={cn("h-5 w-5", isFlagged ? "fill-black text-black dark:fill-white dark:text-white" : "text-muted-foreground/40")} />
          </button>
        )}
      </div>
      {q.reviewMode && !q.isCorrect && q.correctAnswer && (
        <p className="ml-6 text-xs text-green-600">
          Correct: {q.correctAnswer}
        </p>
      )}
    </div>
  );
}

export function MatchingGrid({ options, questions, flaggedQuestions, onToggleFlag }: MatchingGridProps) {
  const isShortOptions = options.every((o) => o.trim().length <= 2);
  const showBookmarks = !!(flaggedQuestions && onToggleFlag);

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {questions.map((q) => {
          const isIncorrect = q.reviewMode && !q.isCorrect && !q.isUnanswered;
          const isCorrectReview = !!(q.reviewMode && q.isCorrect);
          const isFlagged = showBookmarks && flaggedQuestions!.includes(q.questionId);

          return isShortOptions ? (
            <MobileCircleCard
              key={q.questionId}
              q={q}
              options={options}
              isIncorrect={!!isIncorrect}
              isCorrectReview={isCorrectReview}
              isFlagged={isFlagged}
              onToggleFlag={onToggleFlag}
            />
          ) : (
            <MobileSelectCard
              key={q.questionId}
              q={q}
              options={options}
              isFlagged={isFlagged}
              onToggleFlag={onToggleFlag}
            />
          );
        })}
      </div>

      {/* Desktop: table grid */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left p-2 border-b border-border" />
              {options.map((option) => (
                <th key={option} className="p-2 text-center font-bold border-b border-border min-w-[48px]">
                  {option}
                </th>
              ))}
              {showBookmarks && <th className="border-b border-border w-8" />}
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => {
              const isIncorrect = q.reviewMode && !q.isCorrect && !q.isUnanswered;
              const isCorrectReview = q.reviewMode && q.isCorrect;
              const isFlagged = showBookmarks && flaggedQuestions!.includes(q.questionId);

              return (
                <tr
                  key={q.questionId}
                  id={`question-${q.questionId}`}
                  className="group/row border-b border-border"
                >
                  <td className="p-2 pr-4">
                    <div className="flex items-start gap-2">
                      <span className="font-bold shrink-0">{q.questionNumber}.</span>
                      <span className="leading-relaxed">{q.questionText}</span>
                    </div>
                  </td>
                  {options.map((option) => {
                    const isSelected = q.value === option;
                    const isCorrectOption = q.reviewMode && q.correctAnswer === option;
                    return (
                      <td key={option} className="p-2 text-center">
                        <OptionButton
                          option={option}
                          isSelected={isSelected}
                          isCorrectOption={!!isCorrectOption}
                          isCorrectReview={!!isCorrectReview}
                          isIncorrect={!!isIncorrect}
                          isUnanswered={!!q.isUnanswered}
                          disabled={q.disabled}
                          reviewMode={q.reviewMode}
                          onClick={() => !q.disabled && q.onChange(option)}
                          size="sm"
                        />
                      </td>
                    );
                  })}
                  {showBookmarks && (
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleFlag!(q.questionId)}
                        className={cn(
                          "p-0.5 transition-all cursor-pointer",
                          isFlagged ? "opacity-100" : "opacity-0 group-hover/row:opacity-100",
                        )}
                        title={isFlagged ? "Remove flag" : "Flag for review"}
                      >
                        <Bookmark
                          className={cn(
                            "h-6 w-6",
                            isFlagged
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground/40 text-muted-foreground",
                          )}
                        />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
