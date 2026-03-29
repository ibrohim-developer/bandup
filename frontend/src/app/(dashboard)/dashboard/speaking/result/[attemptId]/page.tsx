import Link from "next/link";
import { find } from "@/lib/strapi/api";
import { Button } from "@/components/ui/button";
import {
  Mic,
  ArrowLeft,
  CheckCircle,
  List,
  RotateCcw,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpeakingScoreBreakdown } from "@/components/test/speaking/speaking-score-breakdown";
import { SpeakingQuestionFeedback } from "@/components/test/speaking/speaking-question-feedback";
import { SpeakingRecommendations } from "@/components/test/speaking/speaking-recommendations";
import { SpeakingEvaluatingBanner } from "./evaluating-banner";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ResultsPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function SpeakingResultPage({
  params,
}: ResultsPageProps) {
  const { attemptId } = await params;

  const attempts = await find("test-attempts", {
    filters: { documentId: { $eq: attemptId } },
    populate: ["test", "user"],
  });

  const attempt = attempts?.[0];
  if (!attempt) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-destructive font-medium">
            Test attempt not found.
          </p>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (attempt.status === "evaluating") {
    return <SpeakingEvaluatingBanner attemptId={attemptId} />;
  }

  const submissions = await find("speaking-submissions", {
    filters: { test_attempt: { documentId: { $eq: attemptId } } },
    populate: ["speaking_topic"],
    sort: ["question_index:asc"],
  });

  const testTitle = attempt.test?.title || "Speaking Practice";
  const bandScore = attempt.band_score ?? 0;

  // Build scored submissions
  const scoredSubs = (submissions || []).filter(
    (s: any) => s.overall_band_score !== null
  );

  // Average criteria scores
  const avg = (field: string) =>
    scoredSubs.length > 0
      ? Math.round(
          (scoredSubs.reduce((sum: number, s: any) => sum + (s[field] || 0), 0) /
            scoredSubs.length) *
            2
        ) / 2
      : 0;

  const criteria = [
    {
      name: "Fluency & Coherence",
      score: avg("fluency_score"),
      maxScore: 9,
      description:
        "Your ability to speak naturally and connect ideas smoothly",
    },
    {
      name: "Lexical Resource",
      score: avg("lexical_score"),
      maxScore: 9,
      description: "Range and accuracy of vocabulary used in speech",
    },
    {
      name: "Grammatical Range",
      score: avg("grammar_score"),
      maxScore: 9,
      description: "Variety and correctness of grammatical structures",
    },
    {
      name: "Pronunciation",
      score: avg("pronunciation_score"),
      maxScore: 9,
      description: "Clarity and intelligibility of your speech",
    },
  ];

  // Map submissions for question feedback
  const feedbackSubmissions = (submissions || []).map((s: any) => {
    const topic = s.speaking_topic;
    const questions = Array.isArray(topic?.questions) ? topic.questions : [];
    let parsedFeedback = null;
    if (s.feedback) {
      try {
        parsedFeedback =
          typeof s.feedback === "string" ? JSON.parse(s.feedback) : s.feedback;
      } catch {
        parsedFeedback = null;
      }
    }
    return {
      questionIndex: s.question_index,
      questionText:
        questions[s.question_index] || `Question ${s.question_index + 1}`,
      transcript: s.transcript,
      overallBandScore: s.overall_band_score,
      fluencyScore: s.fluency_score,
      lexicalScore: s.lexical_score,
      grammarScore: s.grammar_score,
      pronunciationScore: s.pronunciation_score,
      durationSeconds: s.duration_seconds,
      feedback: parsedFeedback,
    };
  });

  // Get topic info from first submission
  const firstTopic = submissions?.[0]?.speaking_topic;
  const topicName = firstTopic?.topic || "Speaking";
  const partNumber = firstTopic?.part_number || 1;

  // Aggregate top 5 actions from all submissions
  const allActions: string[] = [];
  for (const sub of feedbackSubmissions) {
    if (sub.feedback?.top_5_actions) {
      allActions.push(...sub.feedback.top_5_actions);
    }
  }
  // Deduplicate and take top 5
  const uniqueActions = [...new Set(allActions)].slice(0, 5);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 md:px-6">
      {/* Back */}
      <Link
        href="/dashboard/speaking"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Speaking
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
              <Mic className="text-white h-6 w-6 md:h-7 md:w-7" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-none">
              Test Results
            </h1>
          </div>
          <p className="text-base md:text-lg font-bold text-muted-foreground mt-2 uppercase">
            {testTitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link href="/dashboard/speaking/questions">
            <Button
              variant="outline"
              className="gap-2 px-5 md:px-8 h-11 md:h-12 rounded-xl font-bold text-sm md:text-md uppercase flex items-center"
            >
              <List className="h-4 w-4" />
              All Topics
            </Button>
          </Link>
          {firstTopic?.documentId && (
            <Link href={`/dashboard/speaking/${firstTopic.documentId}`}>
              <Button className="gap-2 px-5 md:px-8 h-11 md:h-12 rounded-xl font-bold text-sm md:text-md uppercase flex items-center">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Score hero */}
      <div className="border border-border rounded-2xl bg-gradient-to-br from-orange-500/5 to-primary/5 px-8 py-12 text-center mb-12">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold text-muted-foreground">
              Your Overall Score
            </span>
          </div>
          <div className="mb-4 text-8xl md:text-9xl font-bold text-primary">
            {bandScore}
          </div>
          <div className="mb-8 text-xl font-medium text-muted-foreground">
            / 9.0 IELTS Band
          </div>
          {attempt.time_spent_seconds && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2 text-sm font-medium text-primary">
              <Clock className="h-4 w-4" />
              Duration: {formatTime(attempt.time_spent_seconds)}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="breakdown" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="feedback">Question Feedback</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">
            Scoring Criteria Analysis
          </h2>
          <SpeakingScoreBreakdown criteria={criteria} />
        </TabsContent>

        <TabsContent value="feedback" className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">Question-by-Question Feedback</h2>
          <SpeakingQuestionFeedback
            submissions={feedbackSubmissions}
            topicName={topicName}
            partNumber={partNumber}
          />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-8">
          <SpeakingRecommendations actions={uniqueActions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
