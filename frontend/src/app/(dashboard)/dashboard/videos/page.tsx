import type { Metadata } from "next";
import { TestFilters } from "@/components/test/common/test-filters";
import { VideoLessonCard } from "@/components/test/videos/video-lesson-card";
import { fetchVideoLessons } from "./actions";

export const metadata: Metadata = {
  title: "IELTS Video Lessons — Learn with AI Quizzes",
  description:
    "Watch IELTS video lessons and test your understanding with AI-generated quizzes. Free IELTS preparation on BandUp.",
  alternates: { canonical: "https://bandup.uz/dashboard/videos" },
};

const videoFilters = [
  {
    key: "difficulty",
    placeholder: "All Levels",
    options: [
      { value: "all", label: "All Levels" },
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },
  {
    key: "category",
    placeholder: "All Skills",
    options: [
      { value: "all", label: "All Skills" },
      { value: "listening", label: "Listening" },
      { value: "reading", label: "Reading" },
      { value: "writing", label: "Writing" },
      { value: "speaking", label: "Speaking" },
      { value: "general", label: "General" },
    ],
  },
];

export default async function VideoLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const { items, totalCount } = await fetchVideoLessons(params);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <TestFilters filters={videoFilters} />

      <div className="flex items-start md:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-1">
            Video Lessons
          </h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            {totalCount} Available Videos
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-muted-foreground font-bold text-sm">
            No video lessons available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((video) => (
            <VideoLessonCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
