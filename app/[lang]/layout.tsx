import type { Metadata } from "next";
import "@/app/globals.css";
import { bodyFontClass } from "@/app/lib/fonts";
import { OG_IMAGE, SITE_URL } from "@/app/lib/constants";
import { SITE_NAME } from "@/app/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Portfolio`,
    template: `%s | ${SITE_NAME}`
  },
  description:
    "Carlota Soto — painter and digital illustrator. Explore paintings, illustrations, digital art, and sketches.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: OG_IMAGE, width: 800, height: 800, alt: "Carlota Soto — painter & digital illustrator" }]
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" }
  }
};

import { notFound } from "next/navigation";
import { getDictionary, isValidLang, langs } from "@/app/lib/dictionaries";
import { Header } from "@/app/components/Header";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  // Unknown language segments fall through to the global 404 document.
  if (!isValidLang(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang}>
      <body className={bodyFontClass}>
        <Header dict={dict.nav} lang={lang} />
        {children}
      </body>
    </html>
  );
}
