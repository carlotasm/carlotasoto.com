"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import lgZoom from "lightgallery/plugins/zoom";
import { Artwork } from "@/app/data/artworks";

type LightGalleryProps = {
  speed?: number;
  plugins?: unknown[];
  elementClassNames?: string;
  children?: React.ReactNode;
};

const LightGallery = dynamic(() => import("lightgallery/react"), { ssr: false }) as ComponentType<LightGalleryProps>;

type Props = {
  artworks: Artwork[];
  columns?: "two" | "three";
  className?: string;
};

export function LightboxGrid({ artworks, columns = "three", className = "" }: Props) {
  const gridClass =
    columns === "three" ? "gallery-row gallery-row--three" : "gallery-row";

  return (
    <LightGallery speed={400} plugins={[lgZoom]} elementClassNames={`${gridClass} ${className}`}>
      {artworks.map((art) => (
        <a
          key={art.slug}
          href={art.image}
          data-sub-html={`<h4>${art.title}</h4><p>${art.medium ?? ""}</p>`}
          className="art-card"
        >
          <img
            className="art-card__visual"
            src={art.image}
            alt={art.title}
            loading="lazy"
            decoding="async"
          />
          <div className="art-card__caption align-center">
            <h3 className="art-card__title">{art.title}</h3>
            {art.medium && <p className="art-card__meta">{art.medium}</p>}
            {art.size && <p className="art-card__meta">{art.size}</p>}
          </div>
        </a>
      ))}
    </LightGallery>
  );
}
