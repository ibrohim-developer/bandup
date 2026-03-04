"use client";

import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2 } from "lucide-react";
import { useScrollContainer } from "./scroll-container-context";

interface VirtualTestListProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  emptyMessage: string;
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

export function VirtualTestList<T extends { id: string }>({
  items,
  renderCard,
  emptyMessage,
  hasMore = false,
  isLoading = false,
  onLoadMore,
}: VirtualTestListProps<T>) {
  const scrollElement = useScrollContainer();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 120,
    overscan: 5,
    gap: 12,
  });

  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoading || !sentinelRef.current || !scrollElement) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { root: scrollElement, rootMargin: "200px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading, scrollElement]);

  if (items.length === 0 && !isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 md:p-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ height: `${virtualizer.getTotalSize()}px` }}
        className="relative w-full"
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderCard(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} className="h-1" />}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </>
  );
}
