"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigationProtection } from "@/hooks/use-navigation-protection";
import { Loader2 } from "lucide-react";
import {
  SpeakingTestRunner,
  type SpeakingTopic,
  type UploadedTopic,
} from "@/components/test/speaking/speaking-test-runner";

export default function FullMockSpeakingPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = use(params);
  const router = useRouter();

  const [topics, setTopics] = useState<SpeakingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const abandonAndLeave = useCallback(() => {
    try {
      sessionStorage.removeItem("ielts-test-storage");
    } catch {}
    router.push(`/dashboard/full-mock-test/${testId}`);
  }, [router, testId]);

  useNavigationProtection({
    enabled: topics.length > 0,
    confirmMessage: "If you leave, your recordings will be lost.",
    onBackAttempt: abandonAndLeave,
  });

  // Load topics from the same endpoint the standalone speaking test uses.
  useEffect(() => {
    fetch(`/api/speaking/start-test?testId=${testId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setTopics(data.test?.topics ?? []);
      })
      .catch(() => setError("Failed to load speaking topics"))
      .finally(() => setLoading(false));
  }, [testId]);

  const handleSubmit = async (
    uploadedTopics: UploadedTopic[],
    elapsedSeconds: number,
  ) => {
    // Look up (or create) the full-mock session so this attempt is grouped with LRW.
    const sessionGetRes = await fetch(`/api/full-mock-test/session?testId=${testId}`);
    let { sessionId } = await sessionGetRes.json();
    if (!sessionId) {
      const sessionCreateRes = await fetch("/api/full-mock-test/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      });
      ({ sessionId } = await sessionCreateRes.json());
    }

    const submitRes = await fetch("/api/speaking/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId,
        topics: uploadedTopics.map((t) => ({
          topicId: t.topicId,
          recordings: t.recordings,
        })),
        timeSpentSeconds: elapsedSeconds,
        fullMockAttemptId: sessionId,
      }),
    });
    if (!submitRes.ok) {
      const data = await submitRes.json();
      throw new Error(data.error || "Submit failed");
    }
    const { attemptId } = await submitRes.json();

    const evalRes = await fetch("/api/speaking/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId }),
    });
    if (!evalRes.ok) {
      const data = await evalRes.json();
      throw new Error(data.error || "Evaluation failed");
    }
    const { bandScore: speakingScore } = await evalRes.json();

    if (sessionId) {
      await fetch("/api/full-mock-test/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          speakingScore: speakingScore ?? null,
          complete: true,
        }),
      });
    }

    router.push(`/dashboard/full-mock-test/${testId}/results`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading speaking test...</p>
        </div>
      </div>
    );
  }

  if (error || !topics.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-destructive font-medium">
            {error ?? "No speaking topics available"}
          </p>
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

  return (
    <>
      <SpeakingTestRunner
        topics={topics}
        headerLeft={
          <div>
            <h1 className="text-lg font-bold">Full Mock Test — Speaking</h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Final section · {topics.length} parts
            </p>
          </div>
        }
        onBack={() => setShowExitDialog(true)}
        onSubmit={handleSubmit}
      />

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave the speaking test?</DialogTitle>
            <DialogDescription>
              Your recordings will be lost and your mock test will stay
              incomplete. Nothing is saved until you finish all parts and submit.
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
    </>
  );
}
