"use client";

import { use, Suspense, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TestTimer } from "@/components/test/common/test-timer";
import { SubmitDialog } from "@/components/test/common/submit-dialog";
import { TestOptionsMenu } from "@/components/test/common/test-options-menu";
import { SplitView } from "@/components/test/common/split-view";
import { PassageDisplay } from "@/components/test/reading/passage-display";
import { AudioPlayer } from "@/components/test/listening/audio-player";
import { WritingEditor } from "@/components/test/writing/writing-editor";
import { MultipleChoice } from "@/components/test/questions/multiple-choice";
import { MultipleAnswer } from "@/components/test/questions/multiple-answer";

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
    const { resumeTimer, resetTest } = useTestStore();
    const liveTimeRemaining = useTestStore((s) => s.timeRemaining);

    const abandonAndLeave = () => {
        resetTest();
        try {
            sessionStorage.removeItem("ielts-test-storage");
        } catch { }
        router.push(`/dashboard/full-mock-test/${testId}`);
    };

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

    const [showNextModuleDialog, setShowNextModuleDialog] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);

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
    useNavigationProtection({
        enabled: hasStarted,
        onBackAttempt: abandonAndLeave,
    });

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

    // Submitting screen — covers the gap between "Submit" and the navigation that follows.
    // Without this the user sees the test detail page with no acknowledgement that LRW saved.
    if (isSubmitting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
                <div className="flex flex-col items-center gap-5 text-center max-w-md">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <div className="space-y-1.5">
                        <p className="text-lg md:text-xl font-bold">Saving your test…</p>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Submitting Listening, Reading and Writing. AI scoring for Writing will run in the background — you can move on to Speaking next.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Instructions / Start Screen
    if (!hasStarted) {
        const totalQuestionsAll = totalListeningQuestions + totalReadingQuestions;
        const sections = [
            {
                icon: Headphones,
                label: "Listening",
                duration: "30 min",
                detail: `${listeningSections.length} sections · ${totalListeningQuestions} questions`,
                accent: "bg-blue-500",
                accentSoft: "bg-blue-500/10",
                text: "text-blue-600 dark:text-blue-400",
                ring: "ring-blue-500/20",
            },
            {
                icon: BookOpen,
                label: "Reading",
                duration: "60 min",
                detail: `${readingPassages.length} passages · ${totalReadingQuestions} questions`,
                accent: "bg-emerald-500",
                accentSoft: "bg-emerald-500/10",
                text: "text-emerald-600 dark:text-emerald-400",
                ring: "ring-emerald-500/20",
            },
            {
                icon: PenTool,
                label: "Writing",
                duration: "60 min",
                detail: `${writingTasks.length} tasks`,
                accent: "bg-purple-500",
                accentSoft: "bg-purple-500/10",
                text: "text-purple-600 dark:text-purple-400",
                ring: "ring-purple-500/20",
            },
        ];

        const rules = [
            "Sections proceed in order: Listening → Reading → Writing",
            "Each section has its own timer",
            "You cannot return to a previous section",
            "Your test will be submitted after the Writing section",
        ];

        return (
            <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-8">
                <div className="max-w-4xl w-full space-y-6 md:space-y-8">
                    {/* Hero */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                            Full Mock Test
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                            Listening, Reading & Writing
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm md:text-base text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold text-foreground">2h 30min</span> total
                            </span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            <span>
                                <span className="font-semibold text-foreground">3</span> sections
                            </span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            <span>
                                <span className="font-semibold text-foreground">~{totalQuestionsAll}</span> questions
                            </span>
                        </div>
                    </div>

                    {/* Section cards */}
                    <div className="grid gap-4 md:gap-5 md:grid-cols-3">
                        {sections.map((s, idx) => {
                            const Icon = s.icon;
                            return (
                                <div
                                    key={s.label}
                                    className="relative bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-md"
                                >
                                    <div className={`h-1 w-full ${s.accent}`} />
                                    <div className="p-5 md:p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-11 h-11 rounded-lg ${s.accentSoft} flex items-center justify-center`}>
                                                <Icon className={`h-5 w-5 ${s.text}`} />
                                            </div>
                                            <span className={`text-xs font-bold ${s.text}`}>
                                                {String(idx + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold mb-1">{s.label}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">{s.detail}</p>
                                        <div className={`inline-flex items-center gap-1.5 rounded-md ${s.accentSoft} px-2.5 py-1 text-xs font-semibold ${s.text}`}>
                                            <Clock className="h-3.5 w-3.5" />
                                            {s.duration}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Rules */}
                    <div className="rounded-xl border border-border bg-card p-5 md:p-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            Before you begin
                        </h4>
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {rules.map((rule) => (
                                <li key={rule} className="flex items-start gap-2.5 text-sm md:text-base">
                                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                    <span>{rule}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            size="lg"
                            className="sm:flex-1 text-sm md:text-base"
                            onClick={() => router.push(`/dashboard/full-mock-test/${testId}`)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="sm:flex-[2] text-sm md:text-base gap-2"
                            size="lg"
                            onClick={() => {
                                setHasStarted(true);
                                resumeTimer();
                            }}
                        >
                            Begin Test
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
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
            {/* Row 1 — Utility header */}
            <header
                className="shrink-0 h-12 md:h-14 flex items-center px-2 md:px-6 justify-between"
                style={{ backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}` }}
            >
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => setShowExitDialog(true)}
                        className="flex items-center gap-1.5 px-2 md:px-2.5 py-1.5 rounded-md transition-colors hover:bg-white/5 text-sm md:text-base"
                        style={{ color: theme.text }}
                    >
                        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="hidden md:inline">Back</span>
                    </button>
                    <div className="hidden md:block h-6 w-px" style={{ backgroundColor: theme.border }} />
                    <div className="font-black text-base md:text-lg tracking-tight" style={{ color: theme.text }}>
                        IELTS
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
                    <TestOptionsMenu {...testOptions} module="full-mock-test" />
                </div>
            </header>

            {/* Timer Progress Bar */}
            <div className="shrink-0 h-1" style={{ backgroundColor: theme.border }}>
                <div
                    className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                    style={{
                        width: `${(liveTimeRemaining / sectionTimers[activeModule]) * 100}%`,
                    }}
                />
            </div>

            {/* Row 2 — Module stepper */}
            <div
                className="hidden md:block shrink-0 px-6 py-3"
                style={{ backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}` }}
            >
                <div className="max-w-5xl mx-auto flex items-center">
                    {(["listening", "reading", "writing"] as ActiveModule[]).map((mod, idx) => {
                        const info = MODULE_LABELS[mod];
                        const Icon = info.icon;
                        const isActive = activeModule === mod;
                        const isCompleted = completedModules.includes(mod);
                        const isLast = idx === 2;

                        return (
                            <div key={mod} className="flex items-center flex-1 last:flex-none">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                            isActive
                                                ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                                : isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5" />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className={`text-[10px] font-bold uppercase tracking-widest ${
                                                isActive ? "text-primary" : isCompleted ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                                            }`}
                                        >
                                            Step {idx + 1}
                                        </span>
                                        <span
                                            className={`text-sm font-bold ${
                                                isActive || isCompleted ? "" : "opacity-60"
                                            }`}
                                            style={{ color: isActive || isCompleted ? theme.text : undefined }}
                                        >
                                            {info.label}
                                        </span>
                                    </div>
                                </div>
                                {!isLast && (
                                    <div className="flex-1 mx-4 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.border }}>
                                        <div
                                            className="h-full bg-green-500 transition-all duration-500"
                                            style={{ width: isCompleted ? "100%" : "0%" }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile dot stepper */}
            <div
                className="md:hidden shrink-0 px-3 py-2 flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}` }}
            >
                {(["listening", "reading", "writing"] as ActiveModule[]).map((mod) => {
                    const info = MODULE_LABELS[mod];
                    const Icon = info.icon;
                    const isActive = activeModule === mod;
                    const isCompleted = completedModules.includes(mod);
                    return (
                        <div
                            key={mod}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : isCompleted
                                        ? "bg-green-500/15 text-green-600 dark:text-green-400"
                                        : "text-muted-foreground opacity-50"
                            }`}
                        >
                            {isCompleted ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                            {info.label}
                        </div>
                    );
                })}
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
                                disableWordLookup
                            />
                        }
                        rightPanel={
                            <div className="h-full p-3 md:p-6 space-y-6" style={{ backgroundColor: theme.bg }}>
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
                                                        <div className="space-y-6">
                                                            {contextHtml && (
                                                                <div className="text-sm leading-relaxed rich-html" dangerouslySetInnerHTML={{ __html: contextHtml }} />
                                                            )}
                                                            {group.questions.map((question) => {
                                                                const globalIdx = currentPassage.questions.findIndex(
                                                                    (pq) => pq.id === question.id,
                                                                );
                                                                const value = answers[question.id]?.answer || "";
                                                                return (
                                                                    <MultipleAnswer
                                                                        key={question.id}
                                                                        questionId={question.id}
                                                                        questionNumber={questionOffset + globalIdx + 1}
                                                                        questionText={question.text}
                                                                        options={groupOptions}
                                                                        value={value}
                                                                        onChange={(val: string) => handleAnswer(question.id, val)}
                                                                        disabled={false}
                                                                        reviewMode={false}
                                                                    />
                                                                );
                                                            })}
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
                        onClick={() => setShowNextModuleDialog(true)}
                        className="cursor-pointer shrink-0 ml-2 md:ml-3 flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-primary text-primary-foreground rounded text-xs md:text-sm font-bold transition-colors hover:opacity-90"
                    >
                        Next: {activeModule === "listening" ? "Reading" : "Writing"}
                        <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => setShowSubmitDialog(true)}
                        disabled={isSubmitting}
                        className="cursor-pointer shrink-0 ml-2 md:ml-3 flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-primary text-primary-foreground rounded text-xs md:text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                        ) : (
                            <>
                                Submit Test
                                <Check className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </>
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

            {/* Next module confirmation dialog */}
            <Dialog open={showNextModuleDialog} onOpenChange={setShowNextModuleDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Move to {activeModule === "listening" ? "Reading" : "Writing"}?
                        </DialogTitle>
                        <DialogDescription>
                            You cannot return to this section once you proceed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-3">
                        <div className="rounded-lg bg-muted p-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Answered</p>
                                <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Unanswered</p>
                                <p className={`text-2xl font-bold ${totalQuestions - answeredCount > 0 ? "text-amber-500" : "text-green-600"}`}>
                                    {totalQuestions - answeredCount}
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNextModuleDialog(false)}>
                            Stay here
                        </Button>
                        <Button onClick={() => { setShowNextModuleDialog(false); goToNextModule(); }}>
                            Continue to {activeModule === "listening" ? "Reading" : "Writing"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Exit confirmation dialog */}
            <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave the test?</DialogTitle>
                        <DialogDescription>
                            Your answers and progress will be lost. Nothing is saved until you submit the full Listening, Reading & Writing section.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowExitDialog(false)}>
                            Stay in test
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setShowExitDialog(false);
                                abandonAndLeave();
                            }}
                        >
                            Leave anyway
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
