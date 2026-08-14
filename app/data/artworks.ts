export type Artwork = {
  title: string;
  slug: string;
  medium?: string;
  size?: string;
  image?: string;
  palette?: string[];
  description?: string;
};

export const primaryWorks: Artwork[] = [
  { title: "Turquoise vide", slug: "turquoise-vide", medium: "Acrylic on canvas", image: "/artworks/paintings/turquoise-vide.png" },
  { title: "La fleur d'hiver", slug: "la-fleur-dhiver", medium: "Acrylic on canvas", image: "/artworks/paintings/la-fleur-dhiver.png" },
  { title: "Quelque chose de beau", slug: "quelque-chose-de-beau", medium: "Acrylic on canvas", image: "/artworks/paintings/quelque-chose-de-beau.png" },
  { title: "Mère Nature", slug: "mere-nature", medium: "Acrylic on canvas", image: "/artworks/paintings/mere-nature.jpg" },
  { title: "Nous ne sommes rien qu'un produit", slug: "nous-ne-sommes-rien-quun-produit", medium: "Acrylic and graphite on paper", image: "/artworks/paintings/nous-ne-sommes-rien-quun-produit.jpg" },
  { title: "Untitled #1", slug: "untitled-1", medium: "Acrylic on canvas", image: "/artworks/paintings/untitled-1.jpg" },
  { title: "Unnamed #1", slug: "unnamed-1", medium: "Acrylic on canvas", image: "/artworks/paintings/unnamed-1.jpg" },
  { title: "Unnamed #2", slug: "unnamed-2", medium: "Acrylic on canvas", image: "/artworks/paintings/unnamed-2.jpg" }
];

export const altWorks: Artwork[] = [
  { title: "Fleurs sauvages", slug: "fleurs-sauvages", medium: "Watercolor on paper", image: "/artworks/illustrations/fleurs-sauvages.png" },
  { title: "La Femme plante", slug: "la-femme-plante", medium: "Watercolor on paper", image: "/artworks/illustrations/la-femme-plante.png" },
  { title: "Self portrait III", slug: "self-portrait-iii", medium: "Watercolor on paper", image: "/artworks/illustrations/self-portrait-iii.jpeg" }
];

export const sketchWorks: Artwork[] = [
  { title: "Fashion sketches", slug: "fashion-sketches", medium: "Sketch", image: "/artworks/sketches/fashion-sketches.png" },
  { title: "Unnamed #1", slug: "sketch-unnamed-1", medium: "Sketch", image: "/artworks/sketches/unnamed-1.jpg" },
  { title: "Unnamed #2", slug: "sketch-unnamed-2", medium: "Sketch", image: "/artworks/sketches/unnamed-2.jpg" },
  { title: "Unnamed #3", slug: "sketch-unnamed-3", medium: "Sketch", image: "/artworks/sketches/unnamed-3.jpg" },
  { title: "Unnamed #4", slug: "sketch-unnamed-4", medium: "Sketch", image: "/artworks/sketches/unnamed-4.jpg" },
  { title: "Unnamed #5", slug: "sketch-unnamed-5", medium: "Sketch", image: "/artworks/sketches/unnamed-5.jpg" }
];

// Drawings made from life. Images live in /public/artworks/observational-drawings.
export const observationalWorks: Artwork[] = [
  { title: "Station Place-des-Arts", slug: "station-place-des-arts", medium: "Ink and marker on paper", image: "/artworks/observational-drawings/station-place-des-arts.jpg" },
  { title: "Living room interior", slug: "living-room-interior", medium: "Ink on paper", image: "/artworks/observational-drawings/living-room-interior.jpg" },
  { title: "Interior in perspective", slug: "interior-in-perspective", medium: "Ink and marker on paper", image: "/artworks/observational-drawings/interior-in-perspective.jpg" },
  { title: "Wine glass", slug: "wine-glass", medium: "Graphite on paper", image: "/artworks/observational-drawings/wine-glass.jpg" },
  { title: "Solids in light", slug: "solids-in-light", medium: "Graphite on paper", image: "/artworks/observational-drawings/solids-in-light.jpg" },
  { title: "Geometric solids", slug: "geometric-solids", medium: "Graphite on paper", image: "/artworks/observational-drawings/geometric-solids.jpg" },
  { title: "Mi perro Rocco", slug: "mi-perro-rocco", medium: "Graphite on paper", image: "/artworks/observational-drawings/mi-perro-rocco.jpg" },
  { title: "Centaur", slug: "centaur", medium: "Graphite on paper", image: "/artworks/observational-drawings/centaur.jpg" },
  { title: "Sofa studies", slug: "sofa-studies", medium: "Graphite and colored pencil on paper", image: "/artworks/observational-drawings/sofa-studies.jpg" },
  { title: "Wooden armchair", slug: "wooden-armchair", medium: "Graphite on paper", image: "/artworks/observational-drawings/wooden-armchair.jpg" },
  { title: "Chair in hatching", slug: "chair-in-hatching", medium: "Graphite on paper", image: "/artworks/observational-drawings/chair-in-hatching.jpg" },
  { title: "Anoki's arm", slug: "anokis-arm", medium: "Graphite on paper", image: "/artworks/observational-drawings/anokis-arm.jpg" },
  { title: "Perspective boxes", slug: "perspective-boxes", medium: "Graphite on paper", image: "/artworks/observational-drawings/perspective-boxes.jpg" }
];

export const allWorks: Artwork[] = [
  ...primaryWorks,
  ...altWorks,
  ...sketchWorks,
  ...observationalWorks
];

export type Collection = {
  name: string;
  slug: string;
  cover?: string;
  works: Artwork[];
};

export const getCollection = (slug: string) =>
  collections.find((collection) => collection.slug === slug);

export const collections: Collection[] = [
  {
    name: "2026 Experimentals",
    slug: "2026-experimentals",
    cover: "/artworks/paintings/nous-ne-sommes-rien-quun-produit.jpg",
    works: [...primaryWorks]
  }
];
