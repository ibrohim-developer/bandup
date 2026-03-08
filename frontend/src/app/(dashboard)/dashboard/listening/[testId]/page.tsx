"use client";

import { use, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitDialog } from "@/components/test/common/submit-dialog";
import { TestOptionsMenu } from "@/components/test/common/test-options-menu";
import { AudioPlayer } from "@/components/test/listening/audio-player";
import { MultipleChoice } from "@/components/test/questions/multiple-choice";
import { MultipleAnswer } from "@/components/test/questions/multiple-answer";
import { MultipleAnswerGroup } from "@/components/test/questions/multiple-answer-group";
import { FillInBlank } from "@/components/test/questions/fill-in-blank";
import { TrueFalseNotGiven } from "@/components/test/questions/true-false-not-given";
import { ContextFillInBlank } from "@/components/test/questions/context-fill-in-blank";
import { MatchingSelect } from "@/components/test/questions/matching-select";
import { FlowChart } from "@/components/test/questions/flow-chart";
import { useListeningTest } from "@/hooks/use-listening-test";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useNavigationProtection } from "@/hooks/use-navigation-protection";
import { useQuestionNavigation } from "@/hooks/use-question-navigation";
import { useTestOptions } from "@/hooks/use-test-options";
import { useSyncTestTheme } from "@/components/force-light-theme";
import {
  Send,
  Loader2,
  Headphones,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Check,
} from "lucide-react";

interface Question {
  id: string;
  questionNumber: number;
  type: string;
  text: string;
  options: string[] | null;
  metadata: Record<string, unknown> | null;
}

interface QuestionGroupData {
  id: string;
  groupNumber: number;
  type: string;
  instruction: string | null;
  context: string | null;
  points: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[] | null;
  metadata: Record<string, unknown> | null;
  questions: Question[];
}

interface Section {
  id: string;
  sectionNumber: number;
  audioUrl: string;
  audioDurationSeconds: number;
  transcript: string;
  questions: Question[];
  questionGroups?: QuestionGroupData[];
}

export default function ListeningTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading test...</p>
          </div>
        </div>
      }
    >
      <ListeningTestContent testId={testId} />
    </Suspense>
  );
}

