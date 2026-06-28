import type { Metadata } from "next";
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
      <div className="pb-2 border-b border-border/50">
        <h2 className="text-2xl md:text-3xl font-black mb-1">Full Mock Tests</h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          {totalCount} Available Tests
        </p>
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
