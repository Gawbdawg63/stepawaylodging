import type { MetadataRoute } from "next";
import { properties, brand } from "@/lib/content";
import { events } from "@/lib/events";
import { publishedPosts } from "@/lib/blog";
import { areas } from "@/lib/areas";
import { collections } from "@/lib/collections";

// Re-evaluate daily so scheduled (future-dated) posts enter the sitemap on their day.
export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${brand.domain}`;
  const now = new Date();
  const staticPaths = ["", "/homes", "/our-story", "/central-oregon", "/owners", "/list-your-home", "/events", "/blog", "/policies"];

  const entry = (path: string, priority: number) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  });

  return [
    ...staticPaths.map((p) => entry(p, p === "" ? 1 : 0.7)),
    ...areas.map((a) => entry(`/${a.slug}`, 0.8)),
    ...collections.map((c) => entry(`/${c.slug}`, 0.7)),
    ...properties.map((p) => entry(`/homes/${p.slug}`, 0.8)),
    ...events.map((e) => entry(`/events/${e.slug}`, 0.6)),
    ...publishedPosts.map((p) => entry(`/blog/${p.slug}`, 0.6)),
  ];
}
