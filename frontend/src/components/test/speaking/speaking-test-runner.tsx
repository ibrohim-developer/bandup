"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "@/components/test/speaking/voice-recorder";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export interface SpeakingTopic {
  documentId: string;
  topic: string;
  partNumber: number;
  preparationTime: number;
  speakingTime: number;
  questions: string[];
}

export interface UploadedTopic {
  topicId: string;
  partNumber: number;
  recordings: {
    questionIndex: number;
    audioUrl: string;
    durationSeconds: number;
  }[];
}

interface Recording {
  blob: Blob;
  durationSeconds: number;
}

export interface SpeakingTestRunnerProps {
  topics: SpeakingTopic[];
  /** Rendered above the part tabs — typically the test title or a "Full Mock Test" badge. */
  headerLeft: ReactNode;
  /** Back button handler — caller decides between a router push, an exit dialog, etc. */
  onBack: () => void;
  /**
   * Called after audio uploads complete. Caller is responsible for the actual
   * /api/speaking/submit + /api/speaking/evaluate calls and the post-eval redirect.
   * The runner stays in the "evaluating" UI state until this promise resolves.
   */
  onSubmit: (uploadedTopics: UploadedTopic[], elapsedSeconds: number) => Promise<void>;
  /** Label for the final submit button. Defaults to "Submit Test". */
  submitLabel?: string;
}

const recordingKey = (topicId: string, qIndex: number) => `${topicId}:${qIndex}`;

export function SpeakingTestRunner({
  topics,
  headerLeft,
  onBack,
  onSubmit,
  submitLabel = "Submit Test",
}: SpeakingTestRunnerProps) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [recordings, setRecordings] = useState<Map<string, Recording>>(new Map());
  const [isRecording, setIsRecording] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleRecordingComplete = useCallback(
    (blob: Blob, durationSeconds: number) => {
      const topic = topics[currentTopicIndex];
      const key = recordingKey(topic.documentId, currentQuestionIndex);
      setRecordings((prev) => {
        const next = new Map(prev);
        next.set(key, { blob, durationSeconds });
        return next;
      });
    },
    [topics, currentTopicIndex, currentQuestionIndex],
  );

  const handleRecordingCleared = useCallback(() => {
    const topic = topics[currentTopicIndex];
    const key = recordingKey(topic.documentId, currentQuestionIndex);
    setRecordings((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, [topics, currentTopicIndex, currentQuestionIndex]);

  const getTopicRecordingCount = (topic: SpeakingTopic) => {
    let count = 0;
    for (let i = 0; i < topic.questions.length; i++) {
      if (recordings.has(recordingKey(topic.documentId, i))) count++;
    }
    return count;
  };

  const isTopicComplete = (topic: SpeakingTopic) =>
    getTopicRecordingCount(topic) === topic.questions.length;

  const allComplete = topics.every((t) => isTopicComplete(t));

  const totalQuestions = topics.reduce((sum, t) => sum + t.questions.length, 0);
  const totalRecorded = recordings.size;

  const currentTopic = topics[currentTopicIndex];
  const currentQuestion = currentTopic.questions[currentQuestionIndex];
  const currentKey = recordingKey(currentTopic.documentId, currentQuestionIndex);
  const hasCurrentRecording = recordings.has(currentKey);

  const isLastQuestionInTopic =
    currentQuestionIndex === currentTopic.questions.length - 1;
  const isLastTopic = currentTopicIndex === topics.length - 1;

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentTopic.questions.length - 1) {
      setCurrentQuestionIndex((q) => q + 1);
    }
  };
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((q) => q - 1);
  };
  const goToNextPart = () => {
    if (currentTopicIndex >= topics.length - 1) return;
    setCurrentTopicIndex((t) => t + 1);
    setCurrentQuestionIndex(0);
  };
  const goToPrevPart = () => {
    if (currentTopicIndex <= 0) return;
    setCurrentTopicIndex((t) => t - 1);
    setCurrentQuestionIndex(0);
  };

  const handleSubmit = async () => {
    if (!allComplete) return;
    setSubmitting(true);
    setError(null);

    try {
      const uploaded: UploadedTopic[] = [];

      for (const topic of topics) {
        const topicRecordings: UploadedTopic["recordings"] = [];

        for (let qIdx = 0; qIdx < topic.questions.length; qIdx++) {
          const key = recordingKey(topic.documentId, qIdx);
          const rec = recordings.get(key);
          if (!rec) throw new Error(`Missing recording for ${key}`);

          const formData = new FormData();
          formData.append(
            "file",
            rec.blob,
            `speaking-p${topic.partNumber}-q${qIdx + 1}.webm`,
          );

          const uploadRes = await fetch("/api/speaking/upload", {
            method: "POST",
            body: formData,
          });
          if (!uploadRes.ok) {
            throw new Error(
              `Failed to upload recording for Part ${topic.partNumber} Q${qIdx + 1}`,
            );
          }

          const uploadData = await uploadRes.json();
          topicRecordings.push({
            questionIndex: qIdx,
            audioUrl: uploadData.url,
            durationSeconds: rec.durationSeconds,
          });
        }

        uploaded.push({
          topicId: topic.documentId,
          partNumber: topic.partNumber,
          recordings: topicRecordings,
        });
      }

      // Hand off to the caller for submit + eval + redirect.
      setSubmitting(false);
      setEvaluating(true);
      await onSubmit(uploaded, elapsed);
      // Caller will navigate away on success; if it returns without navigating,
      // we surface the evaluating state until the page unmounts.
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

  if (submitting || evaluating) {
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <div>
              <h2 className="text-2xl font-bold">Submission failed</h2>
              <p className="text-muted-foreground mt-2">{error}</p>
            </div>
            <Button
              onClick={() => {
                setError(null);
                setSubmitting(false);
                setEvaluating(false);
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="relative">
            <Sparkles className="h-20 w-20 text-purple-500" />
            <Loader2 className="h-9 w-9 text-purple-500 animate-spin absolute -bottom-2 -right-2" />
          </div>
          <div>
            <h2 className="text-4xl font-bold">
              {submitting
                ? "Uploading your recordings..."
                : "Evaluating your speaking..."}
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              {submitting
                ? "Please wait while we upload your audio files."
                : "This usually takes 15-30 seconds. Please wait."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pt-6 px-4 pb-12 md:pt-8 md:px-8">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="min-w-0">{headerLeft}</div>
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground shrink-0">
            <Clock className="h-4 w-4" />
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Part tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {topics.map((topic, idx) => {
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
          <p className="text-lg font-medium leading-relaxed">{currentQuestion}</p>
        </div>

        <VoiceRecorder
          key={currentKey}
          onRecordingComplete={handleRecordingComplete}
          onRecordingCleared={handleRecordingCleared}
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
              Part {topics[currentTopicIndex - 1].partNumber}
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
            <Button onClick={goToNextPart} disabled={isRecording} className="gap-2">
              Continue to Part {topics[currentTopicIndex + 1].partNumber}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allComplete || submitting || evaluating || isRecording}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {submitLabel}
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
        {topics.length} {topics.length === 1 ? "part" : "parts"}
      </div>
    </div>
  );
}
