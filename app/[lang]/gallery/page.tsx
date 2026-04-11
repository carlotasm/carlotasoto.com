import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { allWorks } from "@/app/data/artworks";
import { SearchableGallery } from "@/app/components/SearchableGallery";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const title = dict.gallery.heading;
  const description = dict.gallery.kicker;
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/gallery`,
      languages: {
        "en": "https://carlotasoto.com/en/gallery",
        "fr": "https://carlotasoto.com/fr/gallery"
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/gallery` },
    twitter: { title, description }
  };
}

export default async function GalleryIndex({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const g = dict.gallery;

  return (
    <main className="with-header-offset">
      <section className="section panel" id="gallery">
        <div className="section-header">
          <h2 className="section-title">{g.heading}</h2>
          <p className="section-kicker">{g.kicker}</p>
        </div>
        <SearchableGallery
          artworks={allWorks}
          searchPlaceholder={g.searchPlaceholder}
          piecesLabel={g.pieces}
        />
      </section>
    </main>
  );
}
