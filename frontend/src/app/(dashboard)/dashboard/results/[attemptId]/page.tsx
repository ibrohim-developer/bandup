import Link from "@/components/no-prefetch-link";
import { find } from "@/lib/strapi/api";
import { Button } from "@/components/ui/button";
import {
  PenTool,
  CheckCircle,
  ArrowLeft,
  Clock,
  List,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpeakingScoreBreakdown } from "@/components/test/speaking/speaking-score-breakdown";
import { WritingTaskFeedback } from "@/components/test/writing/writing-task-feedback";
import { WritingRecommendations } from "@/components/test/writing/writing-recommendations";
import { AnswerToggle } from "./answer-toggle";
import { EvaluatingBanner } from "./evaluating-banner";
import { FeedbackForm } from "./feedback-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ResultsPageProps {
  params: Promise<{ attemptId: string }>;
}

interface AnswerResult {
  id: string;
  questionNumber: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { attemptId } = await params;

  const attempts = await find("test-attempts", {
    filters: { documentId: { $eq: attemptId } },
    populate: ["test", "user"],
  });

  const attempt = attempts?.[0];
  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  const testDocId = attempt.test?.documentId;
  const testTitle = attempt.test?.title || `${attempt.module_type} Test`;

  const userAnswers = await find("user-answers", {
    filters: { test_attempt: { documentId: { $eq: attemptId } } },
    populate: ["question"],
  });

  // Build a map of answered questions by documentId
  const answeredMap = new Map<string, any>();
  for (const ua of userAnswers ?? []) {
    if (ua.question?.documentId) {
      answeredMap.set(ua.question.documentId, ua);
    }
  }

  // Fetch all questions for this test (via passages or sections)
  let allQuestions: any[] = [];
  if (attempt.module_type === "reading") {
    const passages = await find("reading-passages", {
      filters: { test: { documentId: { $eq: testDocId } } },
      populate: {
        question_groups: { populate: { questions: { sort: ["question_number"] } } },
        questions: { sort: ["question_number"] },
      },
    });
    for (const p of passages ?? []) {
      const grouped = (p.question_groups ?? []).flatMap((g: any) => g.questions ?? []);
      const ungrouped = p.questions ?? [];
      allQuestions.push(...grouped, ...ungrouped);
    }
  } else if (attempt.module_type === "listening") {
    const sections = await find("listening-sections", {
      filters: { test: { documentId: { $eq: testDocId } } },
      populate: { questions: { sort: ["question_number"] } },
    });
    for (const s of sections ?? []) {
      allQuestions.push(...(s.questions ?? []));
    }
  }

  // Deduplicate by documentId
  const seen = new Set<string>();
  allQuestions = allQuestions.filter((q: any) => {
    if (seen.has(q.documentId)) return false;
    seen.add(q.documentId);
    return true;
  });

  // Merge: show all questions, with user answer or "N/A"
  const answerResults: AnswerResult[] = allQuestions
    .map((q: any) => {
      const ua = answeredMap.get(q.documentId);
      return {
        id: ua?.documentId ?? q.documentId,
        questionNumber: q.question_number ?? 0,
        questionText: q.question_text ?? "",
        userAnswer: ua ? (ua.user_answer ?? "") : "N/A",
        correctAnswer: q.correct_answer ?? "",
        isCorrect: ua?.is_correct ?? false,
      };
    })
    .sort((a: AnswerResult, b: AnswerResult) => a.questionNumber - b.questionNumber);

  if (attempt.module_type === "writing") {
    const writingTasks = await find("writing-tasks", {
      filters: { test: { documentId: { $eq: testDocId } } },
      sort: ["task_number"],
    });

    const writingSubmissions = await find("writing-submissions", {
      filters: { test_attempt: { documentId: { $eq: attemptId } } },
      populate: ["writing_task"],
    });

    return (
      <WritingResultsContent
        attempt={{
          id: attempt.documentId,
          test_id: testDocId,
          module_type: attempt.module_type,
          status: attempt.status,
          raw_score: attempt.raw_score,
          band_score: attempt.band_score,
          time_spent_seconds: attempt.time_spent_seconds,
          created_at: attempt.createdAt,
          completed_at: attempt.completed_at,
        }}
        testTitle={testTitle}
        tasks={writingTasks ?? []}
        submissions={(writingSubmissions ?? []).map((s: any) => ({
          ...s,
          id: s.documentId,
          task_id: s.writing_task?.documentId,
        }))}
      />
    );
  }

