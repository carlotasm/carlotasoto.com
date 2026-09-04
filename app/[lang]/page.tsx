import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { HeroSlideshow } from "@/app/components/HeroSlideshow";
import { heroSlides } from "@/app/data/heroSlides";
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
    path: "",
    title: "Carlota Soto | Portfolio",
    absoluteTitle: true,
    description: dict.about.bio,
    image: heroSlides[0]?.image
  });
}

export default async function Home({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);

  return (
    <main className="home-stage">
      <HeroSlideshow
        slides={heroSlides}
        categoryLabels={dict.hero.categories}
        nextLabel={dict.hero.next}
        prevLabel={dict.hero.prev}
        viewLabel={dict.hero.view}
      />
    </main>
  );
}
