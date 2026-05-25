import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { collections, getCollection } from "@/app/data/artworks";
import { LightboxGrid } from "@/app/components/LightboxGrid";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return langs.flatMap((lang) =>
    collections.map((collection) => ({ lang, slug: collection.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Lang;
  const collection = getCollection(slug);
  if (!collection) return {};
  const title = collection.name;
  const description = `${collection.name} — ${collection.works.length} pieces.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/gallery/archives/${slug}`,
      languages: {
        en: `https://carlotasoto.com/en/gallery/archives/${slug}`,
        fr: `https://carlotasoto.com/fr/gallery/archives/${slug}`
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/gallery/archives/${slug}` },
    twitter: { title, description }
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const collection = getCollection(slug);
  if (!collection) notFound();

  return (
    <main className="with-header-offset">
      <section className="section">
        <div className="section-header">
          <a className="collection-back" href={`/${lang}/gallery/archives`}>
            ← {dict.gallery.collections.heading}
          </a>
          <h2 className="section-title">{collection.name}</h2>
        </div>
        <div className="gallery-board">
          <LightboxGrid artworks={collection.works} />
        </div>
      </section>
    </main>
  );
}
