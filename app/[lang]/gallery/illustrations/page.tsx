import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { altWorks } from "@/app/data/artworks";
import { LightboxGrid } from "@/app/components/LightboxGrid";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const { heading: title, kicker: description } = dict.gallery.illustrations;
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/gallery/illustrations`,
      languages: {
        "en": "https://carlotasoto.com/en/gallery/illustrations",
        "fr": "https://carlotasoto.com/fr/gallery/illustrations"
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/gallery/illustrations` },
    twitter: { title, description }
  };
}

export default async function IllustrationsPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const g = dict.gallery.illustrations;

  return (
    <main className="with-header-offset">
      <section className="section panel">
        <div className="section-header">
          <h2 className="section-title">{g.heading}</h2>
          <p className="section-kicker">{g.kicker}</p>
        </div>
        <div className="gallery-board">
          <LightboxGrid artworks={altWorks} />
        </div>
      </section>
    </main>
  );
}
