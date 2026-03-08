"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import type { Dictionary, Lang } from "@/app/lib/dictionaries";

type NavDict = Dictionary["nav"];

type Props = {
  dict: NavDict;
  lang: Lang;
};

export function Header({ dict, lang }: Props) {
  const [cvPopupOpen, setCvPopupOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = cvPopupOpen ? "hidden" : "";
    document.body.style.overflow = cvPopupOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [cvPopupOpen]);
  const [hidden, setHidden] = useState(false);
  const [hoverGallery, setHoverGallery] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lastY = useRef(0);
  const lastOpen = useRef(0);
  const lastGalleryTap = useRef(0);
  const OPEN_COOLDOWN_MS = 320;
  const DOUBLE_TAP_MS = 400;

  const leftNav = [
    {
      label: dict.gallery,
      href: `/${lang}/gallery`,
      children: [
        { label: dict.illustrations, href: `/${lang}/gallery/illustrations` },
        { label: dict.digitalArt, href: `/${lang}/gallery/digital-art` },
        { label: dict.paintings, href: `/${lang}/gallery/paintings` },
        { label: dict.sketches, href: `/${lang}/gallery/sketches` }
      ]
    },
    { label: dict.contact, href: `/${lang}#contact` }
  ];

  const rightNav = [
    { label: dict.cv, href: `/${lang}#cv`, isCv: true },
    { label: dict.shop, href: "https://store.carlotasoto.com", isCv: false }
  ];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
      setMobileGalleryOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (mobileOpen) {
      setHidden(false);
      lastY.current = window.scrollY;
    }
  }, [mobileOpen]);

  const setDropdownOpen = (next: boolean) => {
    if (isMobile) return;
    if (next) {
      const now = performance.now();
      if (now - lastOpen.current < OPEN_COOLDOWN_MS) return;
      lastOpen.current = now;
    }
    setHoverGallery(next);
  };

  const toggleMobileMenu = () => {
    setMobileOpen((open) => {
      const next = !open;
      if (!next) setMobileGalleryOpen(false);
      return next;
    });
  };

  const toggleMobileGallery = () => {
    if (!isMobile) return;
    setMobileGalleryOpen((open) => !open);
  };

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
      setMobileGalleryOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (mobileOpen) return;
      const y = window.scrollY;
      setScrolled(y > 20);
      const goingDown = y > lastY.current;
      if (goingDown && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  const dropdownOpen = hoverGallery || (isMobile && mobileGalleryOpen);

  return (
    <header
      className={`site-header ${scrolled || dropdownOpen || mobileOpen ? "site-header--bg" : ""} ${
        hidden ? "site-header--hidden" : ""
      }`}
      data-dropdown={dropdownOpen ? "open" : "closed"}
    >
      <nav className="site-nav" data-mobile-open={mobileOpen ? "true" : "false"}>
        <button
          className={`mobile-toggle ${mobileOpen ? "is-open" : ""}`}
          type="button"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={toggleMobileMenu}
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M18 6 L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <div className="nav-group">
          {leftNav.map((item) =>
            item.children ? (
              <div
                className={`nav-item has-dropdown ${
                  isMobile && mobileGalleryOpen ? "is-mobile-open" : ""
                }`}
                key={item.label}
                onMouseEnter={() => item.label === dict.gallery && setDropdownOpen(true)}
                onMouseLeave={() => item.label === dict.gallery && setDropdownOpen(false)}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.children && isMobile) {
                      const now = performance.now();
                      const delta = now - lastGalleryTap.current;
                      lastGalleryTap.current = now;
                      if (delta < DOUBLE_TAP_MS) {
                        e.preventDefault();
                        handleNavClick();
                        window.location.href = item.href;
                        return;
                      }
                      e.preventDefault();
                      toggleMobileGallery();
                    } else {
                      handleNavClick();
                    }
                  }}
                >
                  {item.label}
                </a>
                <div
                  className="nav-dropdown"
                  onMouseEnter={() => item.label === dict.gallery && setDropdownOpen(true)}
                  onMouseLeave={() => item.label === dict.gallery && setDropdownOpen(false)}
                >
                  {item.children.map((child) => (
                    <a key={child.label} href={child.href} onClick={handleNavClick}>
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="nav-item" key={item.label}>
                <a href={item.href} onClick={handleNavClick}>
                  {item.label}
                </a>
              </div>
            )
          )}
        </div>

        <a href={`/${lang}`} className="nav-logo" aria-label="Home">
          <img src="/assets/images/logo_carlotasoto.png" alt="Carlota Soto logo" />
        </a>

        <div className="nav-group">
          {rightNav.map((item) => (
            <div className="nav-item" key={item.label}>
              <a
                href={item.isCv ? undefined : item.href}
                onClick={item.isCv ? (e) => { e.preventDefault(); setCvPopupOpen(true); } : handleNavClick}
                style={item.isCv ? { cursor: "pointer" } : undefined}
              >
                {item.label}
              </a>
            </div>
          ))}
          <div className="nav-item">
            <LanguageSwitcher lang={lang} />
          </div>
        </div>
      </nav>
      {cvPopupOpen && (
        <div className="cv-overlay" onClick={() => setCvPopupOpen(false)}>
          <div className="cv-popup-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="cv-popup__close" onClick={() => setCvPopupOpen(false)}>
              ✕
            </button>
            <div className="cv-popup">
              <p className="cv-popup__message">{dict.cvPopup}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
