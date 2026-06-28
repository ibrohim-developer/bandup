"use client";

import { useState, useEffect, useCallback } from "react";
import { VirtualTestList } from "@/components/test/common/virtual-test-list";
import { BookTestCard } from "@/components/test/common/book-test-card";
import type { BookGroup } from "@/lib/tests/book-grouping";
import { fetchWritingTests } from "@/app/(dashboard)/dashboard/writing/actions";

interface Props {
  initialTests: BookGroup[];
  hasMore: boolean;
  filterParams: Record<string, string | undefined>;
}

export function WritingVirtualList({
  initialTests,
  hasMore: initialHasMore,
  filterParams,
}: Props) {
  const [tests, setTests] = useState(initialTests);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  // Accordion open state is owned here (not in the card) so it survives the
  // unmount/remount the virtualizer does as cards scroll out of view.
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTests(initialTests);
    setPage(0);
    setHasMore(initialHasMore);
    setOpenMap({});
  }, [initialTests, initialHasMore]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const result = await fetchWritingTests(filterParams, nextPage);
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
          basePath="/dashboard/writing"
          collapseSingle={false}
          open={openMap[group.id] ?? index === 0}
          onOpenChange={(o) =>
            setOpenMap((m) => ({ ...m, [group.id]: o }))
          }
        />
      )}
      emptyMessage="No writing tests available yet."
      hasMore={hasMore}
      isLoading={isLoading}
      onLoadMore={loadMore}
    />
  );
}
