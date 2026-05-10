"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ContextLetterSelectProps {
  contextHtml: string;
  options: string[];
  questions: QuestionData[];
}

export function ContextLetterSelect({
  contextHtml,
  options,
  questions,
}: ContextLetterSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [portalTargets, setPortalTargets] = useState<HTMLElement[]>([]);

  const getProcessedHtml = useCallback(() => {
    let blankIndex = 0;
    return contextHtml.replace(/_{3,}/g, () => {
      const placeholder = `<span data-blank-index="${blankIndex}" style="display:inline-flex;vertical-align:middle"></span>`;
      blankIndex++;
      return placeholder;
    });
  }, [contextHtml]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = getProcessedHtml();
    const targets = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>("[data-blank-index]"),
    ).sort(
      (a, b) =>
        Number(a.dataset.blankIndex) - Number(b.dataset.blankIndex),
    );
    setPortalTargets(targets);
  }, [getProcessedHtml]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-3 text-sm leading-relaxed">
        {options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          return (
            <div key={i} className="flex gap-2">
              <span className="font-semibold w-5 shrink-0">{letter}</span>
              <span>{opt}</span>
            </div>
          );
        })}
      </div>
      <div ref={containerRef} className="space-y-1 rich-html" />
      {portalTargets.map((target, index) => {
        const question = questions[index];
        if (!question) return null;
        return createPortal(
          <span className="inline-flex items-center gap-1 mx-1 align-middle">
            <Select
              value={question.value || undefined}
              onValueChange={question.onChange}
              disabled={question.disabled}
            >
              <SelectTrigger
                id={`question-${question.questionId}`}
                className={cn(
                  "h-7 w-20 text-sm",
                  question.reviewMode &&
                    question.isCorrect &&
                    "border-green-500 bg-green-50 dark:bg-green-950/20",
                  question.reviewMode &&
                    !question.isCorrect &&
                    !question.isUnanswered &&
                    "border-red-500 bg-red-50 dark:bg-red-950/20",
                  question.reviewMode &&
                    question.isUnanswered &&
                    "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-500",
                )}
              >
                <SelectValue placeholder={`${question.questionNumber}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <SelectItem key={letter} value={letter}>
                      {letter}. {opt}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {question.reviewMode && (
              <>
                {question.isUnanswered ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400">
                    Unanswered
                  </span>
                ) : question.isCorrect ? (
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                      {question.correctAnswer}
                    </span>
                  </>
                )}
              </>
            )}
          </span>,
          target,
          `blank-${question.questionId}`,
        );
      })}
    </div>
  );
}
