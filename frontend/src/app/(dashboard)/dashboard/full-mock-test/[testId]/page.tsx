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
} from "lucide-react";
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
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard/full-mock-test"
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>
            </div>

            <div>
                <h2 className="text-2xl md:text-3xl font-black mb-1">{test.title}</h2>
                {test.description && (
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        {test.description}
                    </p>
                )}
            </div>

            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                Choose your exam section
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LRW Exam Card */}
                <Link
                    href={`/dashboard/full-mock-test/${testId}/lrw`}
                    className="bg-card border border-border p-6 md:p-8 rounded-xl flex flex-col gap-5 hover:border-primary/50 transition-colors group"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg md:text-xl font-bold">
                            Listening, Reading & Writing
                        </h3>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Complete the Listening, Reading, and Writing modules sequentially,
                        just like the real IELTS exam.
                    </p>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Headphones className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Listening</p>
                                <p className="text-xs text-muted-foreground">
                                    {test.listeningSections} sections · {test.listeningQuestions}{" "}
                                    questions · 30 min
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <BookOpen className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Reading</p>
                                <p className="text-xs text-muted-foreground">
                                    {test.readingPassages} passages · {test.readingQuestions}{" "}
                                    questions · 60 min
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                <PenTool className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Writing</p>
                                <p className="text-xs text-muted-foreground">
                                    {test.writingTasks} tasks · 60 min
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground pt-1">
                        <Clock className="h-3.5 w-3.5" />
                        ~2h 30min total
                    </div>
                </Link>

                {/* Speaking Exam Card */}
                <Link
                    href={`/dashboard/full-mock-test/${testId}/speaking`}
                    className="bg-card border border-border p-6 md:p-8 rounded-xl flex flex-col gap-5 hover:border-primary/50 transition-colors group"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg md:text-xl font-bold">Speaking</h3>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Practice the Speaking module separately with preparation time and
                        recorded responses, just like the real IELTS interview.
                    </p>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                <Mic className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Speaking Interview</p>
                                <p className="text-xs text-muted-foreground">
                                    {test.speakingTopics} parts · ~15 min
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground pt-1">
                        <Clock className="h-3.5 w-3.5" />
                        ~15min total
                    </div>
                </Link>
            </div>
        </div>
    );
}
