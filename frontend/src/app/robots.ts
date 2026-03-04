import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/dashboard/reading/",
          "/dashboard/listening/",
          "/dashboard/writing/",
        ],
        disallow: [
          "/dashboard/",
          "/api/",
          "/auth/",
          "/admin/",
        ],
      },
    ],
    sitemap: "https://bandup.uz/sitemap.xml",
    host: "https://bandup.uz",
  };
}
