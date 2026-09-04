"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Dictionary, Lang } from "@/app/lib/dictionaries";

type NavDict = Dictionary["nav"];

type Props = {
  dict: NavDict;
  lang: Lang;
};

export function Header({ dict, lang }: Props) {
  const pathname = usePathname();
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
  const isActive = (href: string) => {
    const path = href.split("#")[0];
    if (!path.startsWith(`/${lang}`)) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  const [scrolled, setScrolled] = useState(false);
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
        { label: dict.collections, href: `/${lang}/gallery/archives` },
        { label: dict.sketches, href: `/${lang}/gallery/sketches` },
        { label: dict.observational, href: `/${lang}/gallery/observational-drawings` }
      ]
    },
    { label: dict.about, href: `/${lang}/about` },
    { label: dict.contact, href: `/${lang}/inquiries` }
  ];

  const rightNav = [
    { label: dict.shop, href: "https://store.carlotasoto.com", isExternal: false }
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
    if (isHome) {
      setScrolled(false);
      setHidden(false);
      return;
    }
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
    // Sync initial state — handles refreshes / anchor loads where y > 0 on mount.
    // We only sync `scrolled`; we don't apply the hide-on-going-down logic on
    // first paint since the user hasn't actually scrolled yet.
    const initialY = window.scrollY;
    setScrolled(initialY > 20);
    lastY.current = initialY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen, isHome]);

  const dropdownOpen = hoverGallery || (isMobile && mobileGalleryOpen);
  // Couple the bg overlay to visibility: when the header is hidden, also drop
  // --bg so the overlay fades out alongside the slide-up. On scroll-back-up,
  // both the transform and the overlay animate back in together.
  // The gallery dropdown is its own panel now, so it no longer tints the header.
  const showBg = !hidden && (scrolled || mobileOpen);

  return (
    <header
      className={`site-header ${showBg ? "site-header--bg" : ""} ${
        hidden ? "site-header--hidden" : ""
      } ${isHome ? "site-header--overlay" : ""}`}
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
          <svg className="mobile-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path className="mobile-toggle__line mobile-toggle__line--top" d="M4 7H20" />
            <path className="mobile-toggle__line mobile-toggle__line--mid" d="M4 12H20" />
            <path className="mobile-toggle__line mobile-toggle__line--bottom" d="M4 17H20" />
          </svg>
        </button>

        <a href={`/${lang}`} className="nav-logo" aria-label="Home">
          Carlota Soto
        </a>

        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={toggleMobileMenu}
        />

        <div className="nav-items">
          <div className="nav-group">
            {leftNav.map((item) =>
              item.children ? (
                <div
                  className={`nav-item has-dropdown ${
                    isMobile && mobileGalleryOpen ? "is-mobile-open" : ""
                  } ${isActive(item.href) ? "is-active" : ""}`}
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
                    <div className="nav-dropdown__inner">
                      {item.children.map((child) => (
                        <a key={child.label} href={child.href} onClick={handleNavClick}>
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`nav-item ${isActive(item.href) ? "is-active" : ""}`} key={item.label}>
                  <a href={item.href} onClick={handleNavClick}>
                    {item.label}
                  </a>
                </div>
              )
            )}
          </div>

          <div className="nav-group">
            {rightNav.map((item) => (
              <div className={`nav-item ${isActive(item.href) ? "is-active" : ""}`} key={item.label}>
                <a
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noreferrer" : undefined}
                  onClick={handleNavClick}
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>

          <div className="nav-group nav-social">
            <a
              href="https://www.instagram.com/carlotasotom/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="nav-social__link"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle className="nav-social__dot" cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@carlotasotom"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="nav-social__link"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 7.9v4a9.9 9.9 0 0 1 -5 -1.95v4.55a6.5 6.5 0 1 1 -8 -6.33v4.33a2.5 2.5 0 1 0 4 2v-11.5h4.08a6 6 0 0 0 4.92 4.9z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
