"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "@/components/test/speaking/voice-recorder";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  Clock,
  ArrowLeft,
  Mic,
} from "lucide-react";

interface TopicData {
  documentId: string;
  topic: string;
  partNumber: number;
  preparationTime: number;
  speakingTime: number;
  questions: string[];
}

interface TestData {
  documentId: string;
  title: string;
  topics: TopicData[];
}

interface Recording {
  blob: Blob;
  durationSeconds: number;
}

export default function SpeakingTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [test, setTest] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation state
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Recordings: key = "topicDocId:questionIndex"
  const [recordings, setRecordings] = useState<Map<string, Recording>>(
    new Map()
  );
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load test data
  useEffect(() => {
    fetch(`/api/speaking/start-test?testId=${testId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTest(data.test);
        }
      })
      .catch(() => setError("Failed to load test"))
      .finally(() => setLoading(false));
  }, [testId]);

  // Timer
  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const recordingKey = (topicId: string, qIndex: number) =>
    `${topicId}:${qIndex}`;

  const handleRecordingComplete = useCallback(
    (blob: Blob, durationSeconds: number) => {
      if (!test) return;
      const topic = test.topics[currentTopicIndex];
      const key = recordingKey(topic.documentId, currentQuestionIndex);
      setRecordings((prev) => {
        const next = new Map(prev);
        next.set(key, { blob, durationSeconds });
        return next;
      });
    },
    [test, currentTopicIndex, currentQuestionIndex]
  );

  // Count recordings per topic
  const getTopicRecordingCount = (topic: TopicData) => {
    let count = 0;
    for (let i = 0; i < topic.questions.length; i++) {
      if (recordings.has(recordingKey(topic.documentId, i))) count++;
    }
    return count;
  };

  const isTopicComplete = (topic: TopicData) =>
    getTopicRecordingCount(topic) === topic.questions.length;

  const allComplete =
    test !== null && test.topics.every((t) => isTopicComplete(t));

  const totalQuestions =
    test?.topics.reduce((sum, t) => sum + t.questions.length, 0) ?? 0;
  const totalRecorded = recordings.size;

  // Navigation
  const currentTopic = test?.topics[currentTopicIndex];
  const currentQuestion = currentTopic?.questions[currentQuestionIndex];
  const currentKey = currentTopic
    ? recordingKey(currentTopic.documentId, currentQuestionIndex)
    : "";
  const hasCurrentRecording = recordings.has(currentKey);

  const isLastQuestionInTopic =
    currentTopic &&
    currentQuestionIndex === currentTopic.questions.length - 1;
  const isLastTopic = test && currentTopicIndex === test.topics.length - 1;

  const goToNextQuestion = () => {
    if (!currentTopic) return;
    if (currentQuestionIndex < currentTopic.questions.length - 1) {
      setCurrentQuestionIndex((q) => q + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((q) => q - 1);
    }
  };

  const goToNextPart = () => {
    if (!test || currentTopicIndex >= test.topics.length - 1) return;
    setCurrentTopicIndex((t) => t + 1);
    setCurrentQuestionIndex(0);
  };

  const goToPrevPart = () => {
    if (currentTopicIndex <= 0) return;
    setCurrentTopicIndex((t) => t - 1);
    setCurrentQuestionIndex(0);
  };

  // Submit all
  const handleSubmit = async () => {
    if (!test || !allComplete) return;
    setSubmitting(true);
    setError(null);

    try {
      // 1. Upload all audio files, grouped by topic
      const topics: {
        topicId: string;
        recordings: {
          questionIndex: number;
          audioUrl: string;
          durationSeconds: number;
        }[];
      }[] = [];

      for (const topic of test.topics) {
        const topicRecordings: {
          questionIndex: number;
          audioUrl: string;
          durationSeconds: number;
        }[] = [];

        for (let qIdx = 0; qIdx < topic.questions.length; qIdx++) {
          const key = recordingKey(topic.documentId, qIdx);
          const rec = recordings.get(key);
          if (!rec) throw new Error(`Missing recording for ${key}`);

          const formData = new FormData();
          formData.append(
            "file",
            rec.blob,
            `speaking-p${topic.partNumber}-q${qIdx + 1}.webm`
          );

          const uploadRes = await fetch("/api/speaking/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            throw new Error(
              `Failed to upload recording for Part ${topic.partNumber} Q${qIdx + 1}`
            );
          }

          const uploadData = await uploadRes.json();
          topicRecordings.push({
            questionIndex: qIdx,
            audioUrl: uploadData.url,
            durationSeconds: rec.durationSeconds,
          });
        }

        topics.push({ topicId: topic.documentId, recordings: topicRecordings });
      }

      // 2. Submit all
      const submitRes = await fetch("/api/speaking/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.documentId,
          topics,
          timeSpentSeconds: elapsed,
        }),
      });

      if (!submitRes.ok) {
        const data = await submitRes.json();
        throw new Error(data.error || "Submit failed");
      }

      const { attemptId } = await submitRes.json();

      // 3. Evaluate
      setSubmitting(false);
      setEvaluating(true);

      const evalRes = await fetch("/api/speaking/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });

      if (!evalRes.ok) {
        const data = await evalRes.json();
        throw new Error(data.error || "Evaluation failed");
      }

      // 4. Redirect to results
      router.push(`/dashboard/speaking/result/${attemptId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
      setEvaluating(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !test) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!test || !currentTopic) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back */}
      <Link
        href="/dashboard/speaking/questions"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Speaking Tests
      </Link>

      {/* Test header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold truncate">{test.title}</h1>
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Part progress */}
        <div className="flex items-center gap-2">
          {test.topics.map((topic, idx) => {
            const complete = isTopicComplete(topic);
            const isCurrent = idx === currentTopicIndex;
            return (
              <button
                key={topic.documentId}
                onClick={() => {
                  if (!isRecording) {
                    setCurrentTopicIndex(idx);
                    setCurrentQuestionIndex(0);
                  }
                }}
                disabled={isRecording}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isRecording ? "cursor-not-allowed opacity-50" : ""
                } ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : complete
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {complete && <CheckCircle className="h-3 w-3" />}
                Part {topic.partNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current part info */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-lg font-black text-xs tracking-widest uppercase">
              Part {currentTopic.partNumber}
            </span>
            {currentTopic.questions.length > 1 && (
              <span className="text-xs text-muted-foreground font-medium">
                Question {currentQuestionIndex + 1} of{" "}
                {currentTopic.questions.length}
              </span>
            )}
            {hasCurrentRecording && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium ml-auto">
                <CheckCircle className="h-3.5 w-3.5" />
                Recorded
              </span>
            )}
          </div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {currentTopic.topic}
          </h2>
          <p className="text-lg font-medium leading-relaxed">
            {currentQuestion}
          </p>
        </div>

        <VoiceRecorder
          key={currentKey}
          onRecordingComplete={handleRecordingComplete}
          onRecordingStateChange={setIsRecording}
          disabled={submitting || evaluating}
        />

        {/* Question dots within part */}
        {currentTopic.questions.length > 1 && (
          <div className="flex items-center justify-center gap-2">
            {currentTopic.questions.map((_, i) => {
              const qKey = recordingKey(currentTopic.documentId, i);
              const recorded = recordings.has(qKey);
              const active = i === currentQuestionIndex;
              return (
                <button
                  key={i}
                  onClick={() => !isRecording && setCurrentQuestionIndex(i)}
                  disabled={isRecording}
                  className={`h-7 w-7 rounded-full text-xs font-bold transition-colors ${
                    isRecording ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : recorded
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentQuestionIndex > 0 ? (
            <Button
              variant="outline"
              onClick={goToPrevQuestion}
              disabled={isRecording}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          ) : currentTopicIndex > 0 ? (
            <Button
              variant="outline"
              onClick={goToPrevPart}
              disabled={isRecording}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Part {test.topics[currentTopicIndex - 1].partNumber}
            </Button>
          ) : (
            <div />
          )}
        </div>

        <div>
          {!isLastQuestionInTopic ? (
            <Button
              variant="outline"
              onClick={goToNextQuestion}
              disabled={isRecording}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : !isLastTopic ? (
            <Button
              onClick={goToNextPart}
              disabled={isRecording}
              className="gap-2"
            >
              Continue to Part{" "}
              {test.topics[currentTopicIndex + 1].partNumber}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                !allComplete || submitting || evaluating || isRecording
              }
              className="gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : evaluating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Test
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Progress */}
      <div className="text-center text-xs text-muted-foreground">
        {totalRecorded} of {totalQuestions} questions recorded across{" "}
        {test.topics.length} {test.topics.length === 1 ? "part" : "parts"}
      </div>
    </div>
  );
}
