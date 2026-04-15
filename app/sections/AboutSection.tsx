import type { Dictionary } from "@/app/lib/dictionaries";

type Props = { dict: Dictionary["about"]; lang: string };

export function AboutSection({ dict, lang }: Props) {
  return (
    <section className="section about" id="about">
      <div className="about-grid">
        <div className="about-text">
          <h2 className="section-title">{dict.heading}</h2>
          <p className="about-single">{dict.bio}</p>
          <a className="button about-button" href={`/${lang}/gallery`}>
            {dict.viewArt}
          </a>
        </div>
        <div
          className="about-visual"
          style={{ backgroundImage: "url('/assets/images/aboutmepfp2.jpg')" }}
          aria-label="About illustration placeholder"
          role="img"
        />
      </div>
    </section>
  );
}
