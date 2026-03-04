"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
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

interface ContextFillInBlankProps {
  contextHtml: string;
  questions: QuestionData[];
}

export function ContextFillInBlank({
  contextHtml,
  questions,
}: ContextFillInBlankProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [portalTargets, setPortalTargets] = useState<HTMLElement[]>([]);

  // Build the processed HTML with placeholder spans
  const getProcessedHtml = useCallback(() => {
    let blankIndex = 0;
    return contextHtml.replace(/_{3,}/g, () => {
      const placeholder = `<span data-blank-index="${blankIndex}" style="display:inline-flex;vertical-align:middle"></span>`;
      blankIndex++;
      return placeholder;
    });
  }, [contextHtml]);

  // Manually set innerHTML via ref (not dangerouslySetInnerHTML) so React doesn't
  // re-apply it on re-renders and destroy the portal target nodes
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
    <>
      <div ref={containerRef} className="space-y-1 rich-html" />
      {portalTargets.map((target, index) => {
        const question = questions[index];
        if (!question) return null;

        return createPortal(
          <span className="inline-flex items-center gap-1 mx-1 align-middle">
            <Input
              id={`question-${question.questionId}`}
              value={
                question.reviewMode && question.isUnanswered
                  ? "N/A"
                  : question.value
              }
              onChange={(e) => question.onChange(e.target.value)}
              className={cn(
                "inline-block w-36 h-7 text-center text-sm",
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
              placeholder={`${question.questionNumber}`}
              disabled={question.disabled}
              autoComplete="off"
            />
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
    </>
  );
}
