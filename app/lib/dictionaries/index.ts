import { en } from "./en";
import { fr } from "./fr";

export type { Dictionary } from "./en";

const dictionaries = { en, fr };

export type Lang = keyof typeof dictionaries;

export const langs: Lang[] = ["en", "fr"];

export function getDictionary(lang: string): (typeof en) {
  return (dictionaries as Record<string, typeof en>)[lang] ?? dictionaries.en;
}

export function isValidLang(lang: string): lang is Lang {
  return lang in dictionaries;
}
