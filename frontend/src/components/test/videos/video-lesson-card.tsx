import Link from "@/components/no-prefetch-link";
import { PlayCircle, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoLesson } from "@/app/(dashboard)/dashboard/videos/actions";

const difficultyColor = {
  beginner: "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400",
  intermediate: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400",
  advanced: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400",
};

const categoryColor = {
  listening: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
  reading: "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400",
  writing: "text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400",
  speaking: "text-pink-600 bg-pink-50 dark:bg-pink-950 dark:text-pink-400",
  general: "text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-400",
};

export function VideoLessonCard({ video }: { video: VideoLesson }) {
  return (
    <Link
      href={`/dashboard/videos/${video.id}`}
      className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <PlayCircle className="h-12 w-12 text-white drop-shadow-lg opacity-90" />
        </div>
        {video.has_quiz && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5 rounded-full">
            <BookOpen className="h-2.5 w-2.5" />
            QUIZ
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
              difficultyColor[video.difficulty],
            )}
          >
            {video.difficulty}
          </span>
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
              categoryColor[video.category],
            )}
          >
            {video.category}
          </span>
        </div>

        <h3 className="text-sm font-black leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>

        {video.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-auto pt-2 text-xs text-muted-foreground font-bold">
          {video.channel_name && <span>{video.channel_name}</span>}
          {video.duration_minutes > 0 && (
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="h-3 w-3" />
              {video.duration_minutes} min
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
