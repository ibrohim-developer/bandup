"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { VoiceRecorder } from "@/components/test/speaking/voice-recorder";
import {
    Loader2,
    ChevronLeft,
    ChevronRight,
    Send,
    CheckCircle,
    Clock,
    Mic,
    ArrowLeft,
    MessageSquare,
} from "lucide-react";

interface TopicData {
    documentId: string;
    topic: string;
    partNumber: number;
    preparationTime: number;
    speakingTime: number;
    questions: string[];
}

interface Recording {
    blob: Blob;
    durationSeconds: number;
}

export default function FullMockSpeakingPage({
    params,
}: {
    params: Promise<{ testId: string }>;
}) {
    const { testId } = use(params);
    const router = useRouter();

    const [topics, setTopics] = useState<TopicData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    // Current navigation state
    const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

    // Recordings: key = "topicIdx-questionIdx"
    const [recordings, setRecordings] = useState<Map<string, Recording>>(new Map());

    const [isRecording, setIsRecording] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [evaluating, setEvaluating] = useState(false);

    // Timer
    const [elapsed, setElapsed] = useState(0);
    const startTimeRef = useRef(Date.now());
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load topics from test
    useEffect(() => {
        async function loadTopics() {
            try {
                const res = await fetch(`/api/full-mock-test/speaking-topics?testId=${testId}`);
                if (!res.ok) throw new Error("Failed to load speaking topics");
                const data = await res.json();
                setTopics(data.topics || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load topics");
            } finally {
                setLoading(false);
            }
        }
        loadTopics();
    }, [testId]);

    // Timer
    useEffect(() => {
        if (!hasStarted) return;
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
            setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [hasStarted]);

    const handleRecordingComplete = useCallback(
        (blob: Blob, durationSeconds: number) => {
            const key = `${currentTopicIdx}-${currentQuestionIdx}`;
            setRecordings((prev) => {
                const next = new Map(prev);
                next.set(key, { blob, durationSeconds });
                return next;
            });
        },
        [currentTopicIdx, currentQuestionIdx],
    );

    const totalQuestions = topics.reduce((sum, t) => sum + t.questions.length, 0);
    const totalRecorded = recordings.size;
    const allRecorded = totalQuestions > 0 && totalRecorded === totalQuestions;

    const globalQuestionNumber = (() => {
        let num = 0;
        for (let i = 0; i < currentTopicIdx; i++) {
            num += topics[i].questions.length;
        }
        return num + currentQuestionIdx + 1;
    })();

    const goToNext = () => {
        const topic = topics[currentTopicIdx];
        if (currentQuestionIdx < topic.questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        } else if (currentTopicIdx < topics.length - 1) {
            setCurrentTopicIdx(currentTopicIdx + 1);
            setCurrentQuestionIdx(0);
        }
    };

    const goToPrev = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(currentQuestionIdx - 1);
        } else if (currentTopicIdx > 0) {
            const prevTopic = topics[currentTopicIdx - 1];
            setCurrentTopicIdx(currentTopicIdx - 1);
            setCurrentQuestionIdx(prevTopic.questions.length - 1);
        }
    };

    const isFirst = currentTopicIdx === 0 && currentQuestionIdx === 0;
    const isLast =
        currentTopicIdx === topics.length - 1 &&
        currentQuestionIdx === topics[topics.length - 1]?.questions.length - 1;

    const handleSubmit = async () => {
        if (!allRecorded) return;
        setSubmitting(true);
        setError(null);

        try {
            // Find the in-progress session created during LRW (speaking is always last)
            const sessionGetRes = await fetch(
                `/api/full-mock-test/session?testId=${testId}`,
            );
            const { sessionId } = await sessionGetRes.json();

            // Upload recordings and build a single multi-topic payload
            const topicGroups: {
                topicId: string;
                recordings: { questionIndex: number; audioUrl: string; durationSeconds: number }[];
            }[] = [];

            for (let topicIdx = 0; topicIdx < topics.length; topicIdx++) {
                const topic = topics[topicIdx];
                const uploadedRecordings: {
                    questionIndex: number;
                    audioUrl: string;
                    durationSeconds: number;
                }[] = [];

                for (let qIdx = 0; qIdx < topic.questions.length; qIdx++) {
                    const key = `${topicIdx}-${qIdx}`;
                    const rec = recordings.get(key);
                    if (!rec) continue;

                    const formData = new FormData();
                    formData.append("file", rec.blob, `speaking-p${topic.partNumber}-q${qIdx + 1}.webm`);

                    const uploadRes = await fetch("/api/speaking/upload", {
                        method: "POST",
                        body: formData,
                    });

                    if (!uploadRes.ok) {
                        throw new Error(`Failed to upload recording for Part ${topic.partNumber} Q${qIdx + 1}`);
                    }

                    const uploadData = await uploadRes.json();
                    uploadedRecordings.push({
                        questionIndex: qIdx,
                        audioUrl: uploadData.url,
                        durationSeconds: rec.durationSeconds,
                    });
                }

                topicGroups.push({ topicId: topic.documentId, recordings: uploadedRecordings });
            }

            // Single submit for all topics → one speaking test-attempt
            const submitRes = await fetch("/api/speaking/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    testId,
                    topics: topicGroups,
                    timeSpentSeconds: elapsed,
                    fullMockAttemptId: sessionId,
                }),
            });

            if (!submitRes.ok) {
                const data = await submitRes.json();
                throw new Error(data.error || "Submit failed");
            }

            const { attemptId } = await submitRes.json();

            setSubmitting(false);
            setEvaluating(true);

            const evalRes = await fetch("/api/speaking/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ attemptId }),
            });

            if (!evalRes.ok) {
                const data = await evalRes.json();
                throw new Error(data.error || "Evaluation failed");
            }

            const { bandScore: speakingScore } = await evalRes.json();

            // Finalize the session with the speaking score + mark complete
            if (sessionId) {
                await fetch("/api/full-mock-test/session", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId,
                        speakingScore: speakingScore ?? null,
                        complete: true,
                    }),
                });
            }

            router.push(`/dashboard/full-mock-test/${testId}/results`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setSubmitting(false);
            setEvaluating(false);
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading speaking test...</p>
                </div>
            </div>
        );
    }

    if (error && !topics.length) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-destructive font-medium">{error}</p>
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/dashboard/full-mock-test/${testId}`)}
                    >
                        Back to Test
                    </Button>
                </div>
            </div>
        );
    }

    if (!topics.length) return null;

    // Instructions Screen
    if (!hasStarted) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
                <Card className="max-w-3xl w-full">
                    <CardHeader className="px-4 md:px-8 pt-5 pb-4">
                        <CardTitle className="text-2xl md:text-3xl">
                            IELTS Speaking Test
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base mt-1">
                            Full Mock Test — Speaking Section
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 md:space-y-8 px-4 md:px-6">
                        <div className="space-y-5 md:space-y-6">
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                    <Mic className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-base md:text-lg">Speaking Parts</p>
                                    <p className="text-sm md:text-base text-muted-foreground">
                                        {topics.length} parts · {totalQuestions} questions total
                                    </p>
                                </div>
                            </div>

                            {topics.map((topic) => (
                                <div key={topic.documentId} className="flex items-start gap-3 md:gap-4">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-base md:text-lg">Part {topic.partNumber}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {topic.topic} · {topic.questions.length} questions
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-base md:text-lg">Instructions</p>
                                    <ul className="text-sm md:text-base text-muted-foreground space-y-1.5 mt-1 list-disc list-inside">
                                        <li>Record your answer for each question</li>
                                        <li>You can re-record before moving to the next question</li>
                                        <li>Submit when all questions are recorded</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2 md:pt-4">
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1 text-sm md:text-base"
                                onClick={() => router.push(`/dashboard/full-mock-test/${testId}`)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 text-sm md:text-base"
                                size="lg"
                                onClick={() => setHasStarted(true)}
                            >
                                Begin Speaking Test
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentTopic = topics[currentTopicIdx];
    const currentQuestion = currentTopic.questions[currentQuestionIdx];
    const currentKey = `${currentTopicIdx}-${currentQuestionIdx}`;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if (window.confirm("If you leave, your recordings will be lost.")) {
                            router.push(`/dashboard/full-mock-test/${testId}`);
                        }
                    }}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-lg font-black text-xs tracking-widest uppercase">
                            Part {currentTopic.partNumber}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                            Full Mock Test
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatTime(elapsed)}
                    </div>
                </div>
                <h1 className="text-xl font-bold">{currentTopic.topic}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    Question {globalQuestionNumber} of {totalQuestions}
                </p>
            </div>

            {/* Question */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Question {currentQuestionIdx + 1} of {currentTopic.questions.length}
                    </h2>
                    {recordings.has(currentKey) && (
                        <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                            <CheckCircle className="h-4 w-4" />
                            Recorded
                        </span>
                    )}
                </div>

                <p className="text-lg font-medium leading-relaxed">{currentQuestion}</p>

                <VoiceRecorder
                    key={currentKey}
                    onRecordingComplete={handleRecordingComplete}
                    onRecordingStateChange={setIsRecording}
                    disabled={submitting || evaluating}
                />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={goToPrev}
                    disabled={isFirst || isRecording}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                <div className="flex flex-wrap items-center gap-1.5">
                    {topics.map((topic, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-1">
                            {tIdx > 0 && <div className="w-1.5 h-px bg-border mx-0.5" />}
                            {topic.questions.map((_, qIdx) => {
                                const key = `${tIdx}-${qIdx}`;
                                const isActive = tIdx === currentTopicIdx && qIdx === currentQuestionIdx;
                                const isRecorded = recordings.has(key);
                                return (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setCurrentTopicIdx(tIdx);
                                            setCurrentQuestionIdx(qIdx);
                                        }}
                                        disabled={isRecording}
                                        className={`h-7 w-7 md:h-8 md:w-8 rounded-full text-[10px] md:text-xs font-bold transition-colors ${
                                            isRecording ? "opacity-50 cursor-not-allowed" : ""
                                        } ${isActive
                                                ? "bg-primary text-primary-foreground"
                                                : isRecorded
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                                                    : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {(() => {
                                            let num = 0;
                                            for (let i = 0; i < tIdx; i++) num += topics[i].questions.length;
                                            return num + qIdx + 1;
                                        })()}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {isLast ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={!allRecorded || submitting || evaluating || isRecording}
                        className="gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : evaluating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Evaluating...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Submit
                            </>
                        )}
                    </Button>
                ) : (
                    <Button variant="outline" onClick={goToNext} disabled={isRecording} className="gap-2">
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                    {error}
                </div>
            )}

            {/* Progress */}
            <div className="text-center text-xs text-muted-foreground">
                {totalRecorded} of {totalQuestions} questions recorded
            </div>
        </div>
    );
}
