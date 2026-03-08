import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { sketchWorks } from "@/app/data/artworks";
import { LightboxGrid } from "@/app/components/LightboxGrid";

type Props = { params: { lang: Lang } };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
  const dict = getDictionary(lang);
  const { heading: title, kicker: description } = dict.gallery.sketches;
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/gallery/sketches`,
      languages: {
        "en": "https://carlotasoto.com/en/gallery/sketches",
        "fr": "https://carlotasoto.com/fr/gallery/sketches"
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/gallery/sketches` },
    twitter: { title, description }
  };
}

export default function SketchesPage({ params: { lang } }: Props) {
  const dict = getDictionary(lang);
  const g = dict.gallery.sketches;

  return (
    <main className="with-header-offset">
      <section className="section panel">
        <div className="section-header">
          <h2 className="section-title">{g.heading}</h2>
          <p className="section-kicker">{g.kicker}</p>
        </div>
        <div className="gallery-board">
          <LightboxGrid artworks={sketchWorks} />
        </div>
      </section>
    </main>
  );
}
