import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { SplitPage } from "@/app/components/SplitPage";
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
    path: "/about",
    title: dict.about.heading,
    description: dict.about.bio,
    image: "/assets/images/aboutmepfp2.jpg"
  });
}

export default async function AboutPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);

  return (
    <SplitPage
      title={dict.about.heading}
      description={dict.about.bio}
    >
      <img className="split__image" src="/assets/images/aboutmepfp2.jpg" alt="Carlota Soto" />
    </SplitPage>
  );
}
