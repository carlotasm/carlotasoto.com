import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { SearchableGallery } from "@/app/components/SearchableGallery";
import { allWorks } from "@/app/data/artworks";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  return {
    title: "Carlota Soto | Portfolio",
    description: dict.about.bio,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}`,
      languages: {
        "en": "https://carlotasoto.com/en",
        "fr": "https://carlotasoto.com/fr"
      }
    },
    openGraph: {
      title: "Carlota Soto | Portfolio",
      description: dict.about.bio,
      url: `https://carlotasoto.com/${lang}`,
      type: "website"
    },
    twitter: {
      title: "Carlota Soto | Portfolio",
      description: dict.about.bio
    }
  };
}

export default async function Home({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);

  return (
    <main className="with-header-offset">
      <section className="section gallery" id="gallery">
        <SearchableGallery
          artworks={allWorks}
          searchPlaceholder={dict.gallery.searchPlaceholder}
          piecesLabel={dict.gallery.pieces}
        />
      </section>
    </main>
  );
}
