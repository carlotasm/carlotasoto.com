import type { Dictionary } from "@/app/lib/dictionaries";

type Props = { dict: Dictionary["hero"] };

export function HeroSection({ dict }: Props) {
  return (
    <section className="hero-full" id="top">
      <div
        className="hero-bg"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(247, 227, 237, 0.55) 0%, rgba(226, 199, 214, 0.55) 35%, rgba(253, 246, 249, 0.55) 70%), url('/assets/images/Hero_header_flowers.png')"
        }}
      />
      <div className="hero-full__content">
        <div className="hero-lockup">
          <img
            src="/assets/images/Carlotasoto_signtext.png"
            alt="Carlota Soto signature"
            className="hero-signature-img"
          />
          <h1 className="hero-title">{dict.title}</h1>
          <div className="hero-subtitle">
            <span>{dict.painter}</span>
            <span>{dict.digitalIllustrator}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
