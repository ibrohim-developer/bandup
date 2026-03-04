"use client";

import { useState, useEffect, useCallback } from "react";
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

interface Section {
  id: string;
  sectionNumber: number;
  audioUrl: string;
  audioDurationSeconds: number;
  transcript: string;
  timeLimit: number;
  questions: Question[];
}

type ReviewMap = Record<
  string,
  { userAnswer: string; correctAnswer: string; isCorrect: boolean }
>;

interface UserAnswerReview {
  question_id: string;
  user_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
}

export function useListeningTest(
  testId: string,
  isReviewMode: boolean,
  reviewAttemptId: string | null,
) {
  const router = useRouter();
  const { initTest, answers, setAnswer, timeRemaining } =
    useTestStore();

  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewMap>({});
  const [unansweredQuestions, setUnansweredQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [activeSectionId, setActiveSectionId] = useState("");
  const [totalTime, setTotalTime] = useState(TEST_CONFIG.listening.totalTime);

  const answeredCount = Object.values(answers).filter(
    (a) => a.answer.trim() !== "",
  ).length;

  const loadReviewMode = useCallback(async () => {
    if (!reviewAttemptId) {
      setError("No attempt ID provided for review");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/listening/review?attemptId=${reviewAttemptId}`,
      );

      if (!res.ok) {
        throw new Error("Failed to load review data");
      }

      const data = await res.json();
      setSections(data.sections);
      setActiveSectionId(data.sections[0]?.id ?? "");

      const reviewMap: ReviewMap = {};
      const unanswered = new Set<string>();
      const userAnswers: UserAnswerReview[] = Array.isArray(data.userAnswers)
        ? data.userAnswers
        : [];

      userAnswers.forEach((ua) => {
        reviewMap[ua.question_id] = {
          userAnswer: ua.user_answer || "",
          correctAnswer: ua.correct_answer,
          isCorrect: ua.is_correct,
        };
        if (!ua.user_answer || ua.user_answer.trim() === "") {
          unanswered.add(ua.question_id);
        }
      });

      setReviewData(reviewMap);
      setUnansweredQuestions(unanswered);
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
      const res = await fetch("/api/listening/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start test");
      }

      const data = await res.json();
      setSections(data.sections);
      setActiveSectionId(data.sections[0]?.id ?? "");

      // Use time limit from backend, fallback to config if not available
      const time = data.totalTimeLimit || TEST_CONFIG.listening.totalTime;
      setTotalTime(time);

      initTest(
        testId,
        "listening",
        time,
        false,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start test");
    } finally {
      setIsLoading(false);
    }
  }, [testId, initTest]);

  useEffect(() => {
    if (isReviewMode) {
      loadReviewMode();
    } else {
      startTest();
    }
  }, [isReviewMode, loadReviewMode, startTest]);

  const handleSubmit = useCallback(async () => {
    if (!testId) return;
    setIsSubmitting(true);

    try {
      const answersPayload: Record<string, string> = {};
      for (const [qId, ans] of Object.entries(answers)) {
        answersPayload[qId] = ans.answer;
      }

      const timeSpentSeconds = totalTime - timeRemaining;

      const res = await fetch("/api/listening/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId,
          answers: answersPayload,
          timeSpentSeconds,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit test");
      }

      const result = await res.json();
      router.push(`/dashboard/results/${result.attemptId}`);
    } catch {
      setIsSubmitting(false);
    }
  }, [testId, answers, timeRemaining, totalTime, router]);

  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    setShowSubmitDialog(true);
    handleSubmit();
  }, [handleSubmit]);

  const handleAnswer = useCallback(
    (questionId: string, value: string) => {
      setAnswer(questionId, value);
    },
    [setAnswer],
  );

  return {
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
    totalTime,
    handleAnswer,
    handleSubmit,
    handleTimeUp,
  };
}
