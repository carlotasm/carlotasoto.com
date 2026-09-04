export type HeroCategory = "paintings" | "digitalArt" | "illustrations";

export type HeroSlide = {
  image: string;
  title: string;
  category: HeroCategory;
  /** CSS object-position for the cover crop */
  position?: string;
};

// Landscape-friendly pieces that crop well to a full-viewport cover.
export const heroSlides: HeroSlide[] = [
  { image: "/artworks/paintings/unnamed-1.jpg", title: "Unnamed #1", category: "paintings", position: "center" },
  { image: "/artworks/digital-art/fashion-women.jpg", title: "Fashion women", category: "digitalArt", position: "center 30%" },
  { image: "/artworks/digital-art/self-portrait-i.jpg", title: "Self portrait I", category: "digitalArt", position: "center 25%" },
  { image: "/artworks/digital-art/meditation-i.png", title: "Meditation I", category: "digitalArt", position: "center" },
  { image: "/artworks/paintings/mere-nature.jpg", title: "Mère Nature", category: "paintings", position: "center 20%" },
  { image: "/artworks/illustrations/fleurs-sauvages.png", title: "Fleurs sauvages", category: "illustrations", position: "center" },
  { image: "/artworks/digital-art/self-portrait-ii.jpg", title: "Self portrait II", category: "digitalArt", position: "center 20%" }
];
