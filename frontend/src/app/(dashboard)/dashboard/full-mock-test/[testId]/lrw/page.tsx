"use client";

import { use, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TestTimer } from "@/components/test/common/test-timer";
import { SubmitDialog } from "@/components/test/common/submit-dialog";
import { TestOptionsMenu } from "@/components/test/common/test-options-menu";
import { SplitView } from "@/components/test/common/split-view";
import { PassageDisplay } from "@/components/test/reading/passage-display";
import { AudioPlayer } from "@/components/test/listening/audio-player";
import { WritingEditor } from "@/components/test/writing/writing-editor";
import { MultipleChoice } from "@/components/test/questions/multiple-choice";
import { MultipleAnswer } from "@/components/test/questions/multiple-answer";
import { MultipleAnswerGroup } from "@/components/test/questions/multiple-answer-group";
import { TrueFalseNotGiven } from "@/components/test/questions/true-false-not-given";
import { FillInBlank } from "@/components/test/questions/fill-in-blank";
import { ContextFillInBlank } from "@/components/test/questions/context-fill-in-blank";
import { MatchingSelect } from "@/components/test/questions/matching-select";
import { FlowChart } from "@/components/test/questions/flow-chart";
import { useFullMockLRW, type ActiveModule } from "@/hooks/use-full-mock-lrw";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useNavigationProtection } from "@/hooks/use-navigation-protection";
import { useQuestionNavigation } from "@/hooks/use-question-navigation";
import { useTestOptions } from "@/hooks/use-test-options";
import { useTestStore } from "@/stores/test-store";
import { useSyncTestTheme } from "@/components/force-light-theme";
import {
    Loader2,
    Headphones,
    BookOpen,
    PenTool,
    Clock,
    ArrowLeft,
    ArrowRight,
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

const MODULE_LABELS: Record<ActiveModule, { label: string; icon: typeof Headphones; color: string }> = {
    listening: { label: "Listening", icon: Headphones, color: "text-blue-500" },
    reading: { label: "Reading", icon: BookOpen, color: "text-emerald-500" },
    writing: { label: "Writing", icon: PenTool, color: "text-purple-500" },
};

export default function LRWExamPage({
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
                        <p className="text-muted-foreground">Loading full mock test...</p>
                    </div>
                </div>
            }
        >
            <LRWExamContent testId={testId} />
        </Suspense>
    );
}

