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
        { label: dict.sketches, href: `/${lang}/gallery/sketches` }
      ]
    },
    { label: dict.about, href: `/${lang}/about` },
    { label: dict.contact, href: `/${lang}/inquiries` }
  ];

  const rightNav = [
    { label: dict.cv, href: `/${lang}/cv`, isExternal: false },
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
  }, [mobileOpen]);

  const dropdownOpen = hoverGallery || (isMobile && mobileGalleryOpen);
  // Couple the bg overlay to visibility: when the header is hidden, also drop
  // --bg so the overlay fades out alongside the slide-up. On scroll-back-up,
  // both the transform and the overlay animate back in together.
  const showBg = !hidden && (scrolled || dropdownOpen || mobileOpen);

  return (
    <header
      className={`site-header ${showBg ? "site-header--bg" : ""} ${
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

        <a href={`/${lang}`} className="nav-logo" aria-label="Home">
          Carlota Soto
        </a>

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
                    {item.children.map((child) => (
                      <a key={child.label} href={child.href} onClick={handleNavClick}>
                        {child.label}
                      </a>
                    ))}
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
        </div>
      </nav>
    </header>
  );
}
