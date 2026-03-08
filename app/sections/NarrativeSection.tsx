import { LightboxGrid } from "@/app/components/LightboxGrid";
import { narrativeWorks } from "@/app/data/artworks";

export function NarrativeSection() {
  const [first, second] = narrativeWorks;

  return (
    <section className="section narrative" id="illustrations">
      <div className="section-header">
        <h2 className="section-title">Narrative / comic art</h2>
        <p className="section-kicker">Space for story-driven pieces and captions.</p>
      </div>

      <LightboxGrid artworks={[first, second]} columns="two" className="narrative-grid" />
    </section>
  );
}
