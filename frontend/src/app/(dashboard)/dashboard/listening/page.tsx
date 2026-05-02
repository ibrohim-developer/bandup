import type { Metadata } from "next";
import Link from "@/components/no-prefetch-link";
import { Clock } from "lucide-react";
import { TestFilters } from "@/components/test/common/test-filters";
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
    key: "sections",
    placeholder: "All Sections",
    options: [
      { value: "all", label: "All Sections" },
      { value: "1", label: "Section 1" },
      { value: "2", label: "Section 2" },
      { value: "3", label: "Section 3" },
      { value: "4", label: "Section 4" },
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
  const { items: initialTests, totalCount, hasMore } = await fetchListeningTests(params, 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <TestFilters filters={listeningFilters} />

      <div className="flex items-start md:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-1">Listening Challenge</h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            {totalCount} Available Tests
          </p>
        </div>
        <Link
          href="/dashboard/listening/history"
          className="flex items-center gap-2 text-xs font-bold px-3 py-2 md:px-4 border border-border rounded-lg hover:bg-card transition-colors shrink-0"
        >
          <Clock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Completed Tests</span>
          <span className="sm:hidden">History</span>
        </Link>
      </div>

      <ListeningVirtualList
        initialTests={initialTests}
        hasMore={hasMore}
        filterParams={params}
      />
    </div>
  );
}
