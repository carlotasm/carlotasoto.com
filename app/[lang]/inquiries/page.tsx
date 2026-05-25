import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { CONTACT_EMAIL } from "@/app/lib/constants";
import { ContactForm } from "@/app/components/ContactForm";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);
  const title = dict.contact.heading;
  const description = dict.contact.copy.replace("{email}", CONTACT_EMAIL);
  return {
    title,
    description,
    alternates: {
      canonical: `https://carlotasoto.com/${lang}/inquiries`,
      languages: {
        en: "https://carlotasoto.com/en/inquiries",
        fr: "https://carlotasoto.com/fr/inquiries"
      }
    },
    openGraph: { title, description, url: `https://carlotasoto.com/${lang}/inquiries` },
    twitter: { title, description }
  };
}

export default async function ContactPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);

  return (
    <main className="with-header-offset">
      <section className="section contact" id="contact">
        <div className="contact-card">
          <div>
            <h2 className="section-title">{dict.contact.heading}</h2>
            <p className="contact-copy">
              {dict.contact.copy.replace("{email}", CONTACT_EMAIL)}
            </p>
          </div>
        </div>
        <ContactForm lang={lang} />
      </section>
    </main>
  );
}
