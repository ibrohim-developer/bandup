"use client";

import { useState, useEffect, useCallback } from "react";
import { VirtualTestList } from "@/components/test/common/virtual-test-list";
import { FullMockTestCard, type FullMockTestItem } from "./full-mock-test-card";
import { fetchFullMockTests } from "@/app/(dashboard)/dashboard/full-mock-test/actions";

interface Props {
    initialTests: FullMockTestItem[];
    hasMore: boolean;
    filterParams: Record<string, string | undefined>;
}

export function FullMockVirtualList({
    initialTests,
    hasMore: initialHasMore,
    filterParams,
}: Props) {
    const [tests, setTests] = useState(initialTests);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <VirtualTestList
            items={tests}
            renderCard={(test) => <FullMockTestCard test={test} />}
            emptyMessage="No full mock tests available yet."
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={loadMore}
        />
    );
}
