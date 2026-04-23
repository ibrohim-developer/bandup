import type { Metadata } from "next";
import Link from "@/components/no-prefetch-link";
import { Clock } from "lucide-react";
import { TestFilters } from "@/components/test/common/test-filters";
import { FullMockVirtualList } from "@/components/test/full-mock/full-mock-virtual-list";
import { fetchFullMockTests } from "./actions";

export const metadata: Metadata = {
  title: "IELTS Full Mock Test — Complete Practice Exam",
  description:
    "Take a complete IELTS mock test with all four modules: Listening, Reading, Writing, and Speaking. Simulate the real exam experience on BandUp.",
  alternates: { canonical: "https://bandup.uz/dashboard/full-mock-test" },
};

const fullMockFilters = [
  {
    key: "status",
    placeholder: "All Status",
    options: [
      { value: "all", label: "All Status" },
      { value: "new", label: "New" },
      { value: "completed", label: "Completed" },
    ],
  },
];

export default async function FullMockTestPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const { items: initialTests, totalCount, hasMore } = await fetchFullMockTests(params, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-start md:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-1">Full Mock Tests</h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            {totalCount} Available Tests
          </p>
        </div>
        <Link
          href="/dashboard/full-mock-test/history"
          className="flex items-center gap-2 text-xs font-bold px-3 py-2 md:px-4 border border-border rounded-lg hover:bg-card transition-colors shrink-0"
        >
          <Clock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Completed Tests</span>
          <span className="sm:hidden">History</span>
        </Link>
      </div>

      {/* Filters */}
      <TestFilters filters={fullMockFilters} />

      {/* Test List */}
      <FullMockVirtualList
        initialTests={initialTests}
        hasMore={hasMore}
        filterParams={params}
      />
    </div>
  );
}
