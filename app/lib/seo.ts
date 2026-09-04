import type { Metadata } from "next";
import { OG_IMAGE, SITE_URL } from "@/app/lib/constants";
import { langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";

export const SITE_NAME = "Carlota Soto";

const OG_LOCALES: Record<Lang, string> = { en: "en_CA", fr: "fr_CA" };

/** Trim a description to ~160 chars on a word boundary for search snippets. */
export function snippet(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

type PageMeta = {
  lang: Lang;
  /** Path after the language segment, e.g. "/gallery/sketches". "" for the home page. */
  path: string;
  title: string;
  description: string;
  /** Public path of a share image, e.g. "/artworks/paintings/x.jpg". Falls back to the site portrait. */
  image?: string;
  /** Use the title as-is instead of running it through the "%s | Carlota Soto" template. */
  absoluteTitle?: boolean;
};

/** Canonical, hreflang, Open Graph and Twitter tags for one localized page. */
export function pageMetadata({ lang, path, title, description, image, absoluteTitle }: PageMeta): Metadata {
  const url = `${SITE_URL}/${lang}${path}`;
  const shareImage = image ? `${SITE_URL}${image}` : OG_IMAGE;
  const languages = Object.fromEntries(langs.map((l) => [l, `${SITE_URL}/${l}${path}`]));
  const shortDescription = snippet(description);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: shortDescription,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": `${SITE_URL}/en${path}` }
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[lang],
      alternateLocale: langs.filter((l) => l !== lang).map((l) => OG_LOCALES[l]),
      url,
      title,
      description: shortDescription,
      images: [{ url: shareImage, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: shortDescription,
      images: [shareImage]
    }
  };
}
