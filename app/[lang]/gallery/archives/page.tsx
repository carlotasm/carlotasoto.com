import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { collections } from "@/app/data/artworks";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const { heading: title, kicker: description } = dict.gallery.collections;
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/gallery/archives`,
      languages: {
        en: "https://carlotasoto.com/en/gallery/archives",
        fr: "https://carlotasoto.com/fr/gallery/archives"
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/gallery/archives` },
    twitter: { title, description }
  };
}

export default async function CollectionsPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const g = dict.gallery.collections;

  return (
    <main className="with-header-offset">
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{g.heading}</h2>
          <p className="section-kicker">{g.kicker}</p>
        </div>
        <div className="collection-grid">
          {collections.map((collection) => {
            const cover = collection.cover ?? collection.works[0]?.image;
            return (
              <a
                key={collection.slug}
                href={`/${lang}/gallery/archives/${collection.slug}`}
                className="collection-card"
              >
                <span
                  className="collection-card__visual"
                  style={cover ? { backgroundImage: `url('${cover}')` } : undefined}
                  aria-hidden="true"
                />
                <span className="collection-card__overlay">
                  <span className="collection-card__name">{collection.name}</span>
                  <span className="collection-card__count">
                    {collection.works.length} {dict.gallery.pieces}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
