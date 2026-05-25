import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { AboutSection } from "@/app/sections/AboutSection";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const title = dict.about.heading;
  const description = dict.about.bio.slice(0, 160);
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/about`,
      languages: {
        en: "https://carlotasoto.com/en/about",
        fr: "https://carlotasoto.com/fr/about"
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/about` },
    twitter: { title, description }
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);

  return (
    <main className="with-header-offset">
      <AboutSection dict={dict.about} lang={lang} />
    </main>
  );
}
