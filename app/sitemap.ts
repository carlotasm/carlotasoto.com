import type { MetadataRoute } from "next";
import { langs } from "@/app/lib/dictionaries";
import { SITE_URL } from "@/app/lib/constants";

const routes = [
  "",
  "/gallery",
  "/gallery/illustrations",
  "/gallery/digital-art",
  "/gallery/paintings",
  "/gallery/sketches",
  "/shop"
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
