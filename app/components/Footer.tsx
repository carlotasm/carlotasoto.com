// This component needs client-side interactivity for deep links.
"use client";

import type { MouseEvent } from "react";
import { CONTACT_EMAIL, CONTACT_EMAIL_MAILTO } from "../lib/constants";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import type { Lang } from "@/app/lib/dictionaries";

const INSTAGRAM_WEB_URL = "https://www.instagram.com/carlotasotom/";
const INSTAGRAM_DEEP_LINK = "instagram://user?username=carlotasotom";
const TIKTOK_WEB_URL = "https://www.tiktok.com/@carlotasotom";
const TIKTOK_DEEP_LINK = "tiktok://user/@carlotasotom";

// Try opening the app via deep link; fall back to the web profile if it fails.
const handleDeeplinkClick =
  (deeplink: string, webUrl: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;

    event.preventDefault();

    let fallbackTimer: number | undefined;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    fallbackTimer = window.setTimeout(() => {
      window.location.href = webUrl;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, 700);

    window.location.href = deeplink;
  };

type FooterProps = { lang: Lang };

export function Footer({ lang }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-name">© {year} Carlota Soto</span>
        <span className="footer-divider">·</span>
        <a href={CONTACT_EMAIL_MAILTO}>{CONTACT_EMAIL}</a>
        <span className="footer-divider">·</span>
        <a
          href={INSTAGRAM_WEB_URL}
          onClick={handleDeeplinkClick(INSTAGRAM_DEEP_LINK, INSTAGRAM_WEB_URL)}
          target="_blank"
          rel="noreferrer"
          className="footer-icon"
          aria-label="Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 3C5.239 3 3 5.239 3 8v8c0 2.761 2.239 5 5 5h8c2.761 0 5-2.239 5-5V8c0-2.761-2.239-5-5-5H8zm10 2a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
          <span className="sr-only">Instagram</span>
        </a>
        <span className="footer-divider">·</span>
        <a
          href={TIKTOK_WEB_URL}
          onClick={handleDeeplinkClick(TIKTOK_DEEP_LINK, TIKTOK_WEB_URL)}
          target="_blank"
          rel="noreferrer"
          className="footer-icon"
          aria-label="TikTok"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 3C4.355 3 3 4.355 3 6v12c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V6c0-1.645-1.355-3-3-3H6zm6 4h2c0 1.005 1.471 2 2 2v2c-.605 0-1.332-.266-2-.715V14c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3v2c-.552 0-1 .449-1 1s.448 1 1 1 1-.449 1-1V7z" />
          </svg>
          <span className="sr-only">TikTok</span>
        </a>
        <span className="footer-divider">·</span>
        <LanguageSwitcher lang={lang} />
      </div>
    </footer>
  );
}
