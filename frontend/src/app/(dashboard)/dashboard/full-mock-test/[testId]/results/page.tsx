import Link from "@/components/no-prefetch-link";
import { notFound } from "next/navigation";
import { find, findOne } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";
import { Button } from "@/components/ui/button";
import {
    Headphones,
    BookOpen,
    PenTool,
    Mic,
    ArrowLeft,
    RotateCcw,
    Sparkles,
    Trophy,
} from "lucide-react";
import { ModuleReview } from "./module-review";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface AnswerRow {
    id: string;
    questionNumber: number;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

// Must use admin token: Strapi 5 rejects `user` as a filter key with user JWT (ValidationError).
async function latestSessionAttempts(userId: number, testDocId: string, _token: string) {
    const sessions = await find(
        "full-mock-test-attempts",
        {
            filters: {
                user: { id: { $eq: userId } },
                test: { documentId: { $eq: testDocId } },
            },
            sort: ["createdAt:desc"],
            pagination: { pageSize: 1 },
            populate: { test_attempts: { populate: "*" } },
        },
    );
    const session = sessions?.[0];
    const attempts = (session?.test_attempts ?? []) as any[];
    const byModule: Record<string, any> = {};
    for (const a of attempts) {
        const m = a.module_type;
        if (!byModule[m] || new Date(a.createdAt) > new Date(byModule[m].createdAt)) {
            byModule[m] = a;
        }
    }
    return byModule;
}

async function fetchLROAnswers(attemptId: string, testDocId: string, moduleType: "listening" | "reading", _token: string): Promise<AnswerRow[]> {
    const userAnswers = await find(
        "user-answers",
        {
            filters: { test_attempt: { documentId: { $eq: attemptId } } },
            populate: ["question"],
        },
    );
    const answeredMap = new Map<string, any>();
    for (const ua of userAnswers ?? []) {
        if (ua.question?.documentId) answeredMap.set(ua.question.documentId, ua);
    }

    let allQuestions: any[] = [];
    if (moduleType === "reading") {
        const passages = await find(
            "reading-passages",
            {
                filters: { test: { documentId: { $eq: testDocId } } },
                populate: {
                    question_groups: { populate: { questions: { sort: ["question_number"] } } },
                    questions: { sort: ["question_number"] },
                },
            },
        );
        for (const p of passages ?? []) {
            const grouped = (p.question_groups ?? []).flatMap((g: any) => g.questions ?? []);
            allQuestions.push(...grouped, ...(p.questions ?? []));
        }
    } else {
        const sections = await find(
            "listening-sections",
            {
                filters: { test: { documentId: { $eq: testDocId } } },
                populate: { questions: { sort: ["question_number"] } },
            },
        );
        for (const s of sections ?? []) allQuestions.push(...(s.questions ?? []));
    }

    const seen = new Set<string>();
    allQuestions = allQuestions.filter((q: any) => {
        if (seen.has(q.documentId)) return false;
        seen.add(q.documentId);
        return true;
    });

    return allQuestions
        .map((q: any) => {
            const ua = answeredMap.get(q.documentId);
            return {
                id: ua?.documentId ?? q.documentId,
                questionNumber: q.question_number ?? 0,
                userAnswer: ua ? (ua.user_answer ?? "") : "N/A",
                correctAnswer: q.correct_answer ?? "",
                isCorrect: ua?.is_correct ?? false,
            };
        })
        .sort((a, b) => a.questionNumber - b.questionNumber);
}

// Convert listening/reading raw score (out of 40) to IELTS band (approx)
function rawToBand(raw: number): number {
    if (raw >= 39) return 9;
    if (raw >= 37) return 8.5;
    if (raw >= 35) return 8;
    if (raw >= 33) return 7.5;
    if (raw >= 30) return 7;
    if (raw >= 27) return 6.5;
    if (raw >= 23) return 6;
    if (raw >= 20) return 5.5;
    if (raw >= 16) return 5;
    if (raw >= 13) return 4.5;
    if (raw >= 10) return 4;
    if (raw >= 6) return 3.5;
    if (raw >= 4) return 3;
    return 2.5;
}

function bandDescriptor(band: number): string {
    if (band >= 8.5) return "Expert User";
    if (band >= 7.5) return "Very Good User";
    if (band >= 6.5) return "Competent User";
    if (band >= 5.5) return "Modest User";
    if (band >= 4.5) return "Limited User";
    return "Extremely Limited User";
}

export default async function FullMockResultsPage({
    params,
}: {
    params: Promise<{ testId: string }>;
}) {
    const { testId } = await params;

    const token = await getToken();
    if (!token) notFound();

    const user = await getCurrentUser();
    if (!user) notFound();

    const test = await findOne("tests", testId, { fields: ["title", "description"] });
    if (!test) notFound();

    const byModule = await latestSessionAttempts(user.id, testId, token);
    const listeningAttempt = byModule.listening;
    const readingAttempt = byModule.reading;
    const writingAttempt = byModule.writing;
    const speakingAttempt = byModule.speaking;

    if (!listeningAttempt || !readingAttempt || !writingAttempt || !speakingAttempt) {
        notFound();
    }

    const [listeningAnswers, readingAnswers, writingSubmissions, speakingSubmissions] = await Promise.all([
        fetchLROAnswers(listeningAttempt.documentId, testId, "listening", token),
        fetchLROAnswers(readingAttempt.documentId, testId, "reading", token),
        find(
            "writing-submissions",
            {
                filters: { test_attempt: { documentId: { $eq: writingAttempt.documentId } } },
                populate: ["writing_task"],
            },
        ),
        find(
            "speaking-submissions",
            {
                filters: { test_attempt: { documentId: { $eq: speakingAttempt.documentId } } },
                populate: ["speaking_topic"],
                sort: ["question_index:asc"],
            },
        ),
    ]);

    const listeningRaw = listeningAttempt.raw_score ?? 0;
    const readingRaw = readingAttempt.raw_score ?? 0;
    const listeningBand = rawToBand(listeningRaw);
    const readingBand = rawToBand(readingRaw);
    const writingBand = writingAttempt.band_score ?? 0;
    const speakingBand = speakingAttempt.band_score ?? 0;

    const bands = [listeningBand, readingBand, writingBand, speakingBand].filter((b) => b > 0);
    const overallBand = bands.length
        ? Math.round((bands.reduce((a, b) => a + b, 0) / bands.length) * 2) / 2
        : 0;

    const isEvaluating = writingAttempt.status === "evaluating" || speakingAttempt.status === "evaluating";

    const modules = [
        {
            key: "listening",
            label: "Listening",
            icon: Headphones,
            accent: "blue",
            score: `${listeningRaw}/40`,
            band: listeningBand,
        },
        {
            key: "reading",
            label: "Reading",
            icon: BookOpen,
            accent: "emerald",
            score: `${readingRaw}/40`,
            band: readingBand,
        },
        {
            key: "writing",
            label: "Writing",
            icon: PenTool,
            accent: "purple",
            score: writingBand ? writingBand.toString() : "—",
            band: writingBand,
        },
        {
            key: "speaking",
            label: "Speaking",
            icon: Mic,
            accent: "amber",
            score: speakingBand ? speakingBand.toString() : "—",
            band: speakingBand,
        },
    ] as const;

    const accentClasses: Record<string, { bg: string; ring: string; text: string; bar: string }> = {
        blue: { bg: "bg-blue-500/10", ring: "ring-blue-500/30", text: "text-blue-500", bar: "bg-blue-500" },
        emerald: { bg: "bg-emerald-500/10", ring: "ring-emerald-500/30", text: "text-emerald-500", bar: "bg-emerald-500" },
        purple: { bg: "bg-purple-500/10", ring: "ring-purple-500/30", text: "text-purple-500", bar: "bg-purple-500" },
        amber: { bg: "bg-amber-500/10", ring: "ring-amber-500/30", text: "text-amber-500", bar: "bg-amber-500" },
    };

    const mappedWriting = (writingSubmissions ?? []).map((s: any) => ({
        ...s,
        id: s.documentId,
        task_id: s.writing_task?.documentId,
    }));

    return (
        <div className="max-w-5xl mx-auto mt-8 px-4 md:px-6 pb-20">
            <Link
                href={`/dashboard/full-mock-test/${testId}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm font-medium"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Test
            </Link>

            {/* Hero overall score */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-10 mb-8">
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                            <Trophy className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                Full Mock Test Complete
                            </p>
                            <h1 className="text-xl md:text-3xl font-black tracking-tight">{test.title}</h1>
                        </div>
                    </div>
                    <div className="md:ml-auto flex items-center gap-4 md:gap-6">
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Overall Band
                            </p>
                            <p className="text-6xl md:text-7xl font-black text-primary leading-none">
                                {overallBand || "—"}
                            </p>
                            <p className="text-sm font-semibold text-muted-foreground mt-1">
                                {overallBand ? bandDescriptor(overallBand) : "Pending"}
                            </p>
                        </div>
                    </div>
                </div>
                {isEvaluating && (
                    <div className="relative mt-6 flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
                        <Sparkles className="h-4 w-4" />
                        AI evaluation is still in progress — scores may update shortly.
                    </div>
                )}
            </div>

            {/* Module band bars */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                {modules.map((m) => {
                    const Icon = m.icon;
                    const cls = accentClasses[m.accent];
                    const pct = m.band ? (m.band / 9) * 100 : 0;
                    return (
                        <div key={m.key} className="rounded-xl border border-border p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-9 h-9 rounded-lg ${cls.bg} flex items-center justify-center`}>
                                    <Icon className={`h-4 w-4 ${cls.text}`} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    {m.label}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-3xl font-black">{m.score}</span>
                                {m.band > 0 && (m.key === "listening" || m.key === "reading") && (
                                    <span className="text-sm text-muted-foreground font-semibold">
                                        Band {m.band}
                                    </span>
                                )}
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${cls.bar} transition-all duration-700`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Collapsible per-module reviews */}
            <div className="space-y-4">
                <ModuleReview
                    title="Listening"
                    icon="headphones"
                    accent="blue"
                    answers={listeningAnswers}
                    scoreLabel={`${listeningRaw}/40 · Band ${listeningBand}`}
                />
                <ModuleReview
                    title="Reading"
                    icon="book"
                    accent="emerald"
                    answers={readingAnswers}
                    scoreLabel={`${readingRaw}/40 · Band ${readingBand}`}
                />
                <ModuleReview
                    title="Writing"
                    icon="pen"
                    accent="purple"
                    writingTasks={mappedWriting}
                    scoreLabel={writingBand ? `Band ${writingBand}` : "Pending"}
                />
                <ModuleReview
                    title="Speaking"
                    icon="mic"
                    accent="amber"
                    speakingSubmissions={speakingSubmissions ?? []}
                    scoreLabel={speakingBand ? `Band ${speakingBand}` : "Pending"}
                />
            </div>

            {/* Footer actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-end">
                <Link href="/dashboard/full-mock-test">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        View All Tests
                    </Button>
                </Link>
                <Link href={`/dashboard/full-mock-test/${testId}`}>
                    <Button size="lg" className="w-full sm:w-auto gap-2">
                        <RotateCcw className="h-4 w-4" /> Retake
                    </Button>
                </Link>
            </div>
        </div>
    );
}
