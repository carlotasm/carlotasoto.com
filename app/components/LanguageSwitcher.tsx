"use client";

import { usePathname } from "next/navigation";
import type { Lang } from "@/app/lib/dictionaries";

type Props = { lang: Lang };

export function LanguageSwitcher({ lang }: Props) {
  const pathname = usePathname();
  const otherLang: Lang = lang === "en" ? "fr" : "en";
  const otherPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  return (
    <a href={otherPath} className="lang-switcher" aria-label={`Switch to ${otherLang === "en" ? "English" : "French"}`}>
      {otherLang.toUpperCase()}
    </a>
  );
}
