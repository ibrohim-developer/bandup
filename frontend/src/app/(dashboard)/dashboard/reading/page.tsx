import type { Metadata } from "next";
import Link from "@/components/no-prefetch-link";
import { Clock } from "lucide-react";
import { TestFilters } from "@/components/test/common/test-filters";
import { ReadingVirtualList } from "@/components/test/reading/reading-virtual-list";
import { fetchReadingTests } from "./actions";

export const metadata: Metadata = {
  title: "IELTS Reading Practice Tests — Free Mock Exams",
  description:
    "Practice IELTS Reading with free mock tests. Academic and General Training passages with detailed answers. Improve your band score on BandUp.",
  alternates: { canonical: "https://bandup.uz/dashboard/reading" },
};

const readingFilters = [
  {
    key: "difficulty",
    placeholder: "All Levels",
    options: [
      { value: "all", label: "All Levels" },
      { value: "easy", label: "Easy" },
      { value: "medium", label: "Medium" },
      { value: "hard", label: "Hard" },
    ],
  },
  {
    key: "type",
    placeholder: "All Types",
    options: [
      { value: "all", label: "All Types" },
      { value: "academic", label: "Academic" },
      { value: "general", label: "General" },
    ],
  },
  {
    key: "part",
    placeholder: "All Parts",
    options: [
      { value: "all", label: "All Parts" },
      { value: "1", label: "Part 1" },
      { value: "2", label: "Part 2" },
      { value: "3", label: "Part 3" },
    ],
  },
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

export default async function ReadingTestsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const { items: initialTests, totalCount, hasMore } = await fetchReadingTests(params, 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <TestFilters filters={readingFilters} />

      <div className="flex items-start md:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-1">Reading Challenge</h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            {totalCount} Available Tests
          </p>
        </div>
        <Link
          href="/dashboard/reading/history"
          className="flex items-center gap-2 text-xs font-bold px-3 py-2 md:px-4 border border-border rounded-lg hover:bg-card transition-colors shrink-0"
        >
          <Clock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Completed Tests</span>
          <span className="sm:hidden">History</span>
        </Link>
      </div>

      <ReadingVirtualList
        initialTests={initialTests}
        hasMore={hasMore}
        filterParams={params}
      />
    </div>
  );
}
