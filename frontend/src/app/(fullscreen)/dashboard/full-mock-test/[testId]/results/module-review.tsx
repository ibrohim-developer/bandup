"use client";

import { useState } from "react";
import {
    Headphones,
    BookOpen,
    PenTool,
    Mic,
    ChevronDown,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WritingFeedback } from "@/components/test/writing/writing-feedback";
import { SpeakingQuestionFeedback } from "@/components/test/speaking/speaking-question-feedback";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface AnswerRow {
    id: string;
    questionNumber: number;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

interface ModuleReviewProps {
    title: string;
    icon: "headphones" | "book" | "pen" | "mic";
    accent: "blue" | "emerald" | "purple" | "amber";
    scoreLabel: string;
    answers?: AnswerRow[];
    writingTasks?: any[];
    speakingSubmissions?: any[];
}

const ICONS = {
    headphones: Headphones,
    book: BookOpen,
    pen: PenTool,
    mic: Mic,
};

const ACCENT: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" },
};

export function ModuleReview({
    title,
    icon,
    accent,
    scoreLabel,
    answers,
    writingTasks,
    speakingSubmissions,
}: ModuleReviewProps) {
    const [open, setOpen] = useState(false);
    const [showCorrect, setShowCorrect] = useState(false);
    const Icon = ICONS[icon];
    const cls = ACCENT[accent];

    return (
        <div className="rounded-xl border border-border overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-4 px-5 md:px-6 py-4 hover:bg-muted/30 transition-colors"
            >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", cls.bg)}>
                    <Icon className={cn("h-5 w-5", cls.text)} />
                </div>
                <div className="flex-1 text-left">
                    <h3 className="font-bold text-base md:text-lg">{title}</h3>
                    <p className="text-sm text-muted-foreground">{scoreLabel}</p>
                </div>
                <ChevronDown
                    className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        open && "rotate-180",
                    )}
                />
            </button>

            {open && (
                <div className="border-t border-border">
                    {answers && <AnswersTable answers={answers} showCorrect={showCorrect} setShowCorrect={setShowCorrect} />}
                    {writingTasks && <WritingReview tasks={writingTasks} />}
                    {speakingSubmissions && <SpeakingReview submissions={speakingSubmissions} />}
                </div>
            )}
        </div>
    );
}

