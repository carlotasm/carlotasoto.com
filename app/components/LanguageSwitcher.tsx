"use client";

import { usePathname } from "next/navigation";
import type { Lang } from "@/app/lib/dictionaries";

type Props = { lang: Lang };

export function LanguageSwitcher({ lang }: Props) {
  const pathname = usePathname();
  const otherLang: Lang = lang === "en" ? "fr" : "en";
  const otherPath = pathname.replace(`/${lang}`, `/${otherLang}`);
  const otherLabel = otherLang === "en" ? "English" : "French";

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {lang === "en" ? (
        <>
          <span className="lang-switcher__active" aria-current="true">EN</span>
          <span className="lang-switcher__sep" aria-hidden="true">/</span>
          <a href={otherPath} className="lang-switcher__link" aria-label={`Switch to ${otherLabel}`}>
            FR
          </a>
        </>
      ) : (
        <>
          <a href={otherPath} className="lang-switcher__link" aria-label={`Switch to ${otherLabel}`}>
            EN
          </a>
          <span className="lang-switcher__sep" aria-hidden="true">/</span>
          <span className="lang-switcher__active" aria-current="true">FR</span>
        </>
      )}
    </div>
  );
}
