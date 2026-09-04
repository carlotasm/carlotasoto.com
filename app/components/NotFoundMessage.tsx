"use client";

import { usePathname } from "next/navigation";
import { getDictionary, isValidLang } from "@/app/lib/dictionaries";
import { StageLock } from "@/app/components/StageLock";

/** 404 copy in the language of the current URL, falling back to English. */
export function NotFoundMessage() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const lang = isValidLang(segment) ? segment : "en";
  const dict = getDictionary(lang);

  return (
    <main className="not-found-stage">
      <StageLock />
      <h1 className="not-found__title">{dict.notFound.title}</h1>
      <a className="not-found__back" href={`/${lang}`}>
        {dict.notFound.back}
      </a>
    </main>
  );
}
