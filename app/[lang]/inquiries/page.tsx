import type { Metadata } from "next";
import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { CONTACT_EMAIL } from "@/app/lib/constants";
import { ContactForm } from "@/app/components/ContactForm";
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
    path: "/inquiries",
    title: dict.contact.heading,
    description: dict.contact.copy.replace("{email}", CONTACT_EMAIL)
  });
}

export default async function ContactPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);

  return (
    <SplitPage
      title={dict.contact.heading}
      description={dict.contact.copy.replace("{email}", CONTACT_EMAIL)}
    >
      <ContactForm lang={lang} />
    </SplitPage>
  );
}
