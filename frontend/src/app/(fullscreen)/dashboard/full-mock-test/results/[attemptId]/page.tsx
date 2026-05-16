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
import { ModuleReview } from "../../[testId]/results/module-review";
import { WritingEvalTrigger } from "../../[testId]/results/writing-eval-trigger";
import { SpeakingEvalTrigger } from "../../[testId]/results/speaking-eval-trigger";
import { PremiumUpgradeDialog } from "@/components/premium-upgrade-dialog";
import { FeedbackModal } from "@/components/test/common/feedback-modal";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface AnswerRow {
    id: string;
    questionNumber: number;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

async function fetchLROAnswers(
    attemptId: string,
    testDocId: string,
    moduleType: "listening" | "reading",
): Promise<AnswerRow[]> {
    const userAnswers = await find("user-answers", {
        filters: { test_attempt: { documentId: { $eq: attemptId } } },
        populate: ["question"],
    });
    const answeredMap = new Map<string, any>();
    for (const ua of userAnswers ?? []) {
        if (ua.question?.documentId) answeredMap.set(ua.question.documentId, ua);
    }

    let allQuestions: any[] = [];
    if (moduleType === "reading") {
        const passages = await find("reading-passages", {
            filters: { test: { documentId: { $eq: testDocId } } },
            populate: {
                question_groups: { populate: { questions: { sort: ["question_number"] } } },
                questions: { sort: ["question_number"] },
            },
        });
        for (const p of passages ?? []) {
            const grouped = (p.question_groups ?? []).flatMap((g: any) => g.questions ?? []);
            allQuestions.push(...grouped, ...(p.questions ?? []));
        }
    } else {
        const sections = await find("listening-sections", {
            filters: { test: { documentId: { $eq: testDocId } } },
            populate: { questions: { sort: ["question_number"] } },
        });
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

function rawToBand(raw: number): number {
    if (raw <= 0) return 0;
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

export default async function FullMockResultsByAttemptPage({
    params,
}: {
    params: Promise<{ attemptId: string }>;
}) {
    const { attemptId } = await params;

    const token = await getToken();
    if (!token) notFound();

    const user = await getCurrentUser();
    if (!user) notFound();

    const session = await findOne("full-mock-test-attempts", attemptId, {
        populate: {
            test: { fields: ["title", "description", "documentId"] },
            test_attempts: { populate: "*" },
            user: { fields: ["id"] },
        },
    });

    if (!session) notFound();
    const isAdmin = user.role?.type === "admin" || user.role?.name === "Admin";
    if (!isAdmin && session.user?.id !== user.id) notFound();

    const userAttempts = await find("test-attempts", {
        filters: { user: { id: { $eq: user.id } }, status: { $eq: "completed" } },
        fields: ["id"],
    });
    const attemptCount = userAttempts?.length ?? 0;

    const test = session.test;
    if (!test) notFound();
    const testDocId = test.documentId;

    const attempts = (session.test_attempts ?? []) as any[];
    const byModule: Record<string, any> = {};
    for (const a of attempts) {
        const m = a.module_type;
        if (!byModule[m] || new Date(a.createdAt) > new Date(byModule[m].createdAt)) {
            byModule[m] = a;
        }
    }

    const listeningAttempt = byModule.listening;
    const readingAttempt = byModule.reading;
    const writingAttempt = byModule.writing;
    const speakingAttempt = byModule.speaking;

    const [listeningAnswers, readingAnswers, writingSubmissions, speakingSubmissions] = await Promise.all([
        listeningAttempt
            ? fetchLROAnswers(listeningAttempt.documentId, testDocId, "listening")
            : Promise.resolve([] as AnswerRow[]),
        readingAttempt
            ? fetchLROAnswers(readingAttempt.documentId, testDocId, "reading")
            : Promise.resolve([] as AnswerRow[]),
        writingAttempt
            ? find("writing-submissions", {
                  filters: { test_attempt: { documentId: { $eq: writingAttempt.documentId } } },
                  populate: ["writing_task"],
              })
            : Promise.resolve([] as any[]),
        speakingAttempt
            ? find("speaking-submissions", {
                  filters: { test_attempt: { documentId: { $eq: speakingAttempt.documentId } } },
                  populate: ["speaking_topic"],
                  sort: ["question_index:asc"],
              })
            : Promise.resolve([] as any[]),
    ]);

    const listeningRaw = listeningAttempt?.raw_score ?? 0;
    const readingRaw = readingAttempt?.raw_score ?? 0;
    const listeningBand = rawToBand(listeningRaw);
    const readingBand = rawToBand(readingRaw);
    const writingBand = writingAttempt?.band_score ?? 0;
    const speakingBand = speakingAttempt?.band_score ?? 0;

    // Include a module only once it has been evaluated. A real 0 (e.g. a sub-5-word
    // writing submission) is a valid score and must count toward the average; only
    // skip modules that are still pending/evaluating.
    const bands = [
        { band: listeningBand, evaluated: !!listeningAttempt },
        { band: readingBand, evaluated: !!readingAttempt },
        { band: writingBand, evaluated: writingAttempt?.status === "completed" },
        { band: speakingBand, evaluated: speakingAttempt?.status === "completed" },
    ]
        .filter((m) => m.evaluated)
        .map((m) => m.band);
    const overallBand =
        session.overall_band_score ??
        (bands.length ? Math.round((bands.reduce((a, b) => a + b, 0) / bands.length) * 2) / 2 : 0);

    const isEvaluating =
        writingAttempt?.status === "evaluating" || speakingAttempt?.status === "evaluating";

    const modules = [
        {
            key: "listening",
            label: "Listening",
            icon: Headphones,
            accent: "blue",
            score: listeningBand ? listeningBand.toString() : "0",
            band: listeningBand,
        },
        {
            key: "reading",
            label: "Reading",
            icon: BookOpen,
            accent: "emerald",
            score: readingBand ? readingBand.toString() : "0",
            band: readingBand,
        },
        {
            key: "writing",
            label: "Writing",
            icon: PenTool,
            accent: "purple",
            score: writingBand ? writingBand.toString() : "0",
            band: writingBand,
        },
        {
            key: "speaking",
            label: "Speaking",
            icon: Mic,
            accent: "amber",
            score: speakingBand ? speakingBand.toString() : "0",
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
        <div className="w-full max-w-5xl mx-auto mt-8 px-4 md:px-6 pb-20 min-w-0">
            <Link
                href="/dashboard/full-mock-test/history"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm font-medium"
            >
                <ArrowLeft className="h-4 w-4" /> Back to History
            </Link>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6 md:p-10 mb-8">
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                Full Mock Test Result
                            </p>
                            <h1 className="text-lg sm:text-xl md:text-3xl font-black tracking-tight break-words">
                                {test.title}
                            </h1>
                        </div>
                    </div>
                    <div className="md:ml-auto flex items-center md:gap-6">
                        <div className="text-left md:text-right w-full">
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Overall Band
                            </p>
                            <p className="text-5xl sm:text-6xl md:text-7xl font-black text-primary leading-none mt-1">
                                {overallBand || "—"}
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
                {overallBand > 0 && (
                    <p className="relative mt-4 text-xs text-muted-foreground leading-relaxed">
                        AI scoring is an estimate and may differ from a human examiner by roughly ±0.5 band.
                        Use it as practice feedback, not a final IELTS prediction.
                    </p>
                )}
            </div>

            {writingAttempt?.status === "evaluating" && (
                <WritingEvalTrigger attemptId={writingAttempt.documentId} />
            )}
            {speakingAttempt?.status === "evaluating" && (
                <SpeakingEvalTrigger attemptId={speakingAttempt.documentId} />
            )}

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
                                {m.band > 0 && (
                                    <span className="text-sm text-muted-foreground font-semibold">
                                        Band
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
                    scoreLabel={
                        writingAttempt?.status === "completed"
                            ? `Band ${writingBand}`
                            : "Pending"
                    }
                />
                <ModuleReview
                    title="Speaking"
                    icon="mic"
                    accent="amber"
                    speakingSubmissions={speakingSubmissions ?? []}
                    scoreLabel={
                        speakingAttempt?.status === "completed"
                            ? `Band ${speakingBand}`
                            : "Pending"
                    }
                />
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-end">
                <Link href="/dashboard/full-mock-test">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        View All Tests
                    </Button>
                </Link>
                <PremiumUpgradeDialog
                    trigger={
                        <Button size="lg" className="w-full sm:w-auto gap-2">
                            <RotateCcw className="h-4 w-4" /> Retake
                        </Button>
                    }
                />
            </div>
            <FeedbackModal attemptId={attemptId} attemptCount={attemptCount} />
        </div>
    );
}
