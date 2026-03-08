import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";

type Props = { params: { lang: Lang } };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
  const dict = getDictionary(lang);
  const title = dict.shop.heading;
  const description = dict.shop.kicker;
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/shop`,
      languages: {
        "en": "https://carlotasoto.com/en/shop",
        "fr": "https://carlotasoto.com/fr/shop"
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/shop` },
    twitter: { title, description }
  };
}

export default function ShopPage({ params: { lang } }: Props) {
  const dict = getDictionary(lang);
  const s = dict.shop;

  return (
    <main className="with-header-offset">
      <section className="section panel">
        <div className="section-header">
          <h2 className="section-title">{s.heading}</h2>
          <p className="section-kicker">{s.kicker}</p>
        </div>
        <div className="gallery-board" style={{ textAlign: "center" }}>
          <h3 className="section-title" style={{ marginBottom: "0.6rem" }}>
            {s.comingSoon}
          </h3>
          <p className="section-kicker">{s.comingSoonKicker}</p>
        </div>
      </section>
    </main>
  );
}
