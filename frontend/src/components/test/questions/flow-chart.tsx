"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, ArrowDown } from "lucide-react";
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

interface FlowChartOption {
  optionKey?: string;
  optionText: string;
  orderIndex?: number;
}

interface FlowChartProps {
  title?: string;
  options: FlowChartOption[];
  questions: QuestionData[];
}

export function FlowChart({ title, options, questions }: FlowChartProps) {
  const sortedOptions = [...options].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
  );

  // Pre-calculate how many blanks each box has, so we know the question offset per box
  const blankCounts = sortedOptions.map(
    (opt) => (opt.optionText.match(/_{3,}/g) || []).length,
  );
  const blankOffsets: number[] = [];
  let runningOffset = 0;
  for (const count of blankCounts) {
    blankOffsets.push(runningOffset);
    runningOffset += count;
  }

  return (
    <div className="flex flex-col items-center gap-0">
      {title && (
        <div
          className="text-center mb-2 rich-html"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {sortedOptions.map((option, index) => (
        <div key={index} className="flex flex-col items-center w-full">
          {index > 0 && (
            <ArrowDown className="h-6 w-6 text-muted-foreground my-1" />
          )}
          <FlowChartBox
            html={option.optionText}
            questions={questions}
            questionOffset={blankOffsets[index]}
          />
        </div>
      ))}
    </div>
  );
}

function FlowChartBox({
  html,
  questions,
  questionOffset,
}: {
  html: string;
  questions: QuestionData[];
  questionOffset: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [portalTargets, setPortalTargets] = useState<HTMLElement[]>([]);
  const hasBlank = /_{3,}/.test(html);

  const getProcessedHtml = useCallback(() => {
    if (!hasBlank) return html;
    let localIdx = 0;
    return html.replace(/_{3,}/g, () => {
      const placeholder = `<span data-flow-blank="${localIdx}" style="display:inline-flex;vertical-align:middle"></span>`;
      localIdx++;
      return placeholder;
    });
  }, [html, hasBlank]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = getProcessedHtml();
    if (hasBlank) {
      const targets = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-flow-blank]"),
      ).sort(
        (a, b) =>
          Number(a.dataset.flowBlank) - Number(b.dataset.flowBlank),
      );
      setPortalTargets(targets);
    }
  }, [getProcessedHtml, hasBlank]);

  return (
    <div className="border rounded-lg px-4 py-3 w-full max-w-md bg-card text-center">
      <div ref={containerRef} className="rich-html text-sm leading-relaxed" />
      {portalTargets.map((target, localIdx) => {
        const question = questions[questionOffset + localIdx];
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
          `flow-blank-${question.questionId}`,
        );
      })}
    </div>
  );
}
