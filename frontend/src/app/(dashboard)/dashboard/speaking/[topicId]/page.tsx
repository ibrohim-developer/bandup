"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "@/components/test/speaking/voice-recorder";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";

interface TopicData {
  documentId: string;
  topic: string;
  partNumber: number;
  preparationTime: number;
  speakingTime: number;
  questions: string[];
  test: { documentId: string; title: string } | null;
}

interface Recording {
  blob: Blob;
  durationSeconds: number;
  audioUrl?: string;
}

export default function SpeakingTestPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [topic, setTopic] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recordings, setRecordings] = useState<Map<number, Recording>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load topic
  useEffect(() => {
    fetch(`/api/speaking/start?topicId=${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTopic(data.topic);
        }
      })
      .catch(() => setError("Failed to load topic"))
      .finally(() => setLoading(false));
  }, [topicId]);

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

  const handleRecordingComplete = useCallback(
    (blob: Blob, durationSeconds: number) => {
      setRecordings((prev) => {
        const next = new Map(prev);
        next.set(currentQuestion, { blob, durationSeconds });
        return next;
      });
    },
    [currentQuestion]
  );

  const allRecorded =
    topic !== null && recordings.size === topic.questions.length;

  const handleSubmit = async () => {
    if (!topic || !allRecorded) return;
    setSubmitting(true);
    setError(null);

    try {
      // 1. Upload all audio files
      const uploadedRecordings: {
        questionIndex: number;
        audioUrl: string;
        durationSeconds: number;
      }[] = [];

      for (const [idx, rec] of recordings) {
        const formData = new FormData();
        formData.append("file", rec.blob, `speaking-q${idx + 1}.webm`);

        const uploadRes = await fetch("/api/speaking/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error(`Failed to upload recording for question ${idx + 1}`);
        }

        const uploadData = await uploadRes.json();
        uploadedRecordings.push({
          questionIndex: idx,
          audioUrl: uploadData.url,
          durationSeconds: rec.durationSeconds,
        });
      }

      // 2. Submit
      const submitRes = await fetch("/api/speaking/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: topic.documentId,
          recordings: uploadedRecordings,
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
      router.push(`/dashboard/results/${attemptId}`);
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

  if (error && !topic) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!topic) return null;

  const questions = topic.questions;
  const question = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-black text-xs tracking-widest uppercase">
              Part {topic.partNumber}
            </span>
            {topic.test && (
              <span className="ml-3 text-xs text-muted-foreground font-medium">
                {topic.test.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(elapsed)}
          </div>
        </div>
        <h1 className="text-xl font-bold">{topic.topic}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          <MessageSquare className="h-4 w-4 inline mr-1" />
          {questions.length} questions — Record your answer for each question
        </p>
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          {recordings.has(currentQuestion) && (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
              <CheckCircle className="h-4 w-4" />
              Recorded
            </span>
          )}
        </div>

        <p className="text-lg font-medium leading-relaxed">{question}</p>

        <VoiceRecorder
          key={currentQuestion}
          onRecordingComplete={handleRecordingComplete}
          disabled={submitting || evaluating}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((q) => q - 1)}
          disabled={currentQuestion === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={`h-8 w-8 rounded-full text-xs font-bold transition-colors ${
                i === currentQuestion
                  ? "bg-primary text-primary-foreground"
                  : recordings.has(i)
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentQuestion < questions.length - 1 ? (
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((q) => q + 1)}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!allRecorded || submitting || evaluating}
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
                Submit
              </>
            )}
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Progress */}
      <div className="text-center text-xs text-muted-foreground">
        {recordings.size} of {questions.length} questions recorded
      </div>
    </div>
  );
}
