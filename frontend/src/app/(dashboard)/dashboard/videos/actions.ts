"use server";

import { unstable_cache } from "next/cache";
import { find } from "@/lib/strapi/api";

export interface VideoLesson {
  id: string;
  youtube_id: string;
  title: string;
  description: string;
  channel_name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "listening" | "reading" | "writing" | "speaking" | "general";
  duration_minutes: number;
  has_quiz: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const getVideoLessons = unstable_cache(
  async (): Promise<VideoLesson[]> => {
    const videos = await find("video-lessons", {
      filters: { is_published: { $eq: true } },
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

    if (!videos?.length) return [];

    return videos.map((v: any) => ({
      id: v.documentId,
      youtube_id: v.youtube_id,
      title: v.title,
      description: v.description ?? "",
      channel_name: v.channel_name ?? "",
      difficulty: v.difficulty ?? "intermediate",
      category: v.category ?? "general",
      duration_minutes: v.duration_minutes ?? 0,
      has_quiz: Array.isArray(v.quiz_questions) && v.quiz_questions.length > 0,
    }));
  },
  ["video-lessons"],
  { revalidate: 300 },
);

export async function fetchVideoLessons(
  params: Record<string, string | undefined>,
) {
  const all = await getVideoLessons();

  const filtered = all.filter((v) => {
    if (params.q && !v.title.toLowerCase().includes(params.q.toLowerCase()))
      return false;
    if (
      params.difficulty &&
      params.difficulty !== "all" &&
      v.difficulty !== params.difficulty
    )
      return false;
    if (
      params.category &&
      params.category !== "all" &&
      v.category !== params.category
    )
      return false;
    return true;
  });

  return { items: filtered, totalCount: filtered.length };
}
