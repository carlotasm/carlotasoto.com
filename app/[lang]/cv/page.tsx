import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const title = dict.cv.heading;
  const description = dict.cv.body;
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/cv`,
      languages: {
        en: "https://carlotasoto.com/en/cv",
        fr: "https://carlotasoto.com/fr/cv"
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/cv` },
    twitter: { title, description }
  };
}

export default async function CvPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);

  return (
    <main className="with-header-offset full-height">
      <section className="section contact" id="cv">
        <div className="contact-card">
          <div>
            <h2 className="section-title">{dict.cv.heading}</h2>
            <p className="contact-copy">{dict.cv.body}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
