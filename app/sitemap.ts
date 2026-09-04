import type { MetadataRoute } from "next";
import { langs } from "@/app/lib/dictionaries";
import { SITE_URL } from "@/app/lib/constants";
import { siteRoutes } from "@/app/lib/routes";

// Generated at build time, so lastModified reflects the last deploy.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return langs.flatMap((lang) =>
    siteRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(langs.map((l) => [l, `${SITE_URL}/${l}${path}`])),
          "x-default": `${SITE_URL}/en${path}`
        }
      }
    }))
  );
}
