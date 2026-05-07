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
          "/dashboard/reading/",
          "/dashboard/listening/",
          "/dashboard/writing/",
        ],
        disallow: [
          "/dashboard/history",
          "/dashboard/progress",
          "/dashboard/results/",
          "/dashboard/full-mock-test",
          "/dashboard/speaking",
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
