import { Clock, Headphones, BookOpen, PenTool, Mic, CheckCircle } from "lucide-react";
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
}

export function FullMockTestCard({ test }: { test: FullMockTestItem }) {
    return (
        <div className="bg-card border border-border p-4 md:p-6 rounded-xl flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg md:text-xl font-bold truncate flex-1">
                    {test.title}
                </h3>
                {test.isCompleted && (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 shrink-0">
                        <CheckCircle className="h-4 w-4" />
                        Completed
                    </span>
                )}
            </div>

            {test.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {test.description}
                </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Headphones className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-foreground">{test.listeningQuestions}Q</p>
                        <p className="text-[10px]">Listening</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-foreground">{test.readingQuestions}Q</p>
                        <p className="text-[10px]">Reading</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <div className="w-7 h-7 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                        <PenTool className="h-3.5 w-3.5 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-foreground">{test.writingTasks} Tasks</p>
                        <p className="text-[10px]">Writing</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                        <Mic className="h-3.5 w-3.5 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-foreground">{test.speakingTopics} Parts</p>
                        <p className="text-[10px]">Speaking</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    ~{Math.round(test.duration / 60)}h {test.duration % 60}min
                </span>
                <LoginRequiredLink
                    href={`/dashboard/full-mock-test/${test.id}`}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-black text-xs tracking-widest hover:opacity-90 transition-all uppercase"
                >
                    {test.isCompleted ? "Retake" : "Start Test"}
                </LoginRequiredLink>
            </div>
        </div>
    );
}
