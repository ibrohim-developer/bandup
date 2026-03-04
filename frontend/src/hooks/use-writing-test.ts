"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTestStore } from "@/stores/test-store";
import { TEST_CONFIG } from "@/lib/constants/test-config";

export interface WritingTask {
  id: string;
  taskNumber: number;
  taskType: string | null;
  prompt: string;
  imageUrl: string | null;
  minWords: number;
  timeLimit: number;
}

export interface ReviewSubmission {
  id: string;
  taskId: string;
  content: string;
  wordCount: number;
  taskAchievementScore: number | null;
  coherenceScore: number | null;
  lexicalScore: number | null;
  grammarScore: number | null;
  overallBandScore: number | null;
  feedback: string | null;
}

interface WritingReviewResponse {
  tasks: WritingTask[];
  submissions: ReviewSubmission[];
}

interface WritingStartResponse {
  totalTimeLimit: number;
  tasks: WritingTask[];
}

export function useWritingTest(
  testId: string,
  isReviewMode: boolean,
  reviewAttemptId: string | null,
) {
  const router = useRouter();
  const { initTest, timeRemaining } = useTestStore();

  const [tasks, setTasks] = useState<WritingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState("");
  const [contents, setContents] = useState<Record<string, string>>({});
  const [reviewSubmissions, setReviewSubmissions] = useState<
    ReviewSubmission[]
  >([]);
  const [totalTime, setTotalTime] = useState(TEST_CONFIG.writing.totalTime);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const getWordCount = useCallback(
    (text: string) => text.trim().split(/\s+/).filter((w) => w).length,
    [],
  );

  const taskCompletions = tasks.map((task) => ({
    id: task.id,
    complete: getWordCount(contents[task.id] || "") >= task.minWords,
  }));
  const answeredCount = taskCompletions.filter((t) => t.complete).length;

  const getSubmissionForTask = useCallback(
    (taskId: string) => reviewSubmissions.find((submission) => submission.taskId === taskId),
    [reviewSubmissions],
  );

  const loadReviewMode = useCallback(async () => {
    if (!reviewAttemptId) {
      setError("No attempt ID provided for review");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/writing/review?attemptId=${reviewAttemptId}`);
      if (!res.ok) {
        throw new Error("Failed to load review data");
      }

      const data: WritingReviewResponse = await res.json();
      setTasks(data.tasks);
      setActiveTaskId(data.tasks[0]?.id ?? "");
      setReviewSubmissions(data.submissions);

      const contentMap: Record<string, string> = {};
      data.submissions.forEach((submission) => {
        contentMap[submission.taskId] = submission.content;
      });
      setContents(contentMap);
      setHasStarted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load review");
    } finally {
      setIsLoading(false);
    }
  }, [reviewAttemptId]);

  const startTest = useCallback(async () => {
    if (!testId) {
      setError("No test ID provided");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/writing/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start test");
      }

      const data: WritingStartResponse = await res.json();
      setTasks(data.tasks);
      setActiveTaskId(data.tasks[0]?.id ?? "");

      // Use time limit from backend, fallback to config if not available
      const time = data.totalTimeLimit || TEST_CONFIG.writing.totalTime;

      setTotalTime(time);
      initTest(testId, "writing", time, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start test");
    } finally {
      setIsLoading(false);
    }
  }, [testId, initTest]);

  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    if (isReviewMode) {
      loadReviewMode();
    } else {
      startTest();
    }
  }, [isReviewMode, loadReviewMode, startTest]);

  const setContent = useCallback((taskId: string, value: string) => {
    setContents((prev) => ({ ...prev, [taskId]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!testId) return;
    setIsSubmitting(true);

    try {
      const submissions = tasks.map((task) => ({
        taskId: task.id,
        content: contents[task.id] || "",
      }));

      const timeSpentSeconds = totalTime - timeRemaining;

      const res = await fetch("/api/writing/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId,
          submissions,
          timeSpentSeconds,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit test");
      }

      const result = await res.json();

      // Redirect immediately — EvaluatingBanner will trigger evaluation
      // and refresh the page once it completes
      router.push(`/dashboard/results/${result.attemptId}`);
    } catch {
      setIsSubmitting(false);
    }
  }, [testId, tasks, contents, totalTime, timeRemaining, router]);

  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    setShowSubmitDialog(true);
    handleSubmit();
  }, [handleSubmit]);

  return {
    tasks,
    isLoading,
    error,
    hasStarted,
    setHasStarted,
    activeTaskId,
    setActiveTaskId,
    contents,
    setContent,
    reviewSubmissions,
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
  };
}

