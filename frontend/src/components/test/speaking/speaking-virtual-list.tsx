"use client";

import { useState, useEffect, useCallback } from "react";
import { VirtualTestList } from "@/components/test/common/virtual-test-list";
import {
  SpeakingTopicCard,
  type SpeakingTopicItem,
} from "./speaking-topic-card";
import { fetchSpeakingTopics } from "@/app/(dashboard)/dashboard/speaking/questions/actions";

interface Props {
  initialTopics: SpeakingTopicItem[];
  hasMore: boolean;
  filterParams: Record<string, string | undefined>;
}

export function SpeakingVirtualList({
  initialTopics,
  hasMore: initialHasMore,
  filterParams,
}: Props) {
  const [topics, setTopics] = useState(initialTopics);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTopics(initialTopics);
    setPage(0);
    setHasMore(initialHasMore);
  }, [initialTopics, initialHasMore]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const result = await fetchSpeakingTopics(filterParams, nextPage);
    setTopics((prev) => [...prev, ...result.items]);
    setPage(nextPage);
    setHasMore(result.hasMore);
    setIsLoading(false);
  }, [page, hasMore, isLoading, filterParams]);

  return (
    <VirtualTestList
      items={topics}
      renderCard={(topic) => <SpeakingTopicCard topic={topic} />}
      emptyMessage="No speaking topics available yet."
      hasMore={hasMore}
      isLoading={isLoading}
      onLoadMore={loadMore}
    />
  );
}
