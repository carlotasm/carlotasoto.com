import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { collections, getCollection } from "@/app/data/artworks";
import { ArtStrip } from "@/app/components/ArtStrip";
import { pageMetadata } from "@/app/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return langs.flatMap((lang) =>
    collections.map((collection) => ({ lang, slug: collection.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const collection = getCollection(slug);
  if (!collection) return {};
  return pageMetadata({
    lang,
    path: `/gallery/archives/${slug}`,
    title: collection.name,
    description: `${collection.name} — ${collection.works.length} ${dict.gallery.pieces}. ${dict.gallery.collections.kicker}`,
    image: collection.cover ?? collection.works[0]?.image
  });
}

export default async function CollectionDetailPage({ params }: Props) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const collection = getCollection(slug);
  if (!collection) notFound();

  return (
    <main className="gallery-stage">
      <ArtStrip
        artworks={collection.works}
        back={{ href: `/${lang}/gallery/archives`, label: dict.gallery.collections.heading }}
        nextLabel={dict.hero.next}
        prevLabel={dict.hero.prev}
      />
    </main>
  );
}
