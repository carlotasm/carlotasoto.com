import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { allWorks } from "@/app/data/artworks";
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
    path: "/gallery",
    title: dict.gallery.heading,
    description: dict.gallery.kicker,
    image: allWorks[0]?.image
  });
}

export default async function GalleryIndex({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  return (
    <main className="gallery-stage">
      <ArtStrip
        artworks={allWorks}
        nextLabel={dict.hero.next}
        prevLabel={dict.hero.prev}
      />
    </main>
  );
}
