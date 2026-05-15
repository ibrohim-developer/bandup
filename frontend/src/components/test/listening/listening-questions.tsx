"use client";

import { MultipleChoice } from "@/components/test/questions/multiple-choice";
import { MultipleAnswer } from "@/components/test/questions/multiple-answer";
import { MultipleAnswerGroup } from "@/components/test/questions/multiple-answer-group";
import { TrueFalseNotGiven } from "@/components/test/questions/true-false-not-given";
import { FillInBlank } from "@/components/test/questions/fill-in-blank";
import { ContextFillInBlank } from "@/components/test/questions/context-fill-in-blank";
import { ContextLetterSelect } from "@/components/test/questions/context-letter-select";
import { MatchingSelect } from "@/components/test/questions/matching-select";
import { FlowChart } from "@/components/test/questions/flow-chart";
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

interface ListeningQuestionsProps {
  questionGroups: QuestionGroup[];
  passageQuestions: Question[];
  questionOffset: number;
  answers: Record<string, { answer: string }>;
  onAnswer: (questionId: string, value: string) => void;
  theme: Theme;
}

const MATCHING_TYPES = new Set([
  "matching_info",
  "matching_headings",
  "matching_names",
  "matching_sentence_endings",
]);

function getTypeInstruction(type: string) {
  switch (type) {
    case "mcq_single":
      return "Choose the correct answer.";
    case "gap_fill":
    case "short_answer":
    case "sentence_completion":
    case "flow_chart_completion":
      return "Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.";
    default:
      return "";
  }
}

export function ListeningQuestions({
  questionGroups,
  passageQuestions,
  questionOffset,
  answers,
  onAnswer,
  theme,
}: ListeningQuestionsProps) {
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
        return <MultipleAnswer key={question.id} {...commonProps} options={question.options ?? []} />;
      case "tfng":
      case "ynng":
        return <TrueFalseNotGiven key={question.id} {...commonProps} />;
      case "gap_fill":
      case "short_answer":
      case "sentence_completion":
      case "summary_completion":
      case "note_completion":
      case "table_completion":
      case "flow_chart_completion":
        return <FillInBlank key={question.id} {...commonProps} />;
      case "matching_headings":
        return <MatchingSelect key={question.id} {...commonProps} options={question.options ?? []} placeholder="Select a heading" />;
      case "matching_info":
        return <MatchingSelect key={question.id} {...commonProps} options={question.options ?? []} placeholder="Select a paragraph" />;
      default:
        return null;
    }
  };

  return (
    <>
      {questionGroups.map((group, groupIndex) => {
        const contextHtml = group.context as string | undefined;
        const instructionHtml = group.instruction as string | undefined;

        const buildGroupQuestions = () =>
          group.questions.map((question) => {
            const globalIdx = passageQuestions.findIndex((q) => q.id === question.id);
            return {
              questionId: question.id,
              questionNumber: questionOffset + globalIdx + 1,
              value: answers[question.id]?.answer || "",
              onChange: (val: string) => onAnswer(question.id, val),
              disabled: false,
            };
          });

        const diagramMeta = group.metadata as { diagramQuestions?: { imageUrl?: string } } | null;
        const diagramImageUrl = diagramMeta?.diagramQuestions?.imageUrl;
        const isFlowChart =
          group.options &&
          Array.isArray(group.options) &&
          group.options.length > 0 &&
          typeof group.options[0] === "object" &&
          (group.options[0] as { optionText?: string }).optionText;
        const groupOptions = (group.options as string[]) || [];
        const isMatchingType = MATCHING_TYPES.has(group.type);

        let body: React.ReactNode = null;

        if (diagramImageUrl) {
          const letterOptions = (group.options as string[]) || [];
          body = (
            <div className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={diagramImageUrl}
                alt="Map diagram"
                className="w-full max-w-2xl rounded-lg border"
                style={{ borderColor: theme.border }}
              />
              <div className="space-y-4">
                {group.questions.map((question) => {
                  const globalIdx = passageQuestions.findIndex((q) => q.id === question.id);
                  return (
                    <MatchingSelect
                      key={question.id}
                      questionId={question.id}
                      questionNumber={questionOffset + globalIdx + 1}
                      questionText={question.text}
                      options={letterOptions}
                      value={answers[question.id]?.answer || ""}
                      onChange={(val: string) => onAnswer(question.id, val)}
                      disabled={false}
                      placeholder="Select a letter"
                    />
                  );
                })}
              </div>
            </div>
          );
        } else if (isFlowChart) {
          body = (
            <FlowChart
              title={contextHtml || undefined}
              options={group.options as unknown as { optionKey?: string; optionText: string; orderIndex?: number }[]}
              questions={buildGroupQuestions()}
            />
          );
        } else if (group.type === "mcq_multiple" && groupOptions.length > 0) {
          body = (
            <div className="space-y-4">
              {contextHtml && (
                <div
                  className="text-sm leading-relaxed rich-html"
                  dangerouslySetInnerHTML={{ __html: contextHtml }}
                />
              )}
              <MultipleAnswerGroup
                options={groupOptions}
                questions={buildGroupQuestions()}
                disabled={false}
              />
            </div>
          );
        } else if (isMatchingType && contextHtml && groupOptions.length > 0 && /_{3,}/.test(contextHtml)) {
          body = (
            <ContextLetterSelect
              contextHtml={contextHtml}
              options={groupOptions}
              questions={buildGroupQuestions()}
            />
          );
        } else if (contextHtml) {
          body = (
            <div className="text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mb-1 [&_p]:mb-1 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:dark:border-gray-600 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold [&_th]:bg-gray-100 [&_th]:dark:bg-gray-800 [&_td]:border [&_td]:border-gray-300 [&_td]:dark:border-gray-600 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top">
              <ContextFillInBlank contextHtml={contextHtml} questions={buildGroupQuestions()} />
            </div>
          );
        } else {
          body = (
            <div className="space-y-6">
              {group.questions.map((question) => {
                const globalIdx = passageQuestions.findIndex((q) => q.id === question.id);
                return <div key={question.id}>{renderQuestion(question, globalIdx)}</div>;
              })}
            </div>
          );
        }

        return (
          <div key={groupIndex}>
            <div className="mb-4">
              <h3 className="font-bold text-base mb-2">
                Questions {group.startNum}-{group.endNum}
              </h3>
              {instructionHtml ? (
                <div
                  className="text-sm leading-relaxed [&_strong]:font-bold"
                  style={{ color: theme.textMuted }}
                  dangerouslySetInnerHTML={{ __html: instructionHtml }}
                />
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: theme.textMuted }}>
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
