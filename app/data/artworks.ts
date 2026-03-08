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
  {
    title: "Turquoise vide",
    slug: "turquoise-vide",
    medium: "Painting",
    image: "/artworks/paintings/turquoise-vide.png"
  },
  {
    title: "La fleur d'hiver",
    slug: "la-fleur-dhiver",
    medium: "Painting",
    image: "/artworks/paintings/la-fleur-dhiver.png"
  },
  {
    title: "Quelque chose de beau",
    slug: "quelque-chose-de-beau",
    medium: "Painting",
    image: "/artworks/paintings/quelque-chose-de-beau.png"
  }
];

export const altWorks: Artwork[] = [
  {
    title: "Fleurs sauvages",
    slug: "fleurs-sauvages",
    medium: "Illustration",
    image: "/artworks/illustrations/fleurs-sauvages.png"
  },
  {
    title: "La Femme plante",
    slug: "la-femme-plante",
    medium: "Illustration",
    image: "/artworks/illustrations/la-femme-plante.png"
  },
  {
    title: "Self portrait III",
    slug: "self-portrait-iii",
    medium: "Illustration",
    image: "/artworks/illustrations/self-portrait-iii.jpeg"
  }
];

export const narrativeWorks: Artwork[] = [
  {
    title: "Fashion Women",
    slug: "fashion-women",
    medium: "Digital art",
    image: "/artworks/digital-art/fashion-women.jpg"
  },
  {
    title: "I Feel Infinite",
    slug: "i-feel-infinite",
    medium: "Digital art",
    image: "/artworks/digital-art/i-feel-infinite.png"
  },
  {
    title: "I Feel Infinite (no color)",
    slug: "i-feel-infinite-no-color",
    medium: "Digital art",
    image: "/artworks/digital-art/i-feel-infinite-no-color.png"
  },
  {
    title: "Meditation I",
    slug: "meditation-i",
    medium: "Digital art",
    image: "/artworks/digital-art/meditation-i.png"
  },
  {
    title: "Self portrait I",
    slug: "self-portrait-i",
    medium: "Digital art",
    image: "/artworks/digital-art/self-portrait-i.jpg"
  },
  {
    title: "Self portrait II",
    slug: "self-portrait-ii",
    medium: "Digital art",
    image: "/artworks/digital-art/self-portrait-ii.jpg"
  }
];

export const sketchWorks: Artwork[] = [
  {
    title: "Fashion sketches",
    slug: "fashion-sketches",
    medium: "Sketch",
    image: "/artworks/sketches/fashion-sketches.png"
  },
  {
    title: "Sketches I - Moi et l'autre",
    slug: "sketches-i",
    medium: "Sketch",
    image: "/artworks/sketches/sketches-i-moi-et-lautre.png"
  }
];

export const allWorks: Artwork[] = [
  ...primaryWorks,
  ...altWorks,
  ...narrativeWorks,
  ...sketchWorks
];