function AnswersTable({
    answers,
    showCorrect,
    setShowCorrect,
}: {
    answers: AnswerRow[];
    showCorrect: boolean;
    setShowCorrect: (v: boolean) => void;
}) {
    return (
        <>
            <div className="flex items-center justify-between px-5 md:px-6 py-3 bg-muted/20 border-b border-border">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Answer Review
                </span>
                <button
                    onClick={() => setShowCorrect(!showCorrect)}
                    className="flex items-center gap-2 text-xs font-semibold"
                >
                    <span className="text-muted-foreground">Show correct answers</span>
                    <span
                        className={cn(
                            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                            showCorrect ? "bg-primary" : "bg-muted-foreground/30",
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
                                showCorrect ? "translate-x-5" : "translate-x-1",
                            )}
                        />
                    </span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                            <th className="px-5 md:px-6 py-3 text-left font-bold w-16">#</th>
                            <th className="px-4 py-3 text-left font-bold">Your Answer</th>
                            <th className="px-4 py-3 text-left font-bold">Correct</th>
                            <th className="px-5 md:px-6 py-3 text-right font-bold w-20">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {answers.map((a) => {
                            const isNA = a.userAnswer === "N/A";
                            return (
                                <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 md:px-6 py-3 font-bold">{a.questionNumber}</td>
                                    <td
                                        className={cn(
                                            "px-4 py-3 font-semibold",
                                            isNA ? "text-muted-foreground" : a.isCorrect ? "text-green-600" : "text-red-500",
                                        )}
                                    >
                                        {a.userAnswer}
                                    </td>
                                    <td
                                        className={cn(
                                            "px-4 py-3 font-semibold text-green-600 transition-all",
                                            !showCorrect && "blur-sm select-none opacity-40",
                                        )}
                                    >
                                        {a.correctAnswer}
                                    </td>
                                    <td className="px-5 md:px-6 py-3 text-right">
                                        {isNA ? (
                                            <span className="text-xs font-bold text-muted-foreground">N/A</span>
                                        ) : a.isCorrect ? (
                                            <CheckCircle2 className="inline-block h-5 w-5 text-green-600" />
                                        ) : (
                                            <XCircle className="inline-block h-5 w-5 text-red-500" />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function WritingReview({ tasks }: { tasks: any[] }) {
    if (!tasks.length) {
        return (
            <div className="p-6 text-sm text-muted-foreground">
                Writing submissions are not available.
            </div>
        );
    }
    return (
        <div className="divide-y divide-border">
            {tasks.map((t) => (
                <div key={t.id} className="p-5 md:p-6 space-y-4">
                    <div>
                        <h4 className="font-bold">
                            Task {t.writing_task?.task_number} — {t.writing_task?.task_type === "report" ? "Report" : "Essay"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {t.word_count} words
                            {t.overall_band_score !== null && ` · Band ${t.overall_band_score}`}
                        </p>
                    </div>
                    {t.feedback && (
                        <WritingFeedback
                            feedback={t.feedback}
                            overallBandScore={t.overall_band_score}
                            taskAchievementScore={t.task_achievement_score}
                            coherenceScore={t.coherence_score}
                            lexicalScore={t.lexical_score}
                            grammarScore={t.grammar_score}
                        />
                    )}
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Your Essay</h5>
                        <div className="p-4 rounded-lg bg-muted/30 border text-sm whitespace-pre-line max-h-60 overflow-y-auto">
                            {t.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SpeakingReview({ submissions }: { submissions: any[] }) {
    if (!submissions.length) {
        return (
            <div className="p-6 text-sm text-muted-foreground">
                Speaking submissions are not available.
            </div>
        );
    }

    // Group by topic so each part gets its own SpeakingQuestionFeedback block.
    // submissions are already sorted by question_index from the server query.
    const groups = new Map<string, { topic: any; subs: any[] }>();
    for (const s of submissions) {
        const topicId = s.speaking_topic?.documentId ?? `unknown-${s.documentId}`;
        if (!groups.has(topicId)) {
            groups.set(topicId, { topic: s.speaking_topic, subs: [] });
        }
        groups.get(topicId)!.subs.push(s);
    }

    const ordered = Array.from(groups.values()).sort(
        (a, b) => (a.topic?.part_number ?? 0) - (b.topic?.part_number ?? 0),
    );

    return (
        <div className="p-5 md:p-6 space-y-8">
            {ordered.map(({ topic, subs }, groupIdx) => {
                const questions = Array.isArray(topic?.questions) ? topic.questions : [];
                const mapped = subs.map((s) => {
                    let feedback: any = null;
                    if (s.feedback) {
                        if (typeof s.feedback === "string") {
                            try {
                                feedback = JSON.parse(s.feedback);
                            } catch {
                                feedback = null;
                            }
                        } else {
                            feedback = s.feedback;
                        }
                    }
                    return {
                        questionIndex: s.question_index ?? 0,
                        questionText:
                            questions[s.question_index] ??
                            `Question ${(s.question_index ?? 0) + 1}`,
                        transcript: s.transcript ?? null,
                        overallBandScore: s.overall_band_score ?? null,
                        fluencyScore: s.fluency_score ?? null,
                        lexicalScore: s.lexical_score ?? null,
                        grammarScore: s.grammar_score ?? null,
                        pronunciationScore: s.pronunciation_score ?? null,
                        durationSeconds: s.duration_seconds ?? null,
                        feedback,
                    };
                });

                return (
                    <SpeakingQuestionFeedback
                        key={topic?.documentId ?? topic?.id ?? `group-${groupIdx}`}
                        submissions={mapped}
                        topicName={topic?.topic ?? ""}
                        partNumber={topic?.part_number ?? 1}
                    />
                );
            })}
        </div>
    );
}
