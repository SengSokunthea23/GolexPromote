/** Timeline for the all-new "Golden Ginger Experience" promo (built only from product stills). */
export const P_FPS = 30;
export const P_W = 1080;
export const P_H = 1920;
export const P_DURATION_S = 30;
export const P_OVERLAP = 0.35; // each scene lingers this long under the next one for a soft hand-off

export const P_SCENES = [
  { id: 'logo', from: 0, to: 3 },
  { id: 'cup', from: 3, to: 7 },
  { id: 'pack', from: 7, to: 11 },
  { id: 'sachet', from: 11, to: 15.5 },
  { id: 'ingredients', from: 15.5, to: 20 },
  { id: 'model1', from: 20, to: 24 },
  { id: 'model2', from: 24, to: 27 },
  { id: 'end', from: 27, to: 30 },
] as const;

export const P_CUTS = P_SCENES.slice(1).map((s) => s.from);
export const P_BIG = [3, 7, 20, 27];
