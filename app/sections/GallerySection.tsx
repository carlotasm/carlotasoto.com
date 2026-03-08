import { SearchableGallery } from "@/app/components/SearchableGallery";
import { allWorks } from "@/app/data/artworks";
import type { Dictionary } from "@/app/lib/dictionaries";

type Props = { dict: Dictionary["gallery"] };

export function GallerySection({ dict }: Props) {
  return (
    <section className="section gallery" id="gallery">
      <div className="section-header">
        <h2 className="section-title">{dict.allWorkHeading}</h2>
        <p className="section-kicker">{dict.allWorkKicker}</p>
      </div>
      <SearchableGallery
        artworks={allWorks}
        searchPlaceholder={dict.searchPlaceholder}
        piecesLabel={dict.pieces}
      />
    </section>
  );
}
