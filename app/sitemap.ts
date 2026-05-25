import type { MetadataRoute } from "next";
import { langs } from "@/app/lib/dictionaries";
import { SITE_URL } from "@/app/lib/constants";
import { collections } from "@/app/data/artworks";

const routes = [
  "",
  "/gallery",
  "/gallery/archives",
  ...collections.map((collection) => `/gallery/archives/${collection.slug}`),
  "/gallery/sketches",
  "/cv",
  "/inquiries"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return langs.flatMap((lang) =>
    routes.map((route) => ({
      url: `${SITE_URL}/${lang}${route}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          langs.map((l) => [l, `${SITE_URL}/${l}${route}`])
        )
      }
    }))
  );
}
