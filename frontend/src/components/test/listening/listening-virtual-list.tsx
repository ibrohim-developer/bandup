"use client";

import { useState, useEffect, useCallback } from "react";
import { VirtualTestList } from "@/components/test/common/virtual-test-list";
import {
  ListeningTestCard,
  type ListeningTestItem,
} from "./listening-test-card";
import { fetchListeningTests } from "@/app/(dashboard)/dashboard/listening/actions";

interface Props {
  initialTests: ListeningTestItem[];
  hasMore: boolean;
  filterParams: Record<string, string | undefined>;
}

export function ListeningVirtualList({
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
    const result = await fetchListeningTests(filterParams, nextPage);
    setTests((prev) => [...prev, ...result.items]);
    setPage(nextPage);
    setHasMore(result.hasMore);
    setIsLoading(false);
  }, [page, hasMore, isLoading, filterParams]);

  return (
    <VirtualTestList
      items={tests}
      renderCard={(test, index) => (
        <ListeningTestCard test={test} index={index} />
      )}
      emptyMessage="No listening tests available yet."
      hasMore={hasMore}
      isLoading={isLoading}
      onLoadMore={loadMore}
    />
  );
}
