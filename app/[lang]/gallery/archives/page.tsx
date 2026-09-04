import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { collections } from "@/app/data/artworks";
import { ArtStrip } from "@/app/components/ArtStrip";
import { pageMetadata } from "@/app/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/gallery/archives",
    title: dict.gallery.collections.heading,
    description: dict.gallery.collections.kicker,
    image: collections[0]?.cover ?? collections[0]?.works[0]?.image
  });
}

export default async function CollectionsPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  return (
    <main className="gallery-stage">
      <ArtStrip
        links={collections.map((collection) => ({
          href: `/${lang}/gallery/archives/${collection.slug}`,
          image: collection.cover ?? collection.works[0]?.image,
          title: collection.name,
          meta: `${collection.works.length} ${dict.gallery.pieces}`
        }))}
        nextLabel={dict.hero.next}
        prevLabel={dict.hero.prev}
      />
    </main>
  );
}
