import { langs, isValidLang } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";

export const DEFAULT_LANG: Lang = "en";

/**
 * Pick the site language from an Accept-Language header, honouring the
 * browser's own preference order (q-values). Falls back to English.
 */
export function detectLang(acceptLanguage: string | null | undefined): Lang {
  if (!acceptLanguage) return DEFAULT_LANG;

  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0, index };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isValidLang(base)) return base;
  }
  return DEFAULT_LANG;
}

export { langs };
