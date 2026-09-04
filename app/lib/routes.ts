import { collections } from "@/app/data/artworks";

export type SiteRoute = {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

/** Every public, language-prefixed page. Single source of truth for the sitemap. */
export const siteRoutes: SiteRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.9 },
  { path: "/gallery/archives", changeFrequency: "monthly", priority: 0.7 },
  ...collections.map((collection) => ({
    path: `/gallery/archives/${collection.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7
  })),
  { path: "/gallery/sketches", changeFrequency: "monthly", priority: 0.7 },
  { path: "/gallery/observational-drawings", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/inquiries", changeFrequency: "yearly", priority: 0.6 }
];
