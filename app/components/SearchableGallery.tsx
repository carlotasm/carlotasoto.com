"use client";

import { useMemo, useState } from "react";
import { LightboxGrid } from "@/app/components/LightboxGrid";
import type { Artwork } from "@/app/data/artworks";

type Props = {
  artworks: Artwork[];
  columns?: "two" | "three";
  searchPlaceholder: string;
  piecesLabel: string;
};

export function SearchableGallery({ artworks, columns, searchPlaceholder, piecesLabel }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artworks;
    return artworks.filter((art) => {
      const haystack = `${art.title || ""} ${art.medium || ""} ${art.size || ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [artworks, query]);

  return (
    <>
      <div className="search-bar">
        <input
          type="search"
          className="search-input"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="search-count">
          {filtered.length} {piecesLabel}
        </span>
      </div>
      <div className="gallery-board">
        <LightboxGrid artworks={filtered} columns={columns} />
      </div>
    </>
  );
}
