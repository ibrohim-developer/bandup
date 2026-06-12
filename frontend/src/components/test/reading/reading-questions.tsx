"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { MultipleChoice } from "@/components/test/questions/multiple-choice";
import { MultipleAnswer } from "@/components/test/questions/multiple-answer";
import { MultipleAnswerGroup } from "@/components/test/questions/multiple-answer-group";
import { TrueFalseNotGiven } from "@/components/test/questions/true-false-not-given";
import { FillInBlank } from "@/components/test/questions/fill-in-blank";
import { ContextFillInBlank } from "@/components/test/questions/context-fill-in-blank";
import { MatchingSelect } from "@/components/test/questions/matching-select";
import { MatchingGrid } from "@/components/test/questions/matching-grid";
import { FlowChart } from "@/components/test/questions/flow-chart";
import { SentenceEndings } from "@/components/test/questions/sentence-endings";
import { getTypeInstruction } from "@/lib/constants/reading-instructions";
import type { QuestionGroup } from "@/hooks/use-question-navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Question {
  id: string;
  questionNumber: number;
  type: string;
  text: string;
  options: string[] | null;
  metadata: Record<string, unknown> | null;
}

interface Theme {
  border: string;
  textMuted: string;
}

interface ReadingQuestionsProps {
  questionGroups: QuestionGroup[];
  passageQuestions: Question[];
  questionOffset: number;
  answers: Record<string, { answer: string }>;
  onAnswer: (questionId: string, value: string) => void;
  theme: Theme;
  /** Optional flag/bookmark support — omit for full-mock-test where flagging isn't shown */
  flaggedQuestions?: string[];
  onToggleFlag?: (questionId: string) => void;
}

function BookmarkButton({
  questionId,
  flaggedQuestions,
  toggleFlag,
}: {
  questionId: string;
  flaggedQuestions: string[];
  toggleFlag: (id: string) => void;
}) {
  const isFlagged = flaggedQuestions.includes(questionId);
  return (
    <button
      type="button"
      onClick={() => toggleFlag(questionId)}
      className={cn(
        "shrink-0 self-start mt-1 transition-all cursor-pointer",
        isFlagged ? "opacity-100" : "opacity-0 group-hover/q:opacity-100",
      )}
      title={isFlagged ? "Remove flag" : "Flag for review"}
    >
      <Bookmark
        className={cn(
          "h-6 w-6",
          isFlagged ? "fill-red-500 text-red-500" : "text-muted-foreground",
        )}
      />
    </button>
  );
}

