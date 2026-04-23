import { Clock, Headphones, BookOpen, PenTool, Mic, CheckCircle, ArrowRight } from "lucide-react";
import { LoginRequiredLink } from "@/components/auth/login-required-link";

export interface FullMockTestItem {
    id: string;
    title: string;
    description: string;
    listeningQuestions: number;
    listeningSections: number;
    readingQuestions: number;
    readingPassages: number;
    writingTasks: number;
    speakingTopics: number;
    duration: number;
    isCompleted: boolean;
    isLocked: boolean;
}

export function FullMockTestCard({ test }: { test: FullMockTestItem }) {
    return (
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            Academic
                        </span>
                        {test.isCompleted && (
                            <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Completed
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground leading-snug">
                        {test.title}
                    </h3>
                    {test.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {test.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Module Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                    <div className="rounded-md bg-muted p-1.5">
                        <Headphones className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-foreground">Listening</p>
                        <p className="text-[10px] text-muted-foreground">{test.listeningQuestions} questions</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                    <div className="rounded-md bg-muted p-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-foreground">Reading</p>
                        <p className="text-[10px] text-muted-foreground">{test.readingQuestions} questions</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                    <div className="rounded-md bg-muted p-1.5">
                        <PenTool className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-foreground">Writing</p>
                        <p className="text-[10px] text-muted-foreground">{test.writingTasks} tasks</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                    <div className="rounded-md bg-muted p-1.5">
                        <Mic className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-foreground">Speaking</p>
                        <p className="text-[10px] text-muted-foreground">{test.speakingTopics} parts</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/30 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    ~{Math.round(test.duration / 60)}h {test.duration % 60}min
                </div>
                <LoginRequiredLink
                    href={`/dashboard/full-mock-test/${test.id}`}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all"
                >
                    {test.isCompleted ? "Retake" : "Start Test"}
                    <ArrowRight className="h-4 w-4" />
                </LoginRequiredLink>
            </div>
        </div>
    );
}
