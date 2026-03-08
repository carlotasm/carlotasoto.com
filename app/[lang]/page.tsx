import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { HeroSection } from "@/app/sections/HeroSection";
import { AboutSection } from "@/app/sections/AboutSection";
import { CONTACT_EMAIL } from "@/app/lib/constants";

type Props = { params: { lang: Lang } };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
  const dict = getDictionary(lang);
  return {
    title: "Carlota Soto | Portfolio",
    description: dict.about.bio,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}`,
      languages: {
        "en": "https://carlotasoto.com/en",
        "fr": "https://carlotasoto.com/fr"
      }
    },
    openGraph: {
      title: "Carlota Soto | Portfolio",
      description: dict.about.bio,
      url: `https://carlotasoto.com/${lang}`,
      type: "website"
    },
    twitter: {
      title: "Carlota Soto | Portfolio",
      description: dict.about.bio
    }
  };
}

export default function Home({ params: { lang } }: Props) {
  const dict = getDictionary(lang);

  return (
    <div className="homepage">
      <HeroSection dict={dict.hero} />
      <main className="panel">
        <AboutSection dict={dict.about} lang={lang} />
        <section className="section contact" id="contact">
          <div className="contact-card">
            <div>
              <p className="section-kicker">{dict.contact.kicker}</p>
              <h3 className="section-title">{dict.contact.heading}</h3>
              <p className="contact-copy">
                {dict.contact.copy.replace("{email}", CONTACT_EMAIL)}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
