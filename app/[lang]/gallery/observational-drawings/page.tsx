import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { observationalWorks } from "@/app/data/artworks";
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
    path: "/gallery/observational-drawings",
    title: dict.gallery.observational.heading,
    description: dict.gallery.observational.kicker,
    image: observationalWorks[0]?.image
  });
}

export default async function ObservationalDrawingsPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const g = dict.gallery.observational;

  return (
    <main className="gallery-stage">
      <ArtStrip
        artworks={observationalWorks}
        emptyMessage={g.empty}
        nextLabel={dict.hero.next}
        prevLabel={dict.hero.prev}
      />
    </main>
  );
}
