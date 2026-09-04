"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import dynamic from "next/dynamic";
import lgZoom from "lightgallery/plugins/zoom";
import type { Artwork } from "@/app/data/artworks";
import { StageLock } from "@/app/components/StageLock";
import { sharedTone } from "@/app/lib/contrast";
import type { Tone } from "@/app/lib/contrast";

type LightGalleryProps = {
  speed?: number;
  plugins?: unknown[];
  elementClassNames?: string;
  mobileSettings?: { controls?: boolean; showCloseIcon?: boolean; download?: boolean };
  children?: ReactNode;
};

// lightgallery hides the close button on phones by default; keep it.
const MOBILE_SETTINGS = { controls: false, showCloseIcon: true, download: false };

const LightGallery = dynamic(() => import("lightgallery/react"), { ssr: false }) as ComponentType<LightGalleryProps>;

export type StripLink = {
  href: string;
  image?: string;
  title: string;
  meta?: string;
};

type Props = {
  /** Artworks open in the lightbox on click. */
  artworks?: Artwork[];
  /** Plain links (e.g. collection covers) navigate on click instead. */
  links?: StripLink[];
  /** Optional back link shown above the strip (collection detail pages). */
  back?: { href: string; label: string };
  emptyMessage?: string;
  nextLabel: string;
  prevLabel: string;
};

export function ArtStrip({ artworks, links, back, emptyMessage, nextLabel, prevLabel }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const prevArrow = useRef<HTMLButtonElement>(null);
  const nextArrow = useRef<HTMLButtonElement>(null);
  const [tone, setTone] = useState<Tone>("light");

  const items = artworks ?? [];
  const itemCount = links ? links.length : items.length;

  const updateArrows = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    // Arrows float over whatever cards are beneath them: one shared color for both.
    const areas = [prevArrow.current, nextArrow.current]
      .filter((a): a is HTMLButtonElement => a !== null && !a.classList.contains("is-hidden"))
      .map((a) => a.getBoundingClientRect());
    setTone(sharedTone(areas));
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    updateArrows();
    // Vertical wheel moves the strip sideways so a mouse wheel still navigates.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", updateArrows, { passive: true });
    // The lightbox wrapper mounts the track (and its images) after this effect
    // runs, and the scroller's own box never changes size. So watch the subtree:
    // whenever children appear, observe the track's size and each image's load.
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    const watched = new Set<HTMLImageElement>();
    const watchContent = () => {
      if (el.firstElementChild) ro.observe(el.firstElementChild);
      el.querySelectorAll("img").forEach((img) => {
        if (watched.has(img)) return;
        watched.add(img);
        img.addEventListener("load", updateArrows);
      });
      updateArrows();
    };
    watchContent();
    const mo = new MutationObserver(watchContent);
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", updateArrows);
      watched.forEach((img) => img.removeEventListener("load", updateArrows));
      mo.disconnect();
      ro.disconnect();
    };
  }, [updateArrows, itemCount]);

  // Mouse drag-to-scroll on desktop. Touch devices scroll natively, so
  // pointer events from touch are left alone.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let startX = 0;
    let startLeft = 0;
    let pressed = false;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      pressed = true;
      moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!pressed || e.pointerType !== "mouse") return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        el.classList.add("is-dragging");
        // Capture only once it is really a drag; a plain click must still reach the artwork link.
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pressed = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      // Keep the class through the click that follows a drag so it doesn't open the lightbox.
      window.setTimeout(() => el.classList.remove("is-dragging"), 0);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") scrollBy(1);
      if (e.key === "ArrowLeft") scrollBy(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollBy]);

  const caption = (name: string, meta?: string) => (
    <div className="art-strip__caption">
      <h3 className="art-strip__title">{name}</h3>
      {meta && <p className="art-strip__meta">{meta}</p>}
    </div>
  );

  return (
    <section className="art-strip">
      <StageLock />
      {back && (
        <a className="art-strip__back" href={back.href}>
          ← {back.label}
        </a>
      )}

      <div className="art-strip__scroller" ref={scroller}>
        {itemCount === 0 ? (
          <p className="art-strip__empty">{emptyMessage}</p>
        ) : links ? (
          <div className="art-strip__track">
            {links.map((item) => (
              <a key={item.href} href={item.href} className="art-strip__item">
                <img className="art-strip__img" src={item.image} alt={item.title} decoding="async" />
                {caption(item.title, item.meta)}
              </a>
            ))}
          </div>
        ) : (
          <LightGallery speed={400} plugins={[lgZoom]} mobileSettings={MOBILE_SETTINGS} elementClassNames="art-strip__track">
            {items.map((art, i) => (
              <a
                key={art.slug}
                href={art.image}
                data-sub-html={`<h4>${art.title}</h4><p>${art.medium ?? ""}</p>`}
                className="art-strip__item"
              >
                <img
                  className="art-strip__img"
                  src={art.image}
                  alt={art.title}
                  loading={i < 4 ? "eager" : "lazy"}
                  decoding="async"
                />
                {caption(art.title, [art.medium, art.size].filter(Boolean).join(", "))}
              </a>
            ))}
          </LightGallery>
        )}
      </div>

      <button
        type="button"
        ref={prevArrow}
        data-tone={tone}
        className={`art-strip__arrow art-strip__arrow--prev ${canPrev ? "" : "is-hidden"}`}
        aria-label={prevLabel}
        onClick={() => scrollBy(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        ref={nextArrow}
        data-tone={tone}
        className={`art-strip__arrow art-strip__arrow--next ${canNext ? "" : "is-hidden"}`}
        aria-label={nextLabel}
        onClick={() => scrollBy(1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
