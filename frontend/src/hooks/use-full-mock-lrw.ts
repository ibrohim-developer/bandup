"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTestStore } from "@/stores/test-store";
import { TEST_CONFIG } from "@/lib/constants/test-config";

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

export interface ListeningSection {
    id: string;
    sectionNumber: number;
    transcript: string;
    timeLimit: number;
    questions: Question[];
    questionGroups?: QuestionGroupData[];
}

export interface ReadingPassage {
    id: string;
    passageNumber: number;
    title: string;
    content: string;
    wordCount: number | null;
    timeLimit: number;
    questions: Question[];
    questionGroups?: QuestionGroupData[];
}

export interface WritingTask {
    id: string;
    taskNumber: number;
    taskType: string | null;
    prompt: string;
    imageUrl: string | null;
    minWords: number;
    timeLimit: number;
}

export type ActiveModule = "listening" | "reading" | "writing";

interface SectionTimers {
    listening: number;
    reading: number;
    writing: number;
}

interface Answer {
    answer: string;
}

export function useFullMockLRW(testId: string) {
    const router = useRouter();
    const { initTest, answers, setAnswer, timeRemaining, resumeTimer, pauseTimer } =
        useTestStore();

    // Module state
    const [activeModule, setActiveModule] = useState<ActiveModule>("listening");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    // Listening data
    const [listeningSections, setListeningSections] = useState<ListeningSection[]>([]);
    const [audioUrl, setAudioUrl] = useState("");
    const [activeSectionId, setActiveSectionId] = useState("");

    // Reading data
    const [readingPassages, setReadingPassages] = useState<ReadingPassage[]>([]);
    const [activePassageId, setActivePassageId] = useState("");

    // Writing data
    const [writingTasks, setWritingTasks] = useState<WritingTask[]>([]);
    const [activeTaskId, setActiveTaskId] = useState("");
    const [writingContents, setWritingContents] = useState<Record<string, string>>({});

    // Section timers (store remaining time for each section)
    const [sectionTimers, setSectionTimers] = useState<SectionTimers>({
        listening: TEST_CONFIG.listening.totalTime,
        reading: TEST_CONFIG.reading.totalTime,
        writing: TEST_CONFIG.writing.totalTime,
    });

    // All answers stored per module
    const [listeningAnswers, setListeningAnswers] = useState<Record<string, Answer>>({});
    const [readingAnswers, setReadingAnswers] = useState<Record<string, Answer>>({});

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showSectionTransition, setShowSectionTransition] = useState(false);

    // Completed modules tracking
    const [completedModules, setCompletedModules] = useState<ActiveModule[]>([]);

    const currentSectionTime = sectionTimers[activeModule];

    const didFetch = useRef(false);

    // Load all test data on mount
    const loadTestData = useCallback(async () => {
        if (!testId) {
            setError("No test ID provided");
            setIsLoading(false);
            return;
        }

        try {
            // Fetch all 3 modules in parallel
            const [listeningRes, readingRes, writingRes] = await Promise.all([
                fetch("/api/listening/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ testId }),
                }),
                fetch("/api/reading/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ testId }),
                }),
                fetch("/api/writing/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ testId }),
                }),
            ]);

            if (!listeningRes.ok || !readingRes.ok || !writingRes.ok) {
                throw new Error("Failed to load test data");
            }

            const [listeningData, readingData, writingData] = await Promise.all([
                listeningRes.json(),
                readingRes.json(),
                writingRes.json(),
            ]);

            // Set listening data
            setListeningSections(listeningData.sections || []);
            setAudioUrl(listeningData.audioUrl || "");
            setActiveSectionId(listeningData.sections?.[0]?.id ?? "");

            // Set reading data
            setReadingPassages(readingData.passages || []);
            setActivePassageId(readingData.passages?.[0]?.id ?? "");

            // Set writing data
            setWritingTasks(writingData.tasks || []);
            setActiveTaskId(writingData.tasks?.[0]?.id ?? "");

            // Set timers from backend data
            const listeningTime = listeningData.totalTimeLimit || TEST_CONFIG.listening.totalTime;
            const readingTime = readingData.totalTimeLimit || TEST_CONFIG.reading.totalTime;
            const writingTime = writingData.totalTimeLimit || TEST_CONFIG.writing.totalTime;

            setSectionTimers({
                listening: listeningTime,
                reading: readingTime,
                writing: writingTime,
            });

            // Initialize test store with listening time (first module)
            initTest(testId, "listening", listeningTime, false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load test data");
        } finally {
            setIsLoading(false);
        }
    }, [testId, initTest]);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;
        loadTestData();
    }, [loadTestData]);

    // Handle answer for current module
    const handleAnswer = useCallback(
        (questionId: string, value: string) => {
            setAnswer(questionId, value);
            if (activeModule === "listening") {
                setListeningAnswers((prev) => ({
                    ...prev,
                    [questionId]: { answer: value },
                }));
            } else if (activeModule === "reading") {
                setReadingAnswers((prev) => ({
                    ...prev,
                    [questionId]: { answer: value },
                }));
            }
        },
        [activeModule, setAnswer],
    );

    // Set writing content
    const setWritingContent = useCallback((taskId: string, value: string) => {
        setWritingContents((prev) => ({ ...prev, [taskId]: value }));
    }, []);

    // Transition to next module
    const goToNextModule = useCallback(() => {
        pauseTimer();

        // Save current timer state
        setSectionTimers((prev) => ({
            ...prev,
            [activeModule]: timeRemaining,
        }));

        // Mark current module as completed
        setCompletedModules((prev) => [...prev, activeModule]);

        const moduleOrder: ActiveModule[] = ["listening", "reading", "writing"];
        const currentIndex = moduleOrder.indexOf(activeModule);
        const nextModule = moduleOrder[currentIndex + 1];

        if (nextModule) {
            setActiveModule(nextModule);
            const nextTime = sectionTimers[nextModule];

            // Re-init test store with new module time
            initTest(testId, nextModule as "listening" | "reading" | "writing", nextTime, false);
            setShowSectionTransition(false);
        }
    }, [activeModule, timeRemaining, sectionTimers, testId, initTest, pauseTimer]);

    // Calculate answered counts per module
    const listeningAnsweredCount = Object.values(listeningAnswers).filter(
        (a) => a.answer.trim() !== "",
    ).length;

    const readingAnsweredCount = Object.values(readingAnswers).filter(
        (a) => a.answer.trim() !== "",
    ).length;

    const getWordCount = useCallback(
        (text: string) => text.trim().split(/\s+/).filter((w) => w).length,
        [],
    );

    const writingTaskCompletions = writingTasks.map((task) => ({
        id: task.id,
        complete: getWordCount(writingContents[task.id] || "") >= task.minWords,
    }));

    const writingAnsweredCount = writingTaskCompletions.filter((t) => t.complete).length;

    const totalListeningQuestions = listeningSections.reduce(
        (sum, s) => sum + s.questions.length,
        0,
    );
    const totalReadingQuestions = readingPassages.reduce(
        (sum, p) => sum + p.questions.length,
        0,
    );

    // Submit all modules
    const handleSubmit = useCallback(async () => {
        if (!testId) return;
        setIsSubmitting(true);

        try {
            // Save current timer
            const currentTimers = {
                ...sectionTimers,
                [activeModule]: timeRemaining,
            };

            // Submit listening answers
            const listeningPayload: Record<string, string> = {};
            for (const [qId, ans] of Object.entries(listeningAnswers)) {
                listeningPayload[qId] = ans.answer;
            }

            // Submit reading answers
            const readingPayload: Record<string, string> = {};
            for (const [qId, ans] of Object.entries(readingAnswers)) {
                readingPayload[qId] = ans.answer;
            }

            // Submit writing
            const writingSubmissions = writingTasks.map((task) => ({
                taskId: task.id,
                content: writingContents[task.id] || "",
            }));

            // Submit all 3 modules
            const [listeningRes, readingRes, writingRes] = await Promise.all([
                fetch("/api/listening/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        testId,
                        answers: listeningPayload,
                        timeSpentSeconds: currentTimers.listening > 0
                            ? sectionTimers.listening - currentTimers.listening
                            : sectionTimers.listening,
                    }),
                }),
                fetch("/api/reading/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        testId,
                        answers: readingPayload,
                        timeSpentSeconds: currentTimers.reading > 0
                            ? sectionTimers.reading - currentTimers.reading
                            : sectionTimers.reading,
                    }),
                }),
                fetch("/api/writing/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        testId,
                        submissions: writingSubmissions,
                        timeSpentSeconds: currentTimers.writing > 0
                            ? sectionTimers.writing - currentTimers.writing
                            : sectionTimers.writing,
                    }),
                }),
            ]);

            const [listeningResult, readingResult, writingResult] = await Promise.all([
                listeningRes.json(),
                readingRes.json(),
                writingRes.json(),
            ]);

            // Redirect to results — we'll show the listening result page for now
            // In the future, this should go to a combined results page
            router.push(`/dashboard/results/${listeningResult.attemptId}`);
        } catch {
            setIsSubmitting(false);
        }
    }, [
        testId,
        activeModule,
        timeRemaining,
        sectionTimers,
        listeningAnswers,
        readingAnswers,
        writingTasks,
        writingContents,
        router,
    ]);

    const handleTimeUp = useCallback(() => {
        if (activeModule === "writing") {
            // Last module — submit everything
            setIsTimeUp(true);
            setShowSubmitDialog(true);
            handleSubmit();
        } else {
            // Auto-advance to next module
            setIsTimeUp(true);
            goToNextModule();
            setIsTimeUp(false);
        }
    }, [activeModule, handleSubmit, goToNextModule]);

    return {
        // Module state
        activeModule,
        isLoading,
        error,
        hasStarted,
        setHasStarted,

        // Listening
        listeningSections,
        audioUrl,
        activeSectionId,
        setActiveSectionId,
        listeningAnsweredCount,
        totalListeningQuestions,

        // Reading
        readingPassages,
        activePassageId,
        setActivePassageId,
        readingAnsweredCount,
        totalReadingQuestions,

        // Writing
        writingTasks,
        activeTaskId,
        setActiveTaskId,
        writingContents,
        setWritingContent,
        writingTaskCompletions,
        writingAnsweredCount,

        // Timer
        sectionTimers,
        currentSectionTime,

        // Answers
        answers,
        handleAnswer,

        // Navigation
        completedModules,
        showSectionTransition,
        setShowSectionTransition,
        goToNextModule,

        // Submit
        isSubmitting,
        isTimeUp,
        showSubmitDialog,
        setShowSubmitDialog,
        handleSubmit,
        handleTimeUp,
    };
}
