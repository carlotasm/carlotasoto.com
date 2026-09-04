import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { sketchWorks } from "@/app/data/artworks";
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
    path: "/gallery/sketches",
    title: dict.gallery.sketches.heading,
    description: dict.gallery.sketches.kicker,
    image: sketchWorks[0]?.image
  });
}

export default async function SketchesPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  return (
    <main className="gallery-stage">
      <ArtStrip
        artworks={sketchWorks}
        nextLabel={dict.hero.next}
        prevLabel={dict.hero.prev}
      />
    </main>
  );
}
