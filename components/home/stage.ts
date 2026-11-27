/**
 * Shared, mutable scroll state for the home page. ScrollTrigger writes it,
 * the WebGL scene reads it every frame. Kept outside React so scrolling never
 * causes React renders.
 */
export type Chapter = "opening" | "categories" | "rx" | "none";

export const stage = {
  /** 0..1 through the opening (hero + pour). */
  opening: 0,
  /** 0..(categories-1), fractional, through the category carousel. */
  category: 0,
  /** 0..1 through the prescription chapter. */
  rx: 0,
  chapter: "opening" as Chapter,
  /** Whether any 3D chapter is on screen; when false the canvas stops rendering. */
  active: true,
  pointer: { x: 0, y: 0 },
  reducedMotion: false,
  compact: false,
  /** Set by HomeStage so in-page navigation goes through Lenis when it is running. */
  scrollTo: (y: number) => window.scrollTo({ top: y, behavior: "smooth" }),
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Maps v from [a,b] to [0,1], clamped. */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
