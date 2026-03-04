import type { MetadataRoute } from "next";
import { find } from "@/lib/strapi/api";

const BASE = "https://bandup.uz";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [readingPassages, listeningSections, writingTasks] = await Promise.all([
    find("reading-passages", {
      filters: { test: { is_published: { $eq: true } } },
      populate: { test: { fields: ["title", "updatedAt"] } },
      fields: ["passage_number"],
    }),
    find("listening-sections", {
      filters: { test: { is_published: { $eq: true } } },
      populate: { test: { fields: ["title", "updatedAt"] } },
      fields: ["section_number"],
    }),
    find("writing-tasks", {
      filters: { test: { is_published: { $eq: true } } },
      populate: { test: { fields: ["title", "updatedAt"] } },
      fields: ["task_number"],
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/for-business`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const seen = new Set<string>();

  const addTestRoutes = (
    data: any[] | null,
    module: string
  ): MetadataRoute.Sitemap => {
    if (!data) return [];
    const routes: MetadataRoute.Sitemap = [];
    for (const row of data) {
      const test = row.test;
      if (!test) continue;
      const key = `${module}/${test.documentId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      routes.push({
        url: `${BASE}/dashboard/${module}/${test.documentId}`,
        lastModified: new Date(test.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    }
    return routes;
  };

  return [
    ...staticRoutes,
    ...addTestRoutes(readingPassages, "reading"),
    ...addTestRoutes(listeningSections, "listening"),
    ...addTestRoutes(writingTasks, "writing"),
  ];
}
