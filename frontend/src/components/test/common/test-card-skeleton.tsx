import { Skeleton } from "@/components/ui/skeleton";

export function TestCardSkeleton() {
  return (
    <div className="bg-card border border-border p-4 md:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <Skeleton className="h-6 w-48 md:w-64 mb-2 md:mb-3" />
        <Skeleton className="h-3 w-20 mb-3 md:mb-4" />
        <div className="flex items-center gap-4 md:gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-11 w-full md:w-28 rounded-lg" />
    </div>
  );
}

export function TestListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <TestCardSkeleton key={i} />
      ))}
    </div>
  );
}
