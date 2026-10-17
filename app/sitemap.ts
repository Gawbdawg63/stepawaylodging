import type { MetadataRoute } from "next";
import { properties, brand } from "@/lib/content";
import { events } from "@/lib/events";
import { posts } from "@/lib/blog";
import { areas } from "@/lib/areas";
import { collections } from "@/lib/collections";

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
    ...posts.map((p) => entry(`/blog/${p.slug}`, 0.6)),
  ];
}