  return (
    <ResultsContent
      attempt={{
        id: attempt.documentId,
        test_id: testDocId,
        module_type: attempt.module_type,
        status: attempt.status,
        raw_score: attempt.raw_score,
        band_score: attempt.band_score,
        time_spent_seconds: attempt.time_spent_seconds,
        created_at: attempt.createdAt,
        completed_at: attempt.completed_at,
      }}
      testTitle={testTitle}
      answerResults={answerResults}
    />
  );
}

function ResultsContent({ attempt, testTitle, answerResults }: {
  attempt: { id: string; test_id: string; module_type: string; status: string; raw_score: number | null; band_score: number | null; time_spent_seconds: number | null; created_at: string; completed_at: string | null };
  testTitle: string;
  answerResults: AnswerResult[];
}) {
  const rawScore = attempt.raw_score || 0;
  const totalQuestions = answerResults.length || 40;
  const scorePercent = totalQuestions > 0 ? Math.round((rawScore / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 md:px-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-500 rounded-full flex items-center justify-center shrink-0"><CheckCircle className="text-white h-6 w-6 md:h-7 md:w-7" /></div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-none">Test Results</h1>
          </div>
          <p className="text-base md:text-xl font-bold text-muted-foreground mt-2 uppercase">{testTitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link href={`/dashboard/${attempt.module_type}`}><Button variant="outline" className="gap-2 px-5 md:px-8 h-11 md:h-12 rounded-xl font-bold text-sm md:text-md uppercase flex items-center"><List className="h-4 w-4" />View All Tests</Button></Link>
          <Link href={`/dashboard/${attempt.module_type}/${attempt.test_id}`}><Button className="gap-2 px-5 md:px-8 h-11 md:h-12 rounded-xl font-bold text-sm md:text-md uppercase flex items-center"><RotateCcw className="h-4 w-4" />Try Again</Button></Link>
        </div>
      </div>
      <div className="border-1 border-border rounded-xl p-6 md:p-12 mb-12">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <div className="mb-8">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Score</p>
            <p className="text-6xl md:text-8xl font-bold text-primary">{rawScore}/{totalQuestions}</p>
          </div>
          <div className="w-full">
            <div className="relative pt-6 pb-2">
              <div className="absolute top-0 flex flex-col items-center -translate-x-1/2" style={{ left: `${scorePercent}%` }}>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary" />
              </div>
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${scorePercent}%` }} />
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Beginner</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Intermediate</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Advanced</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="review" className="border-1 border-border rounded-xl overflow-hidden mb-12"><AnswerToggle answerResults={answerResults} /></div>
      <FeedbackForm attemptId={attempt.id} />
      {/* <div className="flex flex-col items-center justify-center gap-6 pb-20 pt-4 text-center">
        <p className="text-base md:text-xl font-bold text-muted-foreground uppercase tracking-tight">Support our mission to keep IELTS practice free for everyone.</p>
        <Button size="lg" className="flex items-center gap-3 px-8 md:px-12 py-6 rounded-xl font-bold text-sm tracking-widest uppercase"><Heart className="h-5 w-5" />Donate to Support</Button>
      </div> */}
    </div>
  );
}

function WritingResultsContent({ attempt, testTitle, tasks, submissions }: {
  attempt: { id: string; test_id: string; module_type: string; status: string; raw_score: number | null; band_score: number | null; time_spent_seconds: number | null; created_at: string; completed_at: string | null };
  testTitle: string;
  tasks: any[];
  submissions: any[];
}) {
  if (attempt.status === "evaluating") return <EvaluatingBanner attemptId={attempt.id} />;

  const bandScore = attempt.band_score || 0;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const scoredSubmissions = submissions.filter((s: any) => s.overall_band_score !== null);
  const avg = (field: string) =>
    scoredSubmissions.length > 0
      ? Math.round(
          (scoredSubmissions.reduce((sum: number, s: any) => sum + (s[field] || 0), 0) /
            scoredSubmissions.length) * 2
        ) / 2
      : 0;

  const criteria = [
    { name: "Task Achievement", score: avg("task_achievement_score"), maxScore: 9, description: "How well you address the task requirements" },
    { name: "Coherence & Cohesion", score: avg("coherence_score"), maxScore: 9, description: "Logical flow and organization of ideas" },
    { name: "Lexical Resource", score: avg("lexical_score"), maxScore: 9, description: "Range and accuracy of vocabulary used" },
    { name: "Grammatical Range", score: avg("grammar_score"), maxScore: 9, description: "Variety and correctness of grammatical structures" },
  ];

  const taskItems = tasks.map((task: any) => {
    const sub = submissions.find((s: any) => s.task_id === task.documentId);
    let parsedFeedback = null;
    if (sub?.feedback) {
      try {
        parsedFeedback = typeof sub.feedback === "string" ? JSON.parse(sub.feedback) : sub.feedback;
      } catch { /* */ }
    }
    return {
      taskNumber: task.task_number,
      taskType: task.task_type,
      content: sub?.content || "",
      wordCount: sub?.word_count || 0,
      overallBandScore: sub?.overall_band_score ?? null,
      taskAchievementScore: sub?.task_achievement_score ?? null,
      coherenceScore: sub?.coherence_score ?? null,
      lexicalScore: sub?.lexical_score ?? null,
      grammarScore: sub?.grammar_score ?? null,
      parsedFeedback,
    };
  });

  const allActions: string[] = [];
  for (const sub of submissions) {
    let parsed = null;
    try { parsed = typeof sub.feedback === "string" ? JSON.parse(sub.feedback) : sub.feedback; } catch { /* */ }
    if (parsed?.top_5_actions) allActions.push(...parsed.top_5_actions);
  }
  const uniqueActions = [...new Set(allActions)].slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 md:px-6">
      <Link
        href="/dashboard/writing"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Writing
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
              <PenTool className="text-white h-6 w-6 md:h-7 md:w-7" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-none">
              Test Results
            </h1>
          </div>
          <p className="text-base md:text-lg font-bold text-muted-foreground mt-2 uppercase">{testTitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link href="/dashboard/writing">
            <Button variant="outline" className="gap-2 px-5 md:px-8 h-11 md:h-12 rounded-xl font-bold text-sm md:text-md uppercase flex items-center">
              <List className="h-4 w-4" />View All Tests
            </Button>
          </Link>
          <Link href={`/dashboard/writing/${attempt.test_id}`}>
            <Button className="gap-2 px-5 md:px-8 h-11 md:h-12 rounded-xl font-bold text-sm md:text-md uppercase flex items-center">
              <RotateCcw className="h-4 w-4" />Try Again
            </Button>
          </Link>
        </div>
      </div>

      {/* Score hero */}
      <div className="border border-border rounded-2xl bg-gradient-to-br from-purple-500/5 to-primary/5 px-8 py-12 text-center mb-12">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold text-muted-foreground">Your Overall Score</span>
          </div>
          <div className="mb-4 text-8xl md:text-9xl font-bold text-primary">{bandScore}</div>
          <div className="mb-8 text-xl font-medium text-muted-foreground">/ 9.0 IELTS Band</div>
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
          <TabsTrigger value="feedback">Task Feedback</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">Scoring Criteria Analysis</h2>
          <SpeakingScoreBreakdown criteria={criteria} />
        </TabsContent>

        <TabsContent value="feedback" className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">Task-by-Task Feedback</h2>
          <WritingTaskFeedback tasks={taskItems} />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-8">
          <WritingRecommendations actions={uniqueActions} />
        </TabsContent>
      </Tabs>

      <FeedbackForm attemptId={attempt.id} />
    </div>
  );
}
