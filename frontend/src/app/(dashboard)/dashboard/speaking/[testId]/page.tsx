"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  SpeakingTestRunner,
  type SpeakingTopic,
  type UploadedTopic,
} from "@/components/test/speaking/speaking-test-runner";

interface TestData {
  documentId: string;
  title: string;
  topics: SpeakingTopic[];
}

export default function SpeakingTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [test, setTest] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/speaking/start-test?testId=${testId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setTest(data.test);
      })
      .catch(() => setError("Failed to load test"))
      .finally(() => setLoading(false));
  }, [testId]);

  const handleSubmit = async (topics: UploadedTopic[], elapsedSeconds: number) => {
    if (!test) return;

    const submitRes = await fetch("/api/speaking/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId: test.documentId,
        topics: topics.map((t) => ({ topicId: t.topicId, recordings: t.recordings })),
        timeSpentSeconds: elapsedSeconds,
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

    router.replace(`/dashboard/speaking/result/${attemptId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">{error ?? "Test not available"}</p>
      </div>
    );
  }

  return (
    <SpeakingTestRunner
      topics={test.topics}
      headerLeft={<h1 className="text-lg font-bold truncate">{test.title}</h1>}
      onBack={() => router.push("/dashboard/speaking/questions")}
      onSubmit={handleSubmit}
    />
  );
}
