import { Skeleton } from "@/components/ui/skeleton";
import { TestListSkeleton } from "@/components/test/common/test-card-skeleton";

export default function ReadingLoading() {
  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="flex items-start md:items-end justify-between gap-3">
        <div>
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <TestListSkeleton count={6} />
    </div>
  );
}
