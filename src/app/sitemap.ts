import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/profile";
import { projects } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [
    { url: siteUrl, priority: 1 },
    { url: `${siteUrl}/portfolio`, priority: 0.9 },
    ...projects.map(({ slug }) => ({
      url: `${siteUrl}/projects/${slug}`,
      priority: 0.8,
    })),
  ];
}
