/**
 * Master timeline (seconds). Cut points were measured from Coffee-1.mp4,
 * so every overlay lands on the original footage's own scene changes.
 */
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_S = 30;
export const DURATION_FRAMES = DURATION_S * FPS;

export const CUTS = [0.4, 4.4, 8.3, 10.55, 12.95, 15.4, 17.85, 20.35, 23.95, 26.85];
export const BIG_CUTS = [0.4, 4.4, 8.3, 20.35, 23.95, 26.85];

export const SCENES = {
  opening: { from: 0, to: 4.4 }, // cup hero — "The Golden Ginger Experience"
  packaging: { from: 4.4, to: 8.3 }, // 5 IN 1 pack + sachet reveal
  ingredients: { from: 8.3, to: 20.35 }, // 5 ingredient cards
  richness: { from: 20.35, to: 23.95 }, // model 1
  warmth: { from: 23.95, to: 26.85 }, // model 2
  endCard: { from: 26.85, to: 30 }, // logo + CTA
} as const;

/** Ingredient sub-cuts inside the ingredients scene (absolute seconds). */
export const INGREDIENT_CUTS = [8.3, 10.55, 12.95, 15.4, 17.85, 20.35];

/** Slow cinematic push-ins on the base footage: [from, to, amount, anchorX, anchorY]. */
export const PUSH_INS: [number, number, number, number, number][] = [
  [0.4, 4.4, 0.035, 540, 1650],
  [4.4, 8.3, 0.035, 540, 900],
  [8.3, 10.55, 0.03, 540, 1000],
  [10.55, 12.95, 0.02, 540, 1100],
  [12.95, 15.4, 0.03, 540, 1000],
  [15.4, 17.85, 0.03, 540, 1050],
  [17.85, 20.35, 0.025, 540, 1100],
  [20.35, 23.95, 0.06, 480, 860],
  [23.95, 26.85, 0.05, 640, 880],
  [26.85, 30.1, 0.03, 540, 1000],
];

export const sec = (s: number) => Math.round(s * FPS);
