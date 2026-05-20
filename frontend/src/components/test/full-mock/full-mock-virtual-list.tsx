"use client";

import { useState, useEffect, useCallback } from "react";
import { Lock, Sparkles, ChevronDown } from "lucide-react";
import { VirtualTestList } from "@/components/test/common/virtual-test-list";
import { FullMockTestCard, type FullMockTestItem } from "./full-mock-test-card";
import { fetchFullMockTests } from "@/app/(dashboard)/dashboard/full-mock-test/actions";
import { Button } from "@/components/ui/button";
import { PremiumUpgradeDialog } from "@/components/premium-upgrade-dialog";

const LOCKED_PREVIEWS = [
    {
        id: "placeholder-1",
        slug: "placeholder-1",
        title: "IELTS Full Mock Test 2 — Academic",
        description: "A complete IELTS Academic mock test with new passages, audio, and writing prompts.",
        listeningQuestions: 40, listeningSections: 4,
        readingQuestions: 40, readingPassages: 3,
        writingTasks: 2, speakingTopics: 3, duration: 165,
        isCompleted: false, isLocked: true,
    },
    {
        id: "placeholder-2",
        slug: "placeholder-2",
        title: "IELTS Full Mock Test 3 — Academic",
        description: "Fresh content across all modules. Ideal for tracking your progress over multiple attempts.",
        listeningQuestions: 40, listeningSections: 4,
        readingQuestions: 40, readingPassages: 3,
        writingTasks: 2, speakingTopics: 3, duration: 165,
        isCompleted: false, isLocked: true,
    },
    {
        id: "placeholder-3",
        slug: "placeholder-3",
        title: "IELTS Full Mock Test 4 — Academic",
        description: "Advanced difficulty passages and tasks designed to push your band score higher.",
        listeningQuestions: 40, listeningSections: 4,
        readingQuestions: 40, readingPassages: 3,
        writingTasks: 2, speakingTopics: 3, duration: 165,
        isCompleted: false, isLocked: true,
    },
] satisfies FullMockTestItem[];

interface Props {
    initialTests: FullMockTestItem[];
    hasMore: boolean;
    filterParams: Record<string, string | undefined>;
}

export function FullMockVirtualList({ initialTests, hasMore: initialHasMore, filterParams }: Props) {
    const [tests, setTests] = useState(initialTests);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isLoading, setIsLoading] = useState(false);
    const [upgradeOpen, setUpgradeOpen] = useState(false);

    useEffect(() => {
        setTests(initialTests);
        setPage(0);
        setHasMore(initialHasMore);
    }, [initialTests, initialHasMore]);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        const nextPage = page + 1;
        const result = await fetchFullMockTests(filterParams, nextPage);
        setTests((prev) => [...prev, ...result.items]);
        setPage(nextPage);
        setHasMore(result.hasMore);
        setIsLoading(false);
    }, [page, hasMore, isLoading, filterParams]);

    const showLocked = !filterParams.status || filterParams.status === "all";

    return (
        <>
            <VirtualTestList
                items={tests}
                renderCard={(test) => <FullMockTestCard test={test} />}
                emptyMessage="No full mock tests available yet."
                hasMore={hasMore}
                isLoading={isLoading}
                onLoadMore={loadMore}
            />

            {/* Locked premium section */}
            {showLocked && (
                <div className="mt-3">
                    {/* Single blurred block with one overlay */}
                    <div className="rounded-xl overflow-hidden bg-card border border-border">
                        {/* Card header — always visible */}
                        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Premium Tests — {LOCKED_PREVIEWS.length} more available
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {/* Blurred body with overlay — only this part is locked */}
                        <div className="relative">
                            <div className="space-y-3 p-4 md:p-6 blur-sm pointer-events-none select-none">
                                {LOCKED_PREVIEWS.map((test) => (
                                    <FullMockTestCard key={test.id} test={test} />
                                ))}
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/70 backdrop-blur-[2px]">
                                <div className="flex flex-col items-center gap-4 text-center px-6 py-8 max-w-sm">
                                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20">
                                        <Lock className="h-7 w-7 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-lg mb-1">
                                            Unlock All {LOCKED_PREVIEWS.length} Premium Tests
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            One plan gives you access to every full mock test, AI scoring, and detailed feedback.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setUpgradeOpen(true)}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8"
                                    >
                                        Upgrade to Premium
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade modal */}
            <PremiumUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
        </>
    );
}