function ListeningTestContent({ testId }: { testId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get("review") === "true";
  const reviewAttemptId = searchParams.get("attemptId");

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const {
    sections,
    isLoading,
    error,
    hasStarted,
    setHasStarted,
    isSubmitting,
    isTimeUp,
    showSubmitDialog,
    setShowSubmitDialog,
    reviewData,
    unansweredQuestions,
    activeSectionId,
    setActiveSectionId,
    answers,
    answeredCount,
    handleAnswer,
    handleSubmit,
  } = useListeningTest(testId, isReviewMode, reviewAttemptId);

  const sectionPassages = useMemo(
    () =>
      sections.map((section: Section) => ({
        id: section.id,
        passageNumber: section.sectionNumber,
        title: `Section ${section.sectionNumber}`,
        content: section.transcript || "",
        wordCount: null,
        questions: section.questions,
        questionGroups: section.questionGroups,
      })),
    [sections],
  );

  const {
    activePassageIndex,
    currentPassage,
    questionOffset,
    firstQuestionNum,
    lastQuestionNum,
    totalQuestions,
    questionGroups,
    activeQuestionNumber,
    goToQuestion,
  } = useQuestionNavigation(sectionPassages, activeSectionId);

  const currentSection =
    sections.find((section) => section.id === activeSectionId) ?? null;

  const testOptions = useTestOptions();
  useSyncTestTheme(testOptions.contrast);

  useNavigationProtection({
    enabled: hasStarted && !isReviewMode,
  });

  const getTypeInstruction = (type: string) => {
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
  };

  const renderQuestion = (question: Question, index: number) => {
    const globalIndex = questionOffset + index;
    const review = reviewData[question.id];
    const value = isReviewMode
      ? review?.userAnswer || ""
      : answers[question.id]?.answer || "";

    const commonProps = {
      questionId: question.id,
      questionNumber: globalIndex + 1,
      questionText: question.text,
      value,
      onChange: (value: string) => handleAnswer(question.id, value),
      disabled: isReviewMode,
      reviewMode: isReviewMode,
      correctAnswer: review?.correctAnswer,
      isCorrect: review?.isCorrect,
      isUnanswered: unansweredQuestions.has(question.id),
    };

    switch (question.type) {
      case "mcq_single":
        return (
          <MultipleChoice
            key={question.id}
            {...commonProps}
            options={question.options ?? []}
          />
        );
      case "mcq_multiple":
        return (
          <MultipleAnswer
            key={question.id}
            {...commonProps}
            options={question.options ?? []}
          />
        );
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
        return (
          <MatchingSelect
            key={question.id}
            {...commonProps}
            options={question.options ?? []}
            placeholder="Select a heading"
          />
        );
      case "matching_info":
        return (
          <MatchingSelect
            key={question.id}
            {...commonProps}
            options={question.options ?? []}
            placeholder="Select a paragraph"
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/listening")}
          >
            Back to Listening Tests
          </Button>
        </div>
      </div>
    );
  }

  if (!currentSection || !currentPassage) return null;

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-3xl w-full mx-4">
          <CardHeader className="px-4 md:px-8 pt-5 pb-4">
            <CardTitle className="text-2xl md:text-3xl">IELTS Listening Test</CardTitle>
            <CardDescription className="text-sm md:text-base mt-1">
              Please read the instructions carefully before starting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Headphones className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-base md:text-lg">Listening Sections</p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    This test contains {sections.length} section
                    {sections.length > 1 ? "s" : ""} with {totalQuestions}{" "}
                    questions total
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Send className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-base md:text-lg">Instructions</p>
                  <ul className="text-sm md:text-base text-muted-foreground space-y-1.5 mt-1 list-disc list-inside">
                    <li>Audio will start automatically when you begin.</li>
                    <li>
                      Listen carefully: audio plays once and cannot be paused.
                    </li>
                    <li>Answer while listening or after audio finishes.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 md:pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 text-sm md:text-base"
                onClick={() => router.push("/dashboard/listening")}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 text-sm md:text-base"
                size="lg"
                onClick={() => {
                  setHasStarted(true);
                }}
              >
                Begin Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { theme, rootStyle } = testOptions;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={rootStyle}>
      {/* Top Header Bar */}
      <header
        className="shrink-0 h-12 md:h-16 flex items-center px-3 md:px-6 justify-between"
        style={{
          backgroundColor: theme.bg,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="outline"
            size="default"
            onClick={() => {
              if (isReviewMode) {
                router.push(`/dashboard/results/${reviewAttemptId}`);
              } else if (window.confirm("If you leave this page, all your answers will be lost and your test progress will not be saved.")) {
                router.push("/dashboard/listening");
              }
            }}
            className="flex items-center gap-2 text-sm md:text-base px-2 md:px-3"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Back</span>
          </Button>
          <div className="bg-red-600 text-white px-2 md:px-4 py-[3.5px] text-sm md:text-lg font-bold rounded">
            IELTS
          </div>
          <span className="hidden md:inline text-lg" style={{ color: theme.textMuted }}>
            ID: {testId?.slice(0, 5) || "-----"}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleFullscreen}
            className="hidden md:block p-2 transition-opacity opacity-70 hover:opacity-100"
          >
            {isFullscreen ? (
              <Minimize2 className="h-6 w-6" />
            ) : (
              <Maximize2 className="h-6 w-6" />
            )}
          </button>
          <TestOptionsMenu {...testOptions} />
        </div>
      </header>

      {/* Part instruction sub-header */}
      <div
        className="shrink-0 px-3 md:px-6 py-2 md:py-2.5"
        style={{
          backgroundColor: theme.bgAlt,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <p className="font-bold text-base md:text-lg">Part {activePassageIndex + 1}</p>
        <p className="text-sm md:text-base" style={{ color: theme.textMuted }}>
          Listen and answer questions {firstQuestionNum}-{lastQuestionNum}.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
          {!isReviewMode && (
            <AudioPlayer audioUrl={currentSection.audioUrl} examMode />
          )}
          {questionGroups.map((group, groupIndex) => {
            const contextHtml = group.context as string | undefined;
            const instructionHtml = group.instruction as string | undefined;

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
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: theme.textMuted }}
                    >
                      {getTypeInstruction(group.type)}
                    </p>
                  )}
                </div>

                {(() => {
                  const diagramMeta = group.metadata as { diagramQuestions?: { imageUrl?: string } } | null;
                  const diagramImageUrl = diagramMeta?.diagramQuestions?.imageUrl;
                  const isFlowChart = group.options && Array.isArray(group.options) && group.options.length > 0 && typeof group.options[0] === 'object' && (group.options[0] as { optionText?: string }).optionText;

                  const buildGroupQuestions = () =>
                    group.questions.map((question) => {
                      const globalIdx = currentPassage.questions.findIndex((q) => q.id === question.id);
                      const review = reviewData[question.id];
                      const value = isReviewMode
                        ? review?.userAnswer || ""
                        : answers[question.id]?.answer || "";
                      return {
                        questionId: question.id,
                        questionNumber: questionOffset + globalIdx + 1,
                        value,
                        onChange: (val: string) => handleAnswer(question.id, val),
                        disabled: isReviewMode,
                        reviewMode: isReviewMode,
                        correctAnswer: review?.correctAnswer,
                        isCorrect: review?.isCorrect,
                        isUnanswered: unansweredQuestions.has(question.id),
                      };
                    });

                  // Diagram/Map labeling — image + letter select dropdowns
                  if (diagramImageUrl) {
                    const letterOptions = (group.options as string[]) || [];
                    return (
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
                            const globalIdx = currentPassage.questions.findIndex((q) => q.id === question.id);
                            const review = reviewData[question.id];
                            const value = isReviewMode
                              ? review?.userAnswer || ""
                              : answers[question.id]?.answer || "";
                            return (
                              <MatchingSelect
                                key={question.id}
                                questionId={question.id}
                                questionNumber={questionOffset + globalIdx + 1}
                                questionText={question.text}
                                options={letterOptions}
                                value={value}
                                onChange={(val: string) => handleAnswer(question.id, val)}
                                disabled={isReviewMode}
                                reviewMode={isReviewMode}
                                correctAnswer={review?.correctAnswer}
                                isCorrect={review?.isCorrect}
                                isUnanswered={unansweredQuestions.has(question.id)}
                                placeholder="Select a letter"
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // Flow chart — HTML boxes with arrows and embedded inputs
                  if (isFlowChart) {
                    return (
                      <FlowChart
                        title={contextHtml || undefined}
                        options={group.options as unknown as { optionKey?: string; optionText: string; orderIndex?: number }[]}
                        questions={buildGroupQuestions()}
                      />
                    );
                  }

                  // MCQ multiple with group-level context and options
                  const groupOptions = (group.options as string[]) || [];
                  if (group.type === "mcq_multiple" && groupOptions.length > 0) {
                    return (
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
                          disabled={isReviewMode}
                          reviewMode={isReviewMode}
                        />
                      </div>
                    );
                  }

                  // Context fill-in-blank — HTML with ______ placeholders
                  if (contextHtml) {
                    return (
                      <div className="text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mb-1 [&_p]:mb-1 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:dark:border-gray-600 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold [&_th]:bg-gray-100 [&_th]:dark:bg-gray-800 [&_td]:border [&_td]:border-gray-300 [&_td]:dark:border-gray-600 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top">
                        <ContextFillInBlank
                          contextHtml={contextHtml}
                          questions={buildGroupQuestions()}
                        />
                      </div>
                    );
                  }

                  // Default — individual questions
                  return (
                    <div className="space-y-6">
                      {group.questions.map((question) => {
                        const globalIdx = currentPassage.questions.findIndex((q) => q.id === question.id);
                        return (
                          <div key={question.id}>
                            {renderQuestion(question, globalIdx)}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {groupIndex < questionGroups.length - 1 && (
                  <hr className="my-6" style={{ borderColor: theme.border }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="shrink-0 h-12 md:h-14 flex items-center px-2 md:px-4 gap-0"
        style={{
          backgroundColor: theme.bg,
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        <div className="flex items-center justify-between flex-1 min-w-0 overflow-x-auto">
          {sectionPassages.map((passage, passageIdx) => {
            const passageOffset = sectionPassages
              .slice(0, passageIdx)
              .reduce((acc, p) => acc + p.questions.length, 0);
            const isActivePart = passage.id === activeSectionId;
            const passageAnswered = passage.questions.filter(
              (q) => !!answers[q.id]?.answer?.trim(),
            ).length;

            return (
              <div key={passage.id} className="flex items-center">
                {passageIdx > 0 && (
                  <div
                    className="w-px h-6 mx-1.5 md:mx-3"
                    style={{ backgroundColor: theme.border }}
                  />
                )}

                {isActivePart ? (
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <span
                      className="text-xs md:text-sm font-bold mr-0.5 md:mr-1 whitespace-nowrap"
                      style={{ color: theme.text }}
                    >
                      <span className="hidden md:inline">Part {passageIdx + 1}</span>
                      <span className="md:hidden">P{passageIdx + 1}</span>
                    </span>
                    {passage.questions.map((q, idx) => {
                      const qNum = passageOffset + idx + 1;
                      const isAnswered = !!answers[q.id]?.answer?.trim();
                      const isActiveQ = activeQuestionNumber === qNum;
                      return (
                        <button
                          key={q.id}
                          onClick={() => goToQuestion(qNum)}
                          className="cursor-pointer w-6 h-6 md:w-8 md:h-8 text-[10px] md:text-xs font-medium rounded-sm transition-colors"
                          style={{
                            border: `1px solid ${isActiveQ ? theme.text : theme.border}`,
                            backgroundColor: isAnswered
                              ? theme.bgAlt
                              : theme.bg,
                            color: theme.text,
                            opacity: isAnswered || isActiveQ ? 1 : 0.6,
                          }}
                        >
                          {qNum}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveSectionId(passage.id)}
                    className="flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 rounded transition-opacity hover:opacity-80 whitespace-nowrap"
                  >
                    <span
                      className="text-xs md:text-sm font-bold"
                      style={{ color: theme.text }}
                    >
                      <span className="hidden md:inline">Part {passageIdx + 1}</span>
                      <span className="md:hidden">P{passageIdx + 1}</span>
                    </span>
                    <span
                      className="text-xs md:text-sm"
                      style={{ color: theme.textMuted }}
                    >
                      {passageAnswered}/{passage.questions.length}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {!isReviewMode && (
          <button
            onClick={() => setShowSubmitDialog(true)}
            className="cursor-pointer shrink-0 ml-2 md:ml-3 w-8 h-8 md:w-10 md:h-10 bg-gray-800 hover:bg-gray-900 text-white rounded flex items-center justify-center transition-colors"
          >
            <Check className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        )}
      </div>

      <SubmitDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        onConfirm={handleSubmit}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        isSubmitting={isSubmitting}
        timeUp={isTimeUp}
      />

    </div>
  );
}
