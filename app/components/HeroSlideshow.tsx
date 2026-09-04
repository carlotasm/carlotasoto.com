"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { LightGallery as LightGalleryInstance } from "lightgallery/lightgallery";
import type { HeroCategory, HeroSlide } from "@/app/data/heroSlides";
import { StageLock } from "@/app/components/StageLock";
import { sharedTone } from "@/app/lib/contrast";
import type { Tone } from "@/app/lib/contrast";

const AUTOPLAY_MS = 7000;
const SWIPE_PX = 50;

type Props = {
  slides: HeroSlide[];
  categoryLabels: Record<HeroCategory, string>;
  nextLabel: string;
  prevLabel: string;
  viewLabel: string;
};

export function HeroSlideshow({ slides, categoryLabels, nextLabel, prevLabel, viewLabel }: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const touchStartX = useRef<number | null>(null);
  const swiped = useRef(false);
  const lightbox = useRef<LightGalleryInstance | null>(null);
  const lightboxHost = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const prevArrow = useRef<HTMLButtonElement>(null);
  const nextArrow = useRef<HTMLButtonElement>(null);
  const [tone, setTone] = useState<Tone>("dark");
  const count = slides.length;

  // Pick black or white arrows from the artwork pixels under each one.
  useEffect(() => {
    const img = stage.current?.querySelector<HTMLImageElement>(".hero-slide.is-active img");
    if (!img) return;
    const measure = () => {
      const areas = [prevArrow.current, nextArrow.current]
        .filter((el): el is HTMLButtonElement => el !== null)
        .map((el) => el.getBoundingClientRect());
      setTone(sharedTone(areas, img));
    };
    if (img.complete) measure();
    img.addEventListener("load", measure);
    window.addEventListener("resize", measure);
    return () => {
      img.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
    };
  }, [index]);

  // Lightbox in "dynamic" mode: no thumbnails in the DOM, opened programmatically.
  useEffect(() => {
    const host = lightboxHost.current;
    if (!host) return;
    let cancelled = false;
    Promise.all([import("lightgallery"), import("lightgallery/plugins/zoom")]).then(([lg, zoom]) => {
      if (cancelled) return;
      const instance = lg.default(host, {
        dynamic: true,
        dynamicEl: slides.map((slide) => ({
          src: slide.image,
          thumb: slide.image,
          subHtml: `<h4>${slide.title}</h4><p>${categoryLabels[slide.category]}</p>`
        })),
        plugins: [zoom.default],
        speed: 400,
        // lightgallery hides the close button on phones by default; keep it.
        mobileSettings: { controls: false, showCloseIcon: true, download: false }
      });
      host.addEventListener("lgAfterClose", () => setLightboxOpen(false));
      lightbox.current = instance;
    });
    return () => {
      cancelled = true;
      lightbox.current?.destroy();
      lightbox.current = null;
    };
  }, [slides, categoryLabels]);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  // Autoplay; restarts whenever the index changes and pauses while the lightbox is open.
  useEffect(() => {
    if (count < 2 || lightboxOpen) return;
    timer.current = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer.current);
  }, [index, count, go, lightboxOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxOpen) return; // lightgallery owns the arrow keys while open
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, lightboxOpen]);

  const openLightbox = () => {
    if (swiped.current) {
      swiped.current = false; // a swipe ends with a click event; ignore it
      return;
    }
    if (!lightbox.current) return;
    setLightboxOpen(true);
    lightbox.current.openGallery(index);
  };

  const current = slides[index];

  return (
    <section
      ref={stage}
      className="hero-stage"
      aria-roledescription="carousel"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        swiped.current = false;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > SWIPE_PX) {
          swiped.current = true;
          go(dx < 0 ? 1 : -1);
        }
      }}
    >
      <StageLock />
      <div className="hero-slides">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className={`hero-slide ${i === index ? "is-active" : ""}`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: slide.position ?? "center" }}
            />
          </div>
        ))}
      </div>

      {/* Whole artwork is a target: opens the full piece in the lightbox */}
      <button type="button" className="hero-open" aria-label={`${viewLabel}: ${current.title}`} onClick={openLightbox} />

      {count > 1 && (
        <>
          <button
            type="button"
            ref={prevArrow}
            className="hero-arrow hero-arrow--prev"
            data-tone={tone}
            aria-label={prevLabel}
            onClick={() => go(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            ref={nextArrow}
            className="hero-arrow hero-arrow--next"
            data-tone={tone}
            aria-label={nextLabel}
            onClick={() => go(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      <button type="button" className="hero-caption" onClick={openLightbox} aria-label={`${viewLabel}: ${current.title}`}>
        <span aria-live="polite">
          <span className="hero-caption__cat">{categoryLabels[current.category]}</span>
          <span className="hero-caption__sep">/</span>
          <span className="hero-caption__title">{current.title}</span>
        </span>
      </button>

      <div ref={lightboxHost} hidden />
    </section>
  );
}
