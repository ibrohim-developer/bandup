import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/no-prefetch-link";
import { ChevronLeft } from "lucide-react";
import { findOne } from "@/lib/strapi/api";
import { VideoPlayer } from "@/components/test/videos/video-player";
import { VideoQuiz } from "@/components/test/videos/video-quiz";
import type { QuizQuestion } from "@/app/api/videos/quiz/route";
import { cn } from "@/lib/utils";

const difficultyColor = {
  beginner: "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400",
  intermediate: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400",
  advanced: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ videoId: string }>;
}): Promise<Metadata> {
  const { videoId } = await params;
  const video = await findOne("video-lessons", videoId, {
    fields: ["title", "description"],
  });
  if (!video) return {};
  return {
    title: `${video.title} — IELTS Video Lesson`,
    description: video.description ?? "Watch this IELTS lesson and test your knowledge with an AI-generated quiz.",
  };
}

export default async function VideoLessonPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const video = await findOne("video-lessons", videoId, {
    fields: [
      "youtube_id",
      "title",
      "description",
      "channel_name",
      "difficulty",
      "category",
      "duration_minutes",
      "quiz_questions",
    ],
  });

  if (!video) notFound();

  const quizQuestions: QuizQuestion[] = Array.isArray(video.quiz_questions)
    ? video.quiz_questions
    : [];

  return (
    <div className="space-y-6 pb-12">
      <Link
        href="/dashboard/videos"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Video Lessons
      </Link>

      <div className="space-y-6 max-w-4xl mx-auto">
        <VideoPlayer youtubeId={video.youtube_id} />

        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                difficultyColor[video.difficulty as keyof typeof difficultyColor] ??
                  difficultyColor.intermediate,
              )}
            >
              {video.difficulty}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {video.category}
            </span>
            {video.channel_name && (
              <span className="text-xs text-muted-foreground font-bold ml-1">
                {video.channel_name}
              </span>
            )}
          </div>

          <h1 className="text-xl md:text-2xl font-black leading-snug">
            {video.title}
          </h1>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <VideoQuiz videoId={videoId} initialQuestions={quizQuestions} />
        </div>
      </div>
    </div>
  );
}
