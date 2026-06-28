import type { Metadata } from "next";
import { TestFilters } from "@/components/test/common/test-filters";
import { SpeakingVirtualList } from "@/components/test/speaking/speaking-virtual-list";
import { fetchSpeakingTests } from "./actions";

export const metadata: Metadata = {
  title: "IELTS Speaking Tests — Practice by Topic",
  description:
    "Browse IELTS Speaking tests and practice by topic. Improve your speaking band score on BandUp.",
  alternates: {
    canonical: "https://bandup.uz/dashboard/speaking/questions",
  },
};

const speakingFilters = [
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
    placeholder: "All Tests",
    options: [
      { value: "all", label: "All Tests" },
      { value: "new", label: "New" },
      { value: "completed", label: "Completed" },
    ],
  },
];

export default async function SpeakingQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const { items: initialTests, totalCount, hasMore } = await fetchSpeakingTests(params, 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div className="pb-2 border-b border-border/50">
        <h2 className="text-2xl md:text-3xl font-black mb-1">Speaking Tests</h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          {totalCount} Available Tests
        </p>
      </div>

      <TestFilters filters={speakingFilters} />

      <SpeakingVirtualList
        initialTests={initialTests}
        hasMore={hasMore}
        filterParams={params}
      />
    </div>
  );
}
