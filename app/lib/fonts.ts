import { Playfair_Display, Cormorant_Garamond, Manrope, Caveat } from "next/font/google";

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

/** Class list that exposes every Google font as a CSS variable on <body>. */
export const bodyFontClass = `${playfair.variable} ${cormorant.variable} ${manrope.variable} ${caveat.variable} antialiased`;
