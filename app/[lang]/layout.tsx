import { getDictionary, langs } from "@/app/lib/dictionaries";
import type { Lang } from "@/app/lib/dictionaries";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

type Props = {
  children: React.ReactNode;
  params: { lang: Lang };
};

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export default function LangLayout({ children, params: { lang } }: Props) {
  const dict = getDictionary(lang);

  return (
    <>
      <Header dict={dict.nav} lang={lang} />
      {children}
      <Footer />
    </>
  );
}
