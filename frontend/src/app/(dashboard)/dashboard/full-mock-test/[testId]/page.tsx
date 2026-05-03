import { notFound } from "next/navigation";
import Link from "@/components/no-prefetch-link";
import {
    Headphones,
    BookOpen,
    PenTool,
    Mic,
    Clock,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchFullMockTestDetail } from "./actions";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ testId: string }>;
}) {
    const { testId } = await params;
    const test = await fetchFullMockTestDetail(testId);
    if (!test) return { title: "Test Not Found" };

    return {
        title: `${test.title} — IELTS Full Mock Test`,
        description: `Take a complete IELTS mock test: ${test.listeningQuestions} listening, ${test.readingQuestions} reading questions, ${test.writingTasks} writing tasks, ${test.speakingTopics} speaking parts.`,
    };
}

export default async function FullMockTestDetailPage({
    params,
}: {
    params: Promise<{ testId: string }>;
}) {
    const { testId } = await params;
    const test = await fetchFullMockTestDetail(testId);

    if (!test) notFound();

    return (
        <div className="space-y-8 pb-12">
            {/* Back link */}
            <div>
                <Link href="/dashboard/full-mock-test">
                    <Button
                        variant="ghost"
                        className="gap-2 -ml-3 border border-transparent text-muted-foreground hover:bg-transparent hover:text-foreground hover:border-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <div>
                <div>
                    {/* Title Section */}
                    <div className="mb-10 md:mb-12">
                        <h1 className="mb-3 text-3xl md:text-5xl font-black text-foreground">
                            {test.title}
                        </h1>
                        {test.description && (
                            <p className="mb-5 max-w-3xl text-sm md:text-base text-muted-foreground">
                                {test.description}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                Academic
                            </div>
                            {test.lrwCompleted && test.speakingCompleted && (
                                <>
                                    <Link href={`/dashboard/full-mock-test/${testId}/results`}>
                                        <Button className="gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            View Full Results
                                        </Button>
                                    </Link>
                                    <Link href={`/dashboard/full-mock-test/${testId}/lrw`}>
                                        <Button variant="outline" className="gap-2">
                                            <RotateCcw className="h-4 w-4" />
                                            Retake Full Mock Test
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Section Label */}
                    <div className="mb-6 md:mb-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Choose Your Exam Section
                        </p>
                    </div>

                    {/* Section Cards */}
                    <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
                        {/* LRW Card */}
                        <div className={`bg-card rounded-xl p-6 md:p-8 flex flex-col gap-6 transition-colors ${test.lrwCompleted ? "border-2 border-green-500/40 bg-green-500/5" : "border border-border"}`}>
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                                        Listening, Reading & Writing
                                    </h3>
                                    {test.lrwCompleted && (
                                        <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-600 dark:text-green-400 shrink-0">
                                            <CheckCircle className="h-4 w-4" />
                                            Completed
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Complete the Listening, Reading, and Writing modules sequentially,
                                    just like the real IELTS exam.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-muted p-2">
                                            <Headphones className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Listening</p>
                                            <p className="text-xs text-muted-foreground">
                                                {test.listeningSections} sections · {test.listeningQuestions} questions
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-foreground">30m</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-muted p-2">
                                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Reading</p>
                                            <p className="text-xs text-muted-foreground">
                                                {test.readingPassages} passages · {test.readingQuestions} questions
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-foreground">60m</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-muted p-2">
                                            <PenTool className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Writing</p>
                                            <p className="text-xs text-muted-foreground">
                                                {test.writingTasks} tasks
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-foreground">60m</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-border pt-5">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Duration</p>
                                    <p className="text-xl font-bold text-foreground">~2h 30min</p>
                                </div>
                                {test.lrwCompleted ? (
                                    <Button disabled className="gap-2 cursor-not-allowed opacity-70">
                                        <CheckCircle className="h-4 w-4" />
                                        Completed
                                    </Button>
                                ) : (
                                    <Link href={`/dashboard/full-mock-test/${testId}/lrw`}>
                                        <Button className="gap-2">
                                            Start Test
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Speaking Card */}
                        <div className={`bg-card rounded-xl p-6 md:p-8 flex flex-col gap-6 transition-colors ${test.speakingCompleted ? "border-2 border-green-500/40 bg-green-500/5" : "border border-border"}`}>
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                                        Speaking
                                    </h3>
                                    {test.speakingCompleted && (
                                        <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-600 dark:text-green-400 shrink-0">
                                            <CheckCircle className="h-4 w-4" />
                                            Completed
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Practice the Speaking module separately with preparation time and
                                    recorded responses, just like the real IELTS interview.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-muted p-2">
                                            <Mic className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Speaking Interview</p>
                                            <p className="text-xs text-muted-foreground">
                                                {test.speakingTopics} parts
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-foreground">15m</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-border pt-5">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Duration</p>
                                    <p className="text-xl font-bold text-foreground">~15min</p>
                                </div>
                                {test.speakingCompleted ? (
                                    <Button disabled className="gap-2 cursor-not-allowed opacity-70">
                                        <CheckCircle className="h-4 w-4" />
                                        Completed
                                    </Button>
                                ) : (
                                    <Link href={`/dashboard/full-mock-test/${testId}/speaking`}>
                                        <Button className="gap-2">
                                            Start Test
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="mt-12 md:mt-16 rounded-2xl border border-primary/20 bg-primary/5 px-6 md:px-8 py-5 md:py-6">
                        <h3 className="mb-3 font-semibold text-foreground">Test Tips</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-3">
                                <span className="text-primary">•</span>
                                You can pause and resume your test anytime, but the timer continues running
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary">•</span>
                                Complete each section in one sitting for accurate results
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary">•</span>
                                You&apos;ll receive detailed AI feedback on all sections after completion
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