function LRWExamContent({ testId }: { testId: string }) {
    const router = useRouter();
    const { isFullscreen, toggleFullscreen } = useFullscreen();
    const { resumeTimer } = useTestStore();

    const {
        activeModule,
        isLoading,
        error,
        hasStarted,
        setHasStarted,
        listeningSections,
        audioUrl,
        activeSectionId,
        setActiveSectionId,
        listeningAnsweredCount,
        totalListeningQuestions,
        readingPassages,
        activePassageId,
        setActivePassageId,
        readingAnsweredCount,
        totalReadingQuestions,
        writingTasks,
        activeTaskId,
        setActiveTaskId,
        writingContents,
        setWritingContent,
        writingTaskCompletions,
        writingAnsweredCount,
        sectionTimers,
        answers,
        handleAnswer,
        completedModules,
        goToNextModule,
        isSubmitting,
        isTimeUp,
        showSubmitDialog,
        setShowSubmitDialog,
        handleSubmit,
        handleTimeUp,
    } = useFullMockLRW(testId);

    // Build passages-like structure for navigation hook
    const sectionPassages = useMemo(() => {
        if (activeModule === "listening") {
            return listeningSections.map((section) => ({
                id: section.id,
                passageNumber: section.sectionNumber,
                title: `Section ${section.sectionNumber}`,
                content: section.transcript || "",
                wordCount: null,
                questions: section.questions,
                questionGroups: section.questionGroups,
            }));
        }
        if (activeModule === "reading") {
            return readingPassages.map((passage) => ({
                id: passage.id,
                passageNumber: passage.passageNumber,
                title: passage.title,
                content: passage.content,
                wordCount: passage.wordCount,
                questions: passage.questions,
                questionGroups: passage.questionGroups,
            }));
        }
        return [];
    }, [activeModule, listeningSections, readingPassages]);

    const activeId = activeModule === "listening" ? activeSectionId : activePassageId;

    const {
        activePassageIndex,
        currentPassage,
        questionOffset,
        firstQuestionNum,
        lastQuestionNum,
        totalQuestions: currentModuleTotalQuestions,
        questionGroups,
        activeQuestionNumber,
        goToQuestion,
    } = useQuestionNavigation(sectionPassages, activeId);

    const testOptions = useTestOptions();
    useSyncTestTheme(testOptions.contrast);
    useNavigationProtection({ enabled: hasStarted });

    const renderQuestion = (question: Question, index: number) => {
        const globalIndex = questionOffset + index;
        const value = answers[question.id]?.answer || "";

        const commonProps = {
            questionId: question.id,
            questionNumber: globalIndex + 1,
            questionText: question.text,
            value,
            onChange: (value: string) => handleAnswer(question.id, value),
            disabled: false,
            reviewMode: false,
            correctAnswer: undefined,
            isCorrect: undefined,
            isUnanswered: false,
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading full mock test...</p>
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
                        onClick={() => router.push(`/dashboard/full-mock-test/${testId}`)}
                    >
                        Back to Test
                    </Button>
                </div>
            </div>
        );
    }

    // Instructions / Start Screen
    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
                <Card className="max-w-3xl w-full">
                    <CardHeader className="px-4 md:px-8 pt-5 pb-4">
                        <CardTitle className="text-2xl md:text-3xl">
                            IELTS Full Mock Test — LRW
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base mt-1">
                            Listening, Reading & Writing — please read the instructions carefully
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 md:space-y-8 px-4 md:px-6">
                        <div className="space-y-5 md:space-y-6">
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Headphones className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-base md:text-lg">Listening — 30 minutes</p>
                                    <p className="text-sm md:text-base text-muted-foreground">
                                        {listeningSections.length} sections · {totalListeningQuestions} questions
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-base md:text-lg">Reading — 60 minutes</p>
                                    <p className="text-sm md:text-base text-muted-foreground">
                                        {readingPassages.length} passages · {totalReadingQuestions} questions
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                    <PenTool className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-base md:text-lg">Writing — 60 minutes</p>
                                    <p className="text-sm md:text-base text-muted-foreground">
                                        {writingTasks.length} tasks
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-base md:text-lg">Instructions</p>
                                    <ul className="text-sm md:text-base text-muted-foreground space-y-1.5 mt-1 list-disc list-inside">
                                        <li>Sections proceed in order: Listening → Reading → Writing</li>
                                        <li>Each section has its own timer</li>
                                        <li>You cannot return to a previous section</li>
                                        <li>Your test will be submitted after the Writing section</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2 md:pt-4">
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1 text-sm md:text-base"
                                onClick={() => router.push(`/dashboard/full-mock-test/${testId}`)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 text-sm md:text-base"
                                size="lg"
                                onClick={() => {
                                    setHasStarted(true);
                                    resumeTimer();
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
    const moduleInfo = MODULE_LABELS[activeModule];
    const ModuleIcon = moduleInfo.icon;

    const answeredCount =
        activeModule === "listening"
            ? listeningAnsweredCount
            : activeModule === "reading"
                ? readingAnsweredCount
                : writingAnsweredCount;
    const totalQuestions =
        activeModule === "listening"
            ? totalListeningQuestions
            : activeModule === "reading"
                ? totalReadingQuestions
                : writingTasks.length;

    return (
        <div className="h-screen flex flex-col overflow-hidden" style={rootStyle}>
            {/* Top Header Bar */}
            <header
                className="shrink-0 h-12 md:h-16 flex items-center px-2 md:px-6 justify-between"
                style={{ backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}` }}
            >
                <div className="flex items-center gap-2 md:gap-4">
                    <Button
                        variant="outline"
                        size="default"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "If you leave this page, all your answers will be lost and your test progress will not be saved.",
                                )
                            ) {
                                router.push(`/dashboard/full-mock-test/${testId}`);
                            }
                        }}
                        className="flex items-center gap-2 text-sm md:text-base px-2 md:px-3"
                    >
                        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="hidden md:inline">Back</span>
                    </Button>
                    <div className="bg-red-600 text-white px-2 md:px-4 py-0.5 md:py-[3.5px] text-sm md:text-lg font-bold rounded">
                        IELTS
                    </div>

                    {/* Module progress indicator */}
                    <div className="hidden md:flex items-center gap-1.5 ml-2">
                        {(["listening", "reading", "writing"] as ActiveModule[]).map((mod, idx) => {
                            const info = MODULE_LABELS[mod];
                            const Icon = info.icon;
                            const isActive = activeModule === mod;
                            const isCompleted = completedModules.includes(mod);

                            return (
                                <div key={mod} className="flex items-center">
                                    {idx > 0 && (
                                        <div className="w-4 h-px mx-1" style={{ backgroundColor: theme.border }} />
                                    )}
                                    <div
                                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-colors ${isActive
                                                ? "bg-primary/10 text-primary"
                                                : isCompleted
                                                    ? "text-green-500"
                                                    : "text-muted-foreground opacity-50"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-3.5 w-3.5" />
                                        ) : (
                                            <Icon className="h-3.5 w-3.5" />
                                        )}
                                        {info.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <TestTimer
                    onTimeUp={handleTimeUp}
                    className="bg-transparent px-2 md:px-3 py-1 md:py-1.5 text-sm md:text-lg font-semibold"
                />

                <div className="flex items-center gap-1 md:gap-3">
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

            {/* Timer Progress Bar */}
            <div className="shrink-0 h-1" style={{ backgroundColor: theme.border }}>
                <div
                    className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                    style={{
                        width: `${(useTestStore.getState().timeRemaining / sectionTimers[activeModule]) * 100}%`,
                    }}
                />
            </div>

            {/* Module-specific sub-header */}
            <div
                className="shrink-0 px-3 md:px-6 py-2 md:py-2.5 flex items-center justify-between"
                style={{
                    backgroundColor: theme.bgAlt,
                    borderBottom: `1px solid ${theme.border}`,
                }}
            >
                <div>
                    <div className="flex items-center gap-2">
                        <ModuleIcon className={`h-4 w-4 ${moduleInfo.color}`} />
                        <p className="font-bold text-base md:text-lg">{moduleInfo.label}</p>
                        {activeModule !== "writing" && currentPassage && (
                            <span style={{ color: theme.textMuted }}>
                                — Part {activePassageIndex + 1}
                            </span>
                        )}
                    </div>
                    {activeModule !== "writing" && currentPassage && (
                        <p className="text-sm" style={{ color: theme.textMuted }}>
                            {activeModule === "listening" ? "Listen and answer" : "Read the text and answer"}{" "}
                            questions {firstQuestionNum}-{lastQuestionNum}.
                        </p>
                    )}
                </div>
                {/* Mobile module indicator */}
                <div className="md:hidden flex items-center gap-1">
                    {(["listening", "reading", "writing"] as ActiveModule[]).map((mod) => {
                        const isActive = activeModule === mod;
                        const isCompleted = completedModules.includes(mod);
                        return (
                            <div
                                key={mod}
                                className={`w-2 h-2 rounded-full ${isActive ? "bg-primary" : isCompleted ? "bg-green-500" : "bg-muted-foreground/30"
                                    }`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
                {/* LISTENING MODULE */}
                {activeModule === "listening" && (
                    <div className="h-full overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
                            <AudioPlayer audioUrl={audioUrl} examMode />
                            {questionGroups.map((group, groupIndex) => {
                                const contextHtml = group.context as string | undefined;
                                const instructionHtml = group.instruction as string | undefined;

                                return (
                                    <div key={groupIndex}>
                                        <div className="mb-4">
                                            <h3 className="font-bold text-base mb-2">
                                                Questions {group.startNum}-{group.endNum}
                                            </h3>
                                            {instructionHtml && (
                                                <div
                                                    className="text-sm leading-relaxed [&_strong]:font-bold"
                                                    style={{ color: theme.textMuted }}
                                                    dangerouslySetInnerHTML={{ __html: instructionHtml }}
                                                />
                                            )}
                                        </div>

                                        {(() => {
                                            const buildGroupQuestions = () =>
                                                group.questions.map((question) => {
                                                    const globalIdx = currentPassage!.questions.findIndex(
                                                        (q) => q.id === question.id,
                                                    );
                                                    const value = answers[question.id]?.answer || "";
                                                    return {
                                                        questionId: question.id,
                                                        questionNumber: questionOffset + globalIdx + 1,
                                                        value,
                                                        onChange: (val: string) => handleAnswer(question.id, val),
                                                        disabled: false,
                                                        reviewMode: false,
                                                        correctAnswer: undefined,
                                                        isCorrect: undefined,
                                                        isUnanswered: false,
                                                    };
                                                });

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

                                            return (
                                                <div className="space-y-6">
                                                    {group.questions.map((question) => {
                                                        const globalIdx = currentPassage!.questions.findIndex(
                                                            (q) => q.id === question.id,
                                                        );
                                                        return <div key={question.id}>{renderQuestion(question, globalIdx)}</div>;
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
                )}

                {/* READING MODULE */}
                {activeModule === "reading" && currentPassage && (
                    <SplitView
                        leftPanel={
                            <PassageDisplay
                                title={currentPassage.title}
                                content={currentPassage.content}
                                highlight={theme.highlight}
                                noteHighlight={theme.noteHighlight}
                            />
                        }
                        rightPanel={
                            <div className="p-3 md:p-6 space-y-6" style={{ backgroundColor: theme.bg }}>
                                {questionGroups.map((group, groupIndex) => {
                                    const contextHtml = group.context as string | undefined;
                                    const instructionHtml = group.instruction as string | undefined;

                                    return (
                                        <div key={groupIndex}>
                                            <div className="mb-4">
                                                <h3 className="font-bold text-base mb-2">
                                                    Questions {group.startNum}-{group.endNum}
                                                </h3>
                                                {instructionHtml && (
                                                    <div
                                                        className="text-sm leading-relaxed rich-html"
                                                        style={{ color: theme.textMuted }}
                                                        dangerouslySetInnerHTML={{ __html: instructionHtml }}
                                                    />
                                                )}
                                            </div>

                                            {(() => {
                                                const buildGroupQuestions = () =>
                                                    group.questions.map((question) => {
                                                        const globalIdx = currentPassage.questions.findIndex(
                                                            (pq) => pq.id === question.id,
                                                        );
                                                        const value = answers[question.id]?.answer || "";
                                                        return {
                                                            questionId: question.id,
                                                            questionNumber: questionOffset + globalIdx + 1,
                                                            questionText: question.text,
                                                            value,
                                                            onChange: (val: string) => handleAnswer(question.id, val),
                                                            disabled: false,
                                                            reviewMode: false,
                                                            correctAnswer: undefined,
                                                            isCorrect: undefined,
                                                            isUnanswered: false,
                                                        };
                                                    });

                                                const groupOptions = group.options ?? [];

                                                if (
                                                    contextHtml &&
                                                    ["gap_fill", "summary_completion", "summary_completion_drag_drop", "short_answer", "note_completion", "table_completion", "sentence_completion"].includes(group.type)
                                                ) {
                                                    return (
                                                        <div className="text-sm leading-relaxed rich-html">
                                                            <ContextFillInBlank
                                                                contextHtml={contextHtml}
                                                                questions={buildGroupQuestions()}
                                                            />
                                                        </div>
                                                    );
                                                }

                                                if (
                                                    ["matching_info", "matching_headings", "matching_names"].includes(group.type) &&
                                                    groupOptions.length > 0
                                                ) {
                                                    const MatchingGrid = require("@/components/test/questions/matching-grid").MatchingGrid;
                                                    return (
                                                        <MatchingGrid
                                                            options={groupOptions}
                                                            questions={buildGroupQuestions()}
                                                        />
                                                    );
                                                }

                                                if (group.type === "flow_chart_completion" && groupOptions.length > 0) {
                                                    return (
                                                        <FlowChart
                                                            title={contextHtml || undefined}
                                                            options={groupOptions as unknown as { optionKey?: string; optionText: string; orderIndex?: number }[]}
                                                            questions={buildGroupQuestions()}
                                                        />
                                                    );
                                                }

                                                if (group.type === "mcq_multiple" && groupOptions.length > 0) {
                                                    return (
                                                        <div className="space-y-4">
                                                            {contextHtml && (
                                                                <div className="text-sm leading-relaxed rich-html" dangerouslySetInnerHTML={{ __html: contextHtml }} />
                                                            )}
                                                            <MultipleAnswerGroup
                                                                options={groupOptions}
                                                                questions={buildGroupQuestions()}
                                                                disabled={false}
                                                                reviewMode={false}
                                                            />
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div className="space-y-6">
                                                        {contextHtml && (
                                                            <div className="text-sm leading-relaxed rich-html" dangerouslySetInnerHTML={{ __html: contextHtml }} />
                                                        )}
                                                        {group.questions.map((question) => {
                                                            const globalIdx = currentPassage.questions.findIndex(
                                                                (pq) => pq.id === question.id,
                                                            );
                                                            return <div key={question.id}>{renderQuestion(question, globalIdx)}</div>;
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
                        }
                    />
                )}

                {/* WRITING MODULE */}
                {activeModule === "writing" && writingTasks.length > 0 && (() => {
                    const activeTask = writingTasks.find((t) => t.id === activeTaskId) ?? writingTasks[0];
                    const recommendedTime = activeTask.taskNumber === 1 ? 20 : 40;

                    return (
                        <SplitView
                            leftPanel={
                                <div className="p-3 md:p-6" style={{ backgroundColor: theme.bg }}>
                                    <div className="flex items-center justify-between mb-1 md:mb-2">
                                        <h2 className="text-base md:text-lg font-bold">
                                            Task {activeTask.taskNumber} —{" "}
                                            {activeTask.taskType === "report" ? "Report Writing" : "Essay Writing"}
                                        </h2>
                                        <div className="flex items-center gap-1 text-xs md:text-sm" style={{ color: theme.textMuted }}>
                                            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />~{recommendedTime} min
                                        </div>
                                    </div>
                                    <p className="text-xs md:text-sm mb-3 md:mb-4" style={{ color: theme.textMuted }}>
                                        You should spend about {recommendedTime} minutes on this task.
                                    </p>
                                    <div className="prose dark:prose-invert max-w-none mb-6 md:mb-20 text-sm md:text-base">
                                        <p className="whitespace-pre-line">{activeTask.prompt}</p>
                                    </div>
                                    {activeTask.imageUrl && (
                                        <div className="flex justify-center">
                                            <div className="relative aspect-video rounded-lg overflow-hidden mb-4 border w-full md:w-250">
                                                <Image
                                                    src={activeTask.imageUrl}
                                                    alt={`Task ${activeTask.taskNumber} image`}
                                                    className="object-contain"
                                                    fill
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                            rightPanel={
                                <div className="p-3 md:p-6 h-full flex flex-col" style={{ backgroundColor: theme.bg }}>
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-base md:text-lg font-bold">Your Response</h2>
                                    </div>
                                    <p className="text-xs md:text-sm mb-2 md:mb-4" style={{ color: theme.textMuted }}>
                                        Write at least {activeTask.minWords} words
                                    </p>
                                    <div className="flex-1 min-h-0">
                                        <WritingEditor
                                            value={writingContents[activeTask.id] || ""}
                                            onChange={(value) => setWritingContent(activeTask.id, value)}
                                            minWords={activeTask.minWords}
                                            placeholder={`Write your Task ${activeTask.taskNumber} response here...`}
                                            disabled={false}
                                        />
                                    </div>
                                </div>
                            }
                        />
                    );
                })()}
            </div>

            {/* Bottom Navigation Bar */}
            <div
                className="shrink-0 h-12 md:h-14 flex items-center px-2 md:px-4 gap-0"
                style={{
                    backgroundColor: theme.bg,
                    borderTop: `1px solid ${theme.border}`,
                }}
            >
                <div className="flex items-center justify-between flex-1 min-w-0 overflow-x-auto">
                    {activeModule !== "writing" ? (
                        // Listening / Reading bottom nav — question numbers
                        <>
                            {sectionPassages.map((passage, passageIdx) => {
                                const passageOffset = sectionPassages
                                    .slice(0, passageIdx)
                                    .reduce((acc, p) => acc + p.questions.length, 0);
                                const isActivePart = passage.id === activeId;
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
                                                                backgroundColor: isAnswered ? theme.bgAlt : theme.bg,
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
                                                onClick={() => {
                                                    if (activeModule === "listening") setActiveSectionId(passage.id);
                                                    else setActivePassageId(passage.id);
                                                }}
                                                className="flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 rounded transition-opacity hover:opacity-80 whitespace-nowrap"
                                            >
                                                <span className="text-xs md:text-sm font-bold" style={{ color: theme.text }}>
                                                    <span className="hidden md:inline">Part {passageIdx + 1}</span>
                                                    <span className="md:hidden">P{passageIdx + 1}</span>
                                                </span>
                                                <span className="text-xs md:text-sm" style={{ color: theme.textMuted }}>
                                                    {passageAnswered}/{passage.questions.length}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        // Writing bottom nav — task tabs
                        <>
                            {writingTasks.map((task, taskIdx) => {
                                const isActiveTask = task.id === activeTaskId;
                                const isComplete = writingTaskCompletions.find(
                                    (c) => c.id === task.id,
                                )?.complete;

                                return (
                                    <div key={task.id} className="flex items-center">
                                        {taskIdx > 0 && (
                                            <div
                                                className="w-px h-5 md:h-6 mx-1.5 md:mx-3"
                                                style={{ backgroundColor: theme.border }}
                                            />
                                        )}
                                        <button
                                            onClick={() => setActiveTaskId(task.id)}
                                            className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded transition-opacity hover:opacity-80 whitespace-nowrap"
                                            style={{
                                                backgroundColor: isActiveTask ? theme.bgAlt : "transparent",
                                                border: isActiveTask ? `1px solid ${theme.border}` : "1px solid transparent",
                                            }}
                                        >
                                            <span className="text-xs md:text-sm font-bold" style={{ color: theme.text }}>
                                                Task {task.taskNumber}
                                            </span>
                                            {isComplete && <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500" />}
                                        </button>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* Next Section / Submit button */}
                {activeModule !== "writing" ? (
                    <button
                        onClick={goToNextModule}
                        className="cursor-pointer shrink-0 ml-2 md:ml-3 flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-primary text-primary-foreground rounded text-xs md:text-sm font-bold transition-colors hover:opacity-90"
                    >
                        Next: {activeModule === "listening" ? "Reading" : "Writing"}
                        <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => setShowSubmitDialog(true)}
                        disabled={isSubmitting}
                        className="cursor-pointer shrink-0 ml-2 md:ml-3 w-8 h-8 md:w-10 md:h-10 bg-gray-800 hover:bg-gray-900 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                        ) : (
                            <Check className="h-4 w-4 md:h-5 md:w-5" />
                        )}
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
