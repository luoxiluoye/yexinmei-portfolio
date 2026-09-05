import type { MetadataRoute } from "next";

import { getQuestSlugs } from "@/data/quests";
import { SITE_URL } from "@/lib/site-metadata";

const staticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/player", changeFrequency: "monthly", priority: 0.9 },
  { path: "/quests", changeFrequency: "weekly", priority: 0.9 },
  { path: "/inventory", changeFrequency: "monthly", priority: 0.7 },
  { path: "/journal", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const questPages: MetadataRoute.Sitemap = getQuestSlugs().map(({ slug }) => ({
    url: `${SITE_URL}/quests/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...pages, ...questPages];
}
