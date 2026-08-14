import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { observationalWorks } from "@/app/data/artworks";
import { LightboxGrid } from "@/app/components/LightboxGrid";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const { heading: title, kicker: description } = dict.gallery.observational;
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/gallery/observational-drawings`,
      languages: {
        en: "https://carlotasoto.com/en/gallery/observational-drawings",
        fr: "https://carlotasoto.com/fr/gallery/observational-drawings"
      }
    },
    openGraph: {
      title,
      description,
      url: `https://carlotasoto.com/${lang}/gallery/observational-drawings`
    },
    twitter: { title, description }
  };
}

export default async function ObservationalDrawingsPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const g = dict.gallery.observational;

  return (
    <main className="with-header-offset">
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{g.heading}</h2>
          <p className="section-kicker">{g.kicker}</p>
        </div>
        {observationalWorks.length > 0 ? (
          <div className="gallery-board">
            <LightboxGrid artworks={observationalWorks} />
          </div>
        ) : (
          <p className="section-kicker align-center">{g.empty}</p>
        )}
      </section>
    </main>
  );
}
