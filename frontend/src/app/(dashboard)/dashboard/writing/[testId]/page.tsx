"use client";

import { use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SplitView } from "@/components/test/common/split-view";
import { TestTimer } from "@/components/test/common/test-timer";
import { SubmitDialog } from "@/components/test/common/submit-dialog";
import { TestOptionsMenu } from "@/components/test/common/test-options-menu";
import { WritingEditor } from "@/components/test/writing/writing-editor";
import { useTestStore } from "@/stores/test-store";
import { WritingFeedback } from "@/components/test/writing/writing-feedback";
import { useWritingTest } from "@/hooks/use-writing-test";
import { useNavigationProtection } from "@/hooks/use-navigation-protection";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useTestOptions } from "@/hooks/use-test-options";
import { useSyncTestTheme } from "@/components/force-light-theme";
import {
  Send,
  Loader2,
  Clock,
  PenTool,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Sparkles,
  Check,
} from "lucide-react";

export default function WritingTestPage({
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
      <WritingTestContent testId={testId} />
    </Suspense>
  );
}

function WritingTestContent({ testId }: { testId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get("review") === "true";
  const reviewAttemptId = searchParams.get("attemptId");

  const { resumeTimer, timeRemaining } = useTestStore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const {
    tasks,
    isLoading,
    error,
    hasStarted,
    setHasStarted,
    activeTaskId,
    setActiveTaskId,
    contents,
    setContent,
    totalTime,
    showSubmitDialog,
    setShowSubmitDialog,
    isSubmitting,
    isTimeUp,
    taskCompletions,
    answeredCount,
    getSubmissionForTask,
    handleSubmit,
    handleTimeUp,
  } = useWritingTest(testId, isReviewMode, reviewAttemptId);

  const testOptions = useTestOptions();
  useSyncTestTheme(testOptions.contrast);

  useNavigationProtection({
    enabled: hasStarted && !isReviewMode,
  });

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
            onClick={() => router.push("/dashboard/writing")}
          >
            Back to Writing Tests
          </Button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) return null;

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? tasks[0];
  const submission = getSubmissionForTask(activeTask.id);
  const recommendedTime = activeTask.taskNumber === 1 ? 20 : 40;

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <Card className="max-w-3xl w-full">
          <CardHeader className="px-4 md:px-8 pt-5 pb-4">
            <CardTitle className="text-2xl md:text-3xl">IELTS Writing Test</CardTitle>
            <CardDescription className="text-sm md:text-base mt-1">
              Please read the instructions carefully before starting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 md:space-y-8 px-4 md:px-6">
            <div className="space-y-5 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-base md:text-lg">Time Limit</p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    You have {totalTime / 60} minutes to complete this test
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <PenTool className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-base md:text-lg">Writing Task</p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {tasks[0]?.taskType === "report"
                      ? "Report Writing - describe charts, graphs, or diagrams"
                      : "Essay Writing - present and support your argument"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Send className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-base md:text-lg">Instructions</p>
                  <ul className="text-sm md:text-base text-muted-foreground space-y-1.5 mt-1 list-disc list-inside">
                    <li>Write at least {tasks[0]?.minWords ?? 150} words.</li>
                    <li>Your essay will be evaluated by AI after submission.</li>
                    <li>The timer starts when you click &quot;Begin Test&quot;.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 md:pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 text-sm md:text-base"
                onClick={() => router.push("/dashboard/writing")}
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
              if (isReviewMode) {
                router.push(`/dashboard/results/${reviewAttemptId}`);
              } else if (window.confirm("If you leave this page, all your answers will be lost and your test progress will not be saved.")) {
                router.push("/dashboard/writing");
              }
            }}
            className="flex items-center gap-2 text-sm md:text-base px-2 md:px-3"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Back</span>
          </Button>
          <div className="bg-red-600 text-white px-2 py-0.5 md:px-4 md:py-[3.5px] text-sm md:text-lg font-bold rounded">
            IELTS
          </div>
          {!isReviewMode && (
            <span className="hidden md:inline text-base font-medium" style={{ color: theme.textMuted }}>
              Writing Test
            </span>
          )}
        </div>

        {!isReviewMode && (
          <TestTimer
            onTimeUp={handleTimeUp}
            className="bg-transparent px-2 md:px-3 py-1 md:py-1.5 text-sm md:text-lg font-semibold"
          />
        )}

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
      {!isReviewMode && (
        <div className="shrink-0 h-1" style={{ backgroundColor: theme.border }}>
          <div
            className="h-full bg-red-500 transition-all duration-1000 ease-linear"
            style={{
              width: `${(timeRemaining / totalTime) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Active Task Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0">
          <SplitView
            leftPanel={
              <div className="p-3 md:p-6" style={{ backgroundColor: theme.bg }}>
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <h2 className="text-base md:text-lg font-bold">
                    Task {activeTask.taskNumber} -{" "}
                    {activeTask.taskType === "report"
                      ? "Report Writing"
                      : "Essay Writing"}
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
                    value={contents[activeTask.id] || ""}
                    onChange={(value) => setContent(activeTask.id, value)}
                    minWords={activeTask.minWords}
                    placeholder={`Write your Task ${activeTask.taskNumber} response here...`}
                    disabled={isReviewMode}
                  />
                </div>
              </div>
            }
          />
        </div>

        {isReviewMode &&
          submission &&
          submission.overallBandScore !== null && (
            <div className="shrink-0 overflow-y-auto max-h-[40%] border-t" style={{ borderColor: theme.border }}>
              <div className="p-3 md:p-6" style={{ backgroundColor: theme.bg }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-bold">
                    AI Evaluation - Task {activeTask.taskNumber}
                  </h3>
                </div>
                <p className="text-sm mb-4" style={{ color: theme.textMuted }}>
                  Overall Band Score: {submission.overallBandScore}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <ScoreCard
                    label="Task Achievement"
                    score={submission.taskAchievementScore}
                  />
                  <ScoreCard
                    label="Coherence & Cohesion"
                    score={submission.coherenceScore}
                  />
                  <ScoreCard
                    label="Lexical Resource"
                    score={submission.lexicalScore}
                  />
                  <ScoreCard
                    label="Grammar"
                    score={submission.grammarScore}
                  />
                </div>
                {submission.feedback && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Detailed Feedback
                    </h4>
                    <WritingFeedback feedback={submission.feedback} />
                  </div>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Bottom Navigation Bar */}
      <div
        className="shrink-0 h-12 md:h-14 flex items-center px-2 md:px-4 gap-0"
        style={{
          backgroundColor: theme.bg,
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        <div className="flex items-center flex-1 min-w-0">
          {tasks.map((task, taskIdx) => {
            const isActiveTask = task.id === activeTaskId;
            const isComplete = taskCompletions.find(
              (completion) => completion.id === task.id,
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
                  <span
                    className="text-xs md:text-sm font-bold"
                    style={{ color: theme.text }}
                  >
                    Task {task.taskNumber}
                  </span>
                  {isComplete && (
                    <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {!isReviewMode && (
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

      {!isReviewMode && (
        <>
          <SubmitDialog
            open={showSubmitDialog}
            onOpenChange={setShowSubmitDialog}
            onConfirm={handleSubmit}
            answeredCount={answeredCount}
            totalQuestions={tasks.length}
            isSubmitting={isSubmitting}
            timeUp={isTimeUp}
          />

        </>
      )}
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number | null }) {
  if (score === null) {
    return (
      <div className="text-center p-3 rounded-lg bg-muted">
        <div className="text-2xl font-bold text-muted-foreground">-</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    );
  }

  const getColor = (value: number) => {
    if (value >= 7) return "text-green-600";
    if (value >= 5) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="text-center p-3 rounded-lg bg-muted">
      <div className={`text-2xl font-bold ${getColor(score)}`}>{score}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
