/**
 * Decide whether an overlay (e.g. a navigation arrow) should be black or white
 * by sampling the image pixels rendered underneath it.
 */

export type Tone = "light" | "dark";

const SAMPLE = 12;
const canvases = new Map<string, HTMLCanvasElement>();

function parsePosition(value: string, axis: "x" | "y"): number {
  // object-position like "center 30%", "left top", "50% 50%"
  const parts = value.split(/\s+/);
  const raw = axis === "x" ? parts[0] : parts[1] ?? parts[0];
  if (raw === "left" || raw === "top") return 0;
  if (raw === "right" || raw === "bottom") return 1;
  if (raw === "center" || raw === undefined) return 0.5;
  const pct = parseFloat(raw);
  return Number.isFinite(pct) ? pct / 100 : 0.5;
}

/** Mean relative luminance (0..1) of the part of `img` rendered inside `area`, or null if unavailable. */
export function luminanceUnder(img: HTMLImageElement, area: DOMRect): number | null {
  if (!img.complete || !img.naturalWidth) return null;
  const box = img.getBoundingClientRect();
  if (!box.width || !box.height) return null;

  const style = getComputedStyle(img);
  const fit = style.objectFit;
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const scale =
    fit === "cover"
      ? Math.max(box.width / nw, box.height / nh)
      : fit === "contain"
        ? Math.min(box.width / nw, box.height / nh)
        : box.width / nw; // "fill"-ish fallback along x
  const scaleY = fit === "cover" || fit === "contain" ? scale : box.height / nh;
  const drawnW = nw * scale;
  const drawnH = nh * scaleY;
  const ox = (box.width - drawnW) * parsePosition(style.objectPosition, "x");
  const oy = (box.height - drawnH) * parsePosition(style.objectPosition, "y");

  // Map the screen area into image pixel space.
  let sx = (area.left - box.left - ox) / scale;
  let sy = (area.top - box.top - oy) / scaleY;
  let sw = area.width / scale;
  let sh = area.height / scaleY;
  // Clamp to the image; if the area lies fully outside the drawn image, nothing to sample.
  const ex = Math.min(nw, sx + sw);
  const ey = Math.min(nh, sy + sh);
  sx = Math.max(0, sx);
  sy = Math.max(0, sy);
  sw = ex - sx;
  sh = ey - sy;
  if (sw <= 1 || sh <= 1) return null;

  let canvas = canvases.get("sampler");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.width = SAMPLE;
    canvas.height = SAMPLE;
    canvases.set("sampler", canvas);
  }
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  try {
    ctx.clearRect(0, 0, SAMPLE, SAMPLE);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SAMPLE, SAMPLE);
    const { data } = ctx.getImageData(0, 0, SAMPLE, SAMPLE);
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    }
    return sum / (data.length / 4) / 255;
  } catch {
    return null; // tainted canvas (cross-origin) or decode failure
  }
}

function imageAt(area: DOMRect): HTMLImageElement | null {
  const cx = area.left + area.width / 2;
  const cy = area.top + area.height / 2;
  return (document.elementsFromPoint(cx, cy).find((el) => el instanceof HTMLImageElement) as HTMLImageElement | undefined) ?? null;
}

/**
 * One shared tone for a set of overlays (e.g. both arrows), so they never
 * disagree. Averages the luminance under every area that has an image;
 * areas over plain page background count as white. Defaults to light.
 */
export function sharedTone(areas: DOMRect[], img?: HTMLImageElement | null): Tone {
  const readings: number[] = [];
  for (const area of areas) {
    const target = img ?? imageAt(area);
    const lum = target ? luminanceUnder(target, area) : null;
    readings.push(lum ?? 1); // nothing drawn there = page background
  }
  if (readings.length === 0) return "light";
  const mean = readings.reduce((a, b) => a + b, 0) / readings.length;
  return mean > 0.55 ? "light" : "dark";
}
