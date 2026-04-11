import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { narrativeWorks } from "@/app/data/artworks";
import { LightboxGrid } from "@/app/components/LightboxGrid";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const { heading: title, kicker: description } = dict.gallery.digitalArt;
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/gallery/digital-art`,
      languages: {
        "en": "https://carlotasoto.com/en/gallery/digital-art",
        "fr": "https://carlotasoto.com/fr/gallery/digital-art"
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/gallery/digital-art` },
    twitter: { title, description }
  };
}

export default async function DigitalArtPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const g = dict.gallery.digitalArt;

  return (
    <main className="with-header-offset">
      <section className="section panel">
        <div className="section-header">
          <h2 className="section-title">{g.heading}</h2>
          <p className="section-kicker">{g.kicker}</p>
        </div>
        <div className="gallery-board">
          <LightboxGrid artworks={narrativeWorks} />
        </div>
      </section>
    </main>
  );
}