export function ReadingQuestions({
  questionGroups,
  passageQuestions,
  questionOffset,
  answers,
  onAnswer,
  theme,
  flaggedQuestions,
  onToggleFlag,
}: ReadingQuestionsProps) {
  const showBookmarks = !!(flaggedQuestions && onToggleFlag);

  const renderQuestion = (question: Question, indexInPassage: number) => {
    const value = answers[question.id]?.answer || "";
    const commonProps = {
      questionId: question.id,
      questionNumber: questionOffset + indexInPassage + 1,
      questionText: question.text,
      value,
      onChange: (val: string) => onAnswer(question.id, val),
      disabled: false,
    };

    switch (question.type) {
      case "mcq_single":
        return <MultipleChoice key={question.id} {...commonProps} options={question.options ?? []} />;
      case "mcq_multiple":
        return (
          <MultipleAnswer
            key={question.id}
            {...commonProps}
            options={question.options ?? []}
            maxSelections={(question.metadata?.maxSelections as number | undefined) ?? 2}
          />
        );
      case "tfng":
      case "ynng":
        return <TrueFalseNotGiven key={question.id} {...commonProps} />;
      case "gap_fill":
      case "short_answer":
      case "summary_completion":
      case "note_completion":
      case "table_completion":
      case "sentence_completion":
      case "flow_chart_completion":
      case "summary_completion_drag_drop":
        return <FillInBlank key={question.id} {...commonProps} />;
      case "matching_headings":
        return <MatchingSelect key={question.id} {...commonProps} options={question.options ?? []} placeholder="Select a heading" />;
      case "matching_info":
      case "matching_names":
        return <MatchingSelect key={question.id} {...commonProps} options={question.options ?? []} placeholder="Select a paragraph" />;
      case "matching_sentence_endings":
        return <MatchingSelect key={question.id} {...commonProps} options={question.options ?? []} placeholder="Select an ending" />;
      default:
        return <FillInBlank key={question.id} {...commonProps} />;
    }
  };

  return (
    <>
      {questionGroups.map((group, groupIndex) => {
        const firstMeta = group.questions[0]?.metadata;
        const contextHtml =
          (group.context as string | undefined) ||
          (firstMeta?.context as string | undefined);
        const instructionHtml =
          (group.instruction as string | undefined) ||
          (firstMeta?.instruction as string | undefined);

        const isSingleQuestion = group.startNum === group.endNum;
        const groupOptions = group.options ?? [];

        const buildGroupQuestions = () =>
          group.questions.map((question) => {
            const globalIdx = passageQuestions.findIndex((q) => q.id === question.id);
            return {
              questionId: question.id,
              questionNumber: questionOffset + globalIdx + 1,
              questionText: question.text,
              value: answers[question.id]?.answer || "",
              onChange: (val: string) => onAnswer(question.id, val),
              disabled: false,
            };
          });

        let body: React.ReactNode = null;

        if (
          ["matching_info", "matching_headings", "matching_names"].includes(group.type) &&
          groupOptions.length > 0
        ) {
          body = (
            <div className="space-y-4">
              {contextHtml && (
                <div
                  className="text-base leading-relaxed rich-html"
                  dangerouslySetInnerHTML={{ __html: contextHtml }}
                />
              )}
              <MatchingGrid
                options={groupOptions as string[]}
                questions={buildGroupQuestions()}
                flaggedQuestions={showBookmarks ? flaggedQuestions : undefined}
                onToggleFlag={showBookmarks ? onToggleFlag : undefined}
              />
            </div>
          );
        } else if (group.type === "matching_sentence_endings" && groupOptions.length > 0) {
          body = (
            <SentenceEndings
              contextHtml={contextHtml || undefined}
              options={groupOptions as string[]}
              questions={buildGroupQuestions()}
              flaggedQuestions={showBookmarks ? flaggedQuestions : undefined}
              onToggleFlag={showBookmarks ? onToggleFlag : undefined}
            />
          );
        } else if (group.type === "mcq_single" && groupOptions.length > 0) {
          body = (
            <div className="space-y-6">
              {group.questions.map((question) => {
                const globalIdx = passageQuestions.findIndex((pq) => pq.id === question.id);
                const value = answers[question.id]?.answer || "";
                const qText =
                  question.text ||
                  (contextHtml ? contextHtml.replace(/<[^>]*>/g, "").trim() : "");
                return (
                  <div key={question.id} className="group/q flex items-start gap-1">
                    <div className="flex-1">
                      <MultipleChoice
                        questionId={question.id}
                        questionNumber={questionOffset + globalIdx + 1}
                        questionText={qText}
                        options={groupOptions as string[]}
                        value={value}
                        onChange={(val: string) => onAnswer(question.id, val)}
                        disabled={false}
                      />
                    </div>
                    {showBookmarks && (
                      <BookmarkButton
                        questionId={question.id}
                        flaggedQuestions={flaggedQuestions!}
                        toggleFlag={onToggleFlag!}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        } else if (group.type === "mcq_multiple" && groupOptions.length > 0) {
          // One shared multi-select for the whole group: every sub-question
          // stores the same combined value (e.g. "C,E"), which is what each
          // row's correct_answer is graded against — so the natural "pick TWO"
          // interaction scores full marks. (Matches the listening module; the
          // previous per-question widgets scored 0/2 for the intuitive answer.)
          body = (
            <div className="group/q flex items-start gap-1">
              <div className="flex-1 space-y-4">
                {contextHtml && (
                  <div
                    className="text-base leading-relaxed rich-html"
                    dangerouslySetInnerHTML={{ __html: contextHtml }}
                  />
                )}
                <MultipleAnswerGroup
                  options={groupOptions as string[]}
                  questions={buildGroupQuestions()}
                  disabled={false}
                />
              </div>
              {showBookmarks && (
                <BookmarkButton
                  questionId={group.questions[0].id}
                  flaggedQuestions={flaggedQuestions!}
                  toggleFlag={onToggleFlag!}
                />
              )}
            </div>
          );
        } else if (group.type === "flow_chart_completion" && groupOptions.length > 0) {
          body = (
            <div className="group/q flex items-start gap-1">
              <div className="flex-1">
                <FlowChart
                  title={contextHtml || undefined}
                  options={groupOptions as unknown as { optionKey?: string; optionText: string; orderIndex?: number }[]}
                  questions={buildGroupQuestions()}
                />
              </div>
              {showBookmarks && (
                <BookmarkButton
                  questionId={group.questions[0].id}
                  flaggedQuestions={flaggedQuestions!}
                  toggleFlag={onToggleFlag!}
                />
              )}
            </div>
          );
        } else if (
          contextHtml &&
          [
            "gap_fill",
            "summary_completion",
            "summary_completion_drag_drop",
            "short_answer",
            "note_completion",
            "table_completion",
            "sentence_completion",
          ].includes(group.type)
        ) {
          body = (
            <div className="text-base leading-relaxed rich-html">
              <ContextFillInBlank
                contextHtml={contextHtml}
                questions={buildGroupQuestions()}
                flaggedQuestions={showBookmarks ? flaggedQuestions : undefined}
                onToggleFlag={showBookmarks ? onToggleFlag : undefined}
              />
            </div>
          );
        } else {
          body = (
            <div className="space-y-6">
              {contextHtml && (
                <div
                  className="text-base leading-relaxed rich-html"
                  dangerouslySetInnerHTML={{ __html: contextHtml }}
                />
              )}
              {group.questions.map((question) => {
                const globalIdx = passageQuestions.findIndex((pq) => pq.id === question.id);
                return (
                  <div key={question.id} className="group/q flex items-start gap-1">
                    <div className="flex-1">{renderQuestion(question, globalIdx)}</div>
                    {showBookmarks && (
                      <BookmarkButton
                        questionId={question.id}
                        flaggedQuestions={flaggedQuestions!}
                        toggleFlag={onToggleFlag!}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <div key={groupIndex}>
            <div className="mb-4">
              <h3 className="font-bold text-base mb-2">
                {isSingleQuestion
                  ? `Question ${group.startNum}`
                  : `Questions ${group.startNum}-${group.endNum}`}
              </h3>
              {instructionHtml ? (
                <div
                  className="text-base leading-relaxed rich-html"
                  style={{ color: theme.textMuted }}
                  dangerouslySetInnerHTML={{ __html: instructionHtml }}
                />
              ) : (
                <p className="text-base leading-relaxed" style={{ color: theme.textMuted }}>
                  {getTypeInstruction(group.type)}
                </p>
              )}
            </div>

            {body}

            {groupIndex < questionGroups.length - 1 && (
              <hr className="my-6" style={{ borderColor: theme.border }} />
            )}
          </div>
        );
      })}
    </>
  );
}
