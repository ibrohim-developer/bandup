import type { Metadata } from "next";
import { TestFilters } from "@/components/test/common/test-filters";
import { CollectionTabs } from "@/components/test/common/collection-tabs";
import { ListeningVirtualList } from "@/components/test/listening/listening-virtual-list";
import { fetchListeningTests } from "./actions";

export const metadata: Metadata = {
  title: "IELTS Listening Practice Tests — Free Mock Exams",
  description:
    "Practice IELTS Listening with free mock tests. Real exam-style audio sections with answers and explanations. Improve your band score on BandUp.",
  alternates: { canonical: "https://bandup.uz/dashboard/listening" },
};

const listeningFilters = [
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

export default async function ListeningTestsPage({
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
  } = await fetchListeningTests(params, 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div className="pb-2 border-b border-border/50">
        <h1 className="text-2xl md:text-3xl font-black mb-1">IELTS Listening Practice Tests</h1>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          {totalCount} Available Tests
        </p>
      </div>

      <TestFilters filters={listeningFilters} size="lg" />

      <CollectionTabs counts={counts} />

      <ListeningVirtualList
        initialTests={initialTests}
        hasMore={hasMore}
        filterParams={params}
      />
    </div>
  );
}
