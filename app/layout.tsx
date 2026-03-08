import type { Metadata } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Manrope,
  Caveat
} from "next/font/google";
import "./globals.css";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif"
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans"
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-script"
});

export const metadata: Metadata = {
  title: {
    default: "Carlota Soto | Portfolio",
    template: "%s | Carlota Soto"
  },
  description:
    "Carlota Soto — painter and digital illustrator. Explore paintings, illustrations, digital art, and sketches.",
  metadataBase: new URL("https://carlotasoto.com"),
  openGraph: {
    siteName: "Carlota Soto",
    type: "website",
    images: [
      {
        url: "/assets/images/aboutmepfp.png",
        width: 800,
        height: 800,
        alt: "Carlota Soto — painter & digital illustrator"
      }
    ]
  },
  twitter: {
    card: "summary",
    images: ["/assets/images/aboutmepfp.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${manrope.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
