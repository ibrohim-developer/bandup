"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WritingEditor } from "@/components/test/writing/writing-editor";
import { WritingFeedback } from "@/components/test/writing/writing-feedback";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Send,
  RotateCcw,
  Eye,
} from "lucide-react";

type TaskType = "essay" | "report";

interface EvaluationResult {
  attemptId: string;
  evaluation: {
    taskAchievementScore: number;
    coherenceScore: number;
    lexicalScore: number;
    grammarScore: number;
    overallBandScore: number;
    feedback: string;
  };
}

export default function FreeWritePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("essay");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const minWords = taskType === "essay" ? 250 : 150;
  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((w) => w).length;

  const handleSubmit = async () => {
    if (wordCount < minWords) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/writing/free-write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim() || undefined,
          taskType,
          content,
          minWords,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Evaluation failed");
      }

      const data: EvaluationResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTopic("");
    setContent("");
    setResult(null);
    setError(null);
  };

  // Evaluating state
  if (isSubmitting) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <Sparkles className="h-12 w-12 text-purple-500" />
            <Loader2 className="h-6 w-6 text-purple-500 animate-spin absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Evaluating your writing...</h2>
            <p className="text-muted-foreground mt-2">
              This usually takes 15-30 seconds. Please wait.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Results state
  if (result) {
    const { evaluation } = result;
    return (
      <div className="space-y-6 md:space-y-8 pb-12">
        <Link
          href="/dashboard/writing"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Writing Tests
        </Link>

        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-1">
            Free Writing Results
          </h2>
          {topic && (
            <p className="text-sm text-muted-foreground mt-1">
              Topic: {topic}
            </p>
          )}
        </div>

        <div className="border-1 border-border rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <WritingFeedback
              feedback={evaluation.feedback}
              overallBandScore={evaluation.overallBandScore}
              taskAchievementScore={evaluation.taskAchievementScore}
              coherenceScore={evaluation.coherenceScore}
              lexicalScore={evaluation.lexicalScore}
              grammarScore={evaluation.grammarScore}
            />
          </div>
        </div>

        <div className="border-1 border-border rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Your Essay
            </h4>
            <div className="p-4 rounded-lg bg-muted/50 border text-sm whitespace-pre-line max-h-80 overflow-y-auto">
              {content}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="gap-2 px-6 py-5 rounded-xl font-bold text-sm uppercase tracking-widest"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            Write Another
          </Button>
          <Button
            className="gap-2 px-6 py-5 rounded-xl font-bold text-sm uppercase tracking-widest"
            onClick={() =>
              router.push(`/dashboard/results/${result.attemptId}`)
            }
          >
            <Eye className="h-4 w-4" />
            View Full Results
          </Button>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <Link
        href="/dashboard/writing"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Writing Tests
      </Link>

      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-1">
          Free Writing Practice
        </h2>
        <p className="text-sm text-muted-foreground">
          Write on any topic you choose and get instant AI feedback
        </p>
      </div>

      {/* Topic Input */}
      <div className="border-1 border-border rounded-xl p-5 md:p-6 space-y-4">
        <div>
          <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Topic (Optional)
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic or question, or leave blank for general practice..."
            rows={2}
            className="w-full mt-2 rounded-lg border border-border bg-background p-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Task Type Toggle */}
        <div>
          <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Task Type
          </label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setTaskType("essay")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                taskType === "essay"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Essay (Task 2) — min {250} words
            </button>
            <button
              onClick={() => setTaskType("report")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                taskType === "report"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Report (Task 1) — min {150} words
            </button>
          </div>
        </div>
      </div>

      {/* Essay Editor */}
      <div className="border-1 border-border rounded-xl p-5 md:p-6">
        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
          Your Essay
        </label>
        <WritingEditor
          value={content}
          onChange={setContent}
          minWords={minWords}
          placeholder="Start writing your essay here..."
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={wordCount < minWords}
          className="gap-2 px-8 py-5 rounded-xl font-bold text-sm uppercase tracking-widest"
        >
          <Send className="h-4 w-4" />
          Submit for Evaluation
        </Button>
      </div>
    </div>
  );
}
