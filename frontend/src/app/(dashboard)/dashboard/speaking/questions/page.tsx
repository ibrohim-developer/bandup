import type { Metadata } from "next";
import { TestFilters } from "@/components/test/common/test-filters";
import { SpeakingVirtualList } from "@/components/test/speaking/speaking-virtual-list";
import { fetchSpeakingTopics } from "./actions";

export const metadata: Metadata = {
  title: "IELTS Speaking Questions — Practice Topics by Part",
  description:
    "Browse IELTS Speaking topics and practice questions organized by part. Improve your speaking band score on BandUp.",
  alternates: {
    canonical: "https://bandup.uz/dashboard/speaking/questions",
  },
};

const speakingFilters = [
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
    key: "part",
    placeholder: "All Parts",
    options: [
      { value: "all", label: "All Parts" },
      { value: "1", label: "Part 1" },
      { value: "2", label: "Part 2" },
      { value: "3", label: "Part 3" },
    ],
  },
];

export default async function SpeakingQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const {
    items: initialTopics,
    totalCount,
    hasMore,
  } = await fetchSpeakingTopics(params, 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <TestFilters filters={speakingFilters} />

      <div className="flex items-start md:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-1">
            Speaking Questions
          </h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            {totalCount} Available Topics
          </p>
        </div>
      </div>

      <SpeakingVirtualList
        initialTopics={initialTopics}
        hasMore={hasMore}
        filterParams={params}
      />
    </div>
  );
}
