import type { Metadata } from "next";
import { TestFilters } from "@/components/test/common/test-filters";
import { CollectionTabs } from "@/components/test/common/collection-tabs";
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
  const {
    items: initialTests,
    totalCount,
    hasMore,
    counts,
  } = await fetchReadingTests(params, 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div className="pb-2 border-b border-border/50">
        <h1 className="text-2xl md:text-3xl font-black mb-1">IELTS Reading Practice Tests</h1>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          {totalCount} Available Tests
        </p>
      </div>

      <TestFilters filters={readingFilters} size="lg" />

      <CollectionTabs counts={counts} />

      <ReadingVirtualList
        initialTests={initialTests}
        hasMore={hasMore}
        filterParams={params}
      />
    </div>
  );
}
