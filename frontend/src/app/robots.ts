import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/dashboard/reading",
          "/dashboard/listening",
          "/dashboard/writing",
          "/dashboard/speaking",
          "/dashboard/speaking/questions",
          "/dashboard/speaking/mock-exam",
          "/dashboard/full-mock-test",
          "/dashboard/reading/",
          "/dashboard/listening/",
          "/dashboard/writing/",
        ],
        disallow: [
          "/dashboard/history",
          "/dashboard/progress",
          "/dashboard/results/",
          "/dashboard/listening/history",
          "/dashboard/reading/history",
          "/dashboard/writing/history",
          "/dashboard/speaking/history",
          "/dashboard/speaking/",
          "/dashboard/full-mock-test/",
          "/dashboard/flashcards",
          "/dashboard/videos",
          "/api/",
          "/admin/",
          "/sign-in",
          "/sign-up",
          "/reset-password",
          "/update-password",
        ],
      },
    ],
    sitemap: "https://bandup.uz/sitemap.xml",
    host: "https://bandup.uz",
  };
}
