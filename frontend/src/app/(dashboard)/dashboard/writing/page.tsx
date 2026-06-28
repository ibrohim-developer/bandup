import type { Metadata } from "next";
import Link from "@/components/no-prefetch-link";
import { PenTool, ArrowRight } from "lucide-react";
import { TestFilters } from "@/components/test/common/test-filters";
import { CollectionTabs } from "@/components/test/common/collection-tabs";
import { WritingVirtualList } from "@/components/test/writing/writing-virtual-list";
import { fetchWritingTests } from "./actions";

export const metadata: Metadata = {
  title: "IELTS Writing Practice Tests — Free AI-Scored Mock Exams",
  description:
    "Practice IELTS Writing with free AI-scored mock tests. Task 1 and Task 2 with instant feedback on grammar, vocabulary, coherence, and task achievement.",
  alternates: { canonical: "https://bandup.uz/dashboard/writing" },
};

const writingFilters = [
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

export default async function WritingTestsPage({
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
  } = await fetchWritingTests(params, 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div className="pb-2 border-b border-border/50">
        <h1 className="text-2xl md:text-3xl font-black mb-1">IELTS Writing Practice Tests</h1>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          {totalCount} Available Tests
        </p>
      </div>

      <TestFilters filters={writingFilters} size="lg" />

      <CollectionTabs counts={counts} />
{/*
      <Link
        href="/dashboard/writing/free"
        className="block group rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 p-5 md:p-6 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
            <PenTool className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold">Write Your Own Essay</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Practice writing on any topic you choose and get instant AI feedback
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </div>
      </Link> */}

      <WritingVirtualList
        initialTests={initialTests}
        hasMore={hasMore}
        filterParams={params}
      />
    </div>
  );
}
