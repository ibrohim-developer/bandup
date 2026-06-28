"use client";

import { use, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
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
import { NotesDrawer } from "@/components/test/reading/notes-drawer";
import { ReadingQuestions } from "@/components/test/reading/reading-questions";
import { useTestStore } from "@/stores/test-store";
import { useReadingTest } from "@/hooks/use-reading-test";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useNavigationProtection } from "@/hooks/use-navigation-protection";
import { useQuestionNavigation } from "@/hooks/use-question-navigation";
import { useTestOptions } from "@/hooks/use-test-options";
import { useNotes } from "@/hooks/use-notes";
import { useSyncTestTheme } from "@/components/force-light-theme";
import {
  Send,
  Loader2,
  Clock,
  BookOpen,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Check,
  StickyNote,
  Bookmark,
} from "lucide-react";

export default function ReadingTestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

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
      <ReadingTestContent testId={slug} />
    </Suspense>
  );
}

function ReadingTestContent({ testId }: { testId: string }) {
  const router = useRouter();

  const { resumeTimer, timeRemaining, flaggedQuestions, toggleFlag, resetTest } =
    useTestStore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const {
    passages,
    isLoading,
    error,
    hasStarted,
    setHasStarted,
    isSubmitting,
    isTimeUp,
    showSubmitDialog,
    setShowSubmitDialog,
    activePassageId,
    setActivePassageId,
    answers,
    answeredCount,
    totalTime,
    handleAnswer,
    handleSubmit,
    handleTimeUp,
  } = useReadingTest(testId, false, null);

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
  } = useQuestionNavigation(passages, activePassageId);

  const testOptions = useTestOptions();
  const {
    notes,
    addHighlight,
    removeHighlight,
    addNote,
    removeNote,
    getNoteByMarkId,
  } = useNotes();
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [pendingNoteText, setPendingNoteText] = useState<string | null>(null);
  const [pendingNoteMarkId, setPendingNoteMarkId] = useState<string | null>(
    null,
  );
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [cancelNoteMarkId, setCancelNoteMarkId] = useState<string | null>(null);
  useSyncTestTheme(testOptions.contrast);
  useNavigationProtection({ enabled: hasStarted });

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
            onClick={() => router.push("/dashboard/reading")}
          >
            Back to Reading Tests
          </Button>
        </div>
      </div>
    );
  }

  if (!currentPassage) return null;

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-3xl w-full mx-4">
          <CardHeader className="px-4 md:px-8 pt-5 pb-4">
            <CardTitle className="text-2xl md:text-3xl">
              IELTS Reading Test
            </CardTitle>
            <CardDescription className="text-sm md:text-base mt-1">
              Please read the instructions carefully before starting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
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
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-base md:text-lg">
                    Reading Passages
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    This test contains {passages.length} passage
                    {passages.length > 1 ? "s" : ""} with {totalQuestions}{" "}
                    questions total
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Send className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-base md:text-lg">
                    Instructions
                  </p>
                  <ul className="text-sm md:text-base text-muted-foreground space-y-1.5 mt-1 list-disc list-inside">
                    <li>
                      Read each passage carefully before answering questions
                    </li>
                    <li>You can navigate between passages using the tabs</li>
                    <li>
                      The timer will start when you click &quot;Begin Test&quot;
                    </li>
                    <li>You can submit your test at any time</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 md:pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 text-sm md:text-base"
                onClick={() => router.push("/dashboard/reading")}
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

  const handleNavigation = () => {
    if (
      window.confirm(
        "If you leave this page, all your answers will be lost and your test progress will not be saved.",
      )
    ) {
      resetTest();
      router.push("/dashboard/reading");
    }
  };

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={rootStyle}>
      {/* Top Header Bar */}
      <header
        className="shrink-0 h-12 md:h-16 flex items-center px-2 md:px-6 justify-between"
        style={{
          backgroundColor: theme.bg,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="outline"
            size="default"
            onClick={handleNavigation}
            className="flex items-center gap-2 text-sm md:text-base px-2 md:px-3"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Back</span>
          </Button>
          <div className="bg-red-600 text-white px-2 md:px-4 h-7 md:h-8 flex items-center text-sm md:text-base font-bold rounded">
            IELTS
          </div>
          <span
            className="hidden md:inline text-lg"
            style={{ color: theme.textMuted }}
          >
            ID: {testId?.slice(0, 5) || "-----"}
          </span>
        </div>

        <TestTimer
          onTimeUp={handleTimeUp}
          className="bg-transparent px-2 md:px-3 py-1 md:py-1.5 text-sm md:text-lg font-semibold"
        />

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
          <TestOptionsMenu {...testOptions} module="reading" />
          <button
            onClick={() => setNotesDrawerOpen(true)}
            className="hidden md:block p-2 transition-opacity opacity-70 hover:opacity-100 relative"
            title="Notes"
          >
            <StickyNote className="h-6 w-6" />
            {notes.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notes.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Timer Progress Bar */}
      <div className="shrink-0 h-1" style={{ backgroundColor: theme.border }}>
        <div
          className="h-full bg-red-500 transition-all duration-1000 ease-linear"
          style={{
            width: `${(timeRemaining / totalTime) * 100}%`,
          }}
        />
      </div>

      {/* Part instruction sub-header */}
      <div
        className="shrink-0 px-3 md:px-6 py-2 md:py-2.5"
        style={{
          backgroundColor: theme.bgAlt,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <p className="font-bold text-base md:text-lg">
          Part {activePassageIndex + 1}
        </p>
        <p className="text-sm md:text-base" style={{ color: theme.textMuted }}>
          Read the text and answer questions {firstQuestionNum}-
          {lastQuestionNum}.
        </p>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 min-h-0">
        <SplitView
          leftPanel={
            <PassageDisplay
              title={currentPassage.title}
              content={currentPassage.content}
              highlight={theme.highlight}
              noteHighlight={theme.noteHighlight}
              onHighlight={(id, text) => addHighlight({ id, text })}
              onRemoveHighlight={removeHighlight}
              onNote={(markId, selectedText) => {
                setPendingNoteMarkId(markId);
                setPendingNoteText(selectedText);
                setNotesDrawerOpen(true);
              }}
              onNoteMarkClick={(markId) => {
                const note = getNoteByMarkId(markId);
                if (note) {
                  setActiveNoteId(note.id);
                  setNotesDrawerOpen(true);
                }
              }}
              cancelNoteMarkId={cancelNoteMarkId}
              onCancelNoteMarkHandled={() => setCancelNoteMarkId(null)}
            />
          }
          rightPanel={
            <div
              className="h-full min-w-0 p-3 md:p-6 space-y-6 break-words"
              style={{ backgroundColor: theme.bg }}
            >
              <ReadingQuestions
                questionGroups={questionGroups}
                passageQuestions={currentPassage.questions}
                questionOffset={questionOffset}
                answers={answers}
                onAnswer={handleAnswer}
                theme={{ border: theme.border, textMuted: theme.textMuted }}
                flaggedQuestions={flaggedQuestions}
                onToggleFlag={toggleFlag}
              />
            </div>
          }
        />
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
          {passages.map((passage, passageIdx) => {
            const passageOffset = passages
              .slice(0, passageIdx)
              .reduce((acc, p) => acc + p.questions.length, 0);
            const isActivePart = passage.id === activePassageId;
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
                      <span className="hidden md:inline">
                        Part {passageIdx + 1}
                      </span>
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
                          className="relative cursor-pointer w-6 h-6 md:w-8 md:h-8 text-[10px] md:text-xs font-medium rounded-sm transition-colors"
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
                          {flaggedQuestions.includes(q.id) && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3">
                              <Bookmark className="w-full h-full fill-red-500 text-red-500" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    onClick={() => setActivePassageId(passage.id)}
                    className="flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 rounded transition-opacity hover:opacity-80 whitespace-nowrap"
                  >
                    <span
                      className="text-xs md:text-sm font-bold"
                      style={{ color: theme.text }}
                    >
                      <span className="hidden md:inline">
                        Part {passageIdx + 1}
                      </span>
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

        <button
          onClick={() => setShowSubmitDialog(true)}
          className="cursor-pointer shrink-0 ml-2 md:ml-3 w-8 h-8 md:w-10 md:h-10 bg-gray-800 hover:bg-gray-900 text-white rounded flex items-center justify-center transition-colors"
        >
          <Check className="h-4 w-4 md:h-5 md:w-5" />
        </button>
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

      <NotesDrawer
        open={notesDrawerOpen}
        onOpenChange={setNotesDrawerOpen}
        notes={notes}
        pendingNoteText={pendingNoteText}
        pendingNoteMarkId={pendingNoteMarkId}
        activeNoteId={activeNoteId}
        onSaveNote={addNote}
        onDeleteNote={(noteId) => {
          const note = notes.find((n) => n.id === noteId);
          if (note) {
            setCancelNoteMarkId(note.markId);
          }
          removeNote(noteId);
        }}
        onCancelPending={() => {
          if (pendingNoteMarkId) {
            setCancelNoteMarkId(pendingNoteMarkId);
          }
          setPendingNoteText(null);
          setPendingNoteMarkId(null);
        }}
        onSaveComplete={() => {
          setPendingNoteText(null);
          setPendingNoteMarkId(null);
        }}
        onClearActive={() => setActiveNoteId(null)}
        theme={theme}
      />
    </div>
  );
}
