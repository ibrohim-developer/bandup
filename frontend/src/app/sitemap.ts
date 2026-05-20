import type { MetadataRoute } from "next";
import { find } from "@/lib/strapi/api";

const BASE = "https://bandup.uz";

export const revalidate = 3600;

/* eslint-disable @typescript-eslint/no-explicit-any */
async function safeFind(resource: string, query: Record<string, unknown>) {
  try {
    return await find(resource, query);
  } catch (err) {
    console.error(`[sitemap] failed to load ${resource}:`, err);
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [readingPassages, listeningSections, writingTasks] = await Promise.all([
    safeFind("reading-passages", {
      filters: { test: { is_published: { $eq: true } } },
      populate: { test: { fields: ["title", "updatedAt", "slug"] } },
      fields: ["passage_number"],
    }),
    safeFind("listening-sections", {
      filters: { test: { is_published: { $eq: true } } },
      populate: { test: { fields: ["title", "updatedAt", "slug"] } },
      fields: ["section_number"],
    }),
    safeFind("writing-tasks", {
      filters: { test: { is_published: { $eq: true } } },
      populate: { test: { fields: ["title", "updatedAt", "slug"] } },
      fields: ["task_number"],
    }),
  ]);

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/dashboard/reading`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/dashboard/listening`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/dashboard/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/ielts-tips`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/for-business`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
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
      const slug = test.slug ?? test.documentId;
      const key = `${module}/${slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      routes.push({
        url: `${BASE}/dashboard/${module}/${slug}`,
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
