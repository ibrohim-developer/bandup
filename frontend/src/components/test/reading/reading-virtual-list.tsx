"use client";

import { useState, useEffect, useCallback } from "react";
import { VirtualTestList } from "@/components/test/common/virtual-test-list";
import { BookTestCard } from "@/components/test/common/book-test-card";
import type { BookGroup } from "@/lib/tests/book-grouping";
import { fetchReadingTests } from "@/app/(dashboard)/dashboard/reading/actions";

interface Props {
  initialTests: BookGroup[];
  hasMore: boolean;
  filterParams: Record<string, string | undefined>;
}

export function ReadingVirtualList({
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
    const result = await fetchReadingTests(filterParams, nextPage);
    setTests((prev) => [...prev, ...result.items]);
    setPage(nextPage);
    setHasMore(result.hasMore);
    setIsLoading(false);
  }, [page, hasMore, isLoading, filterParams]);

  return (
    <VirtualTestList
      items={tests}
      renderCard={(group, index) => (
        <BookTestCard
          group={group}
          basePath="/dashboard/reading"
          defaultOpen={index === 0}
        />
      )}
      emptyMessage="No reading tests available yet."
      hasMore={hasMore}
      isLoading={isLoading}
      onLoadMore={loadMore}
    />
  );
}
