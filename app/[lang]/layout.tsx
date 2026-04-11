import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: Props) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const dict = getDictionary(lang);

  return (
    <>
      <Header dict={dict.nav} lang={lang} />
      {children}
      <Footer lang={lang} />
    </>
  );
}
