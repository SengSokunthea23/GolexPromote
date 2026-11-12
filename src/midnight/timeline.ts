/**
 * GOLEX — Midnight Luxury Edition (Khmer) · 30 s.
 *
 * Music: "Rising Gold" (public/audio/RisingGold-usesuno.com.mp3), measured at 128.75 BPM, key B major.
 * beat 0.466 s, first downbeat 0.754 s, one bar = 1.864 s. Quiet dark intro, the beat drops in at bar 3 (6.35 s),
 * outro fades from ≈ 27 s. Every cut lands on a bar or half-bar; the drop is a cut.
 * scripts/generate-midnight-sfx.mjs uses the same numbers — keep both in sync.
 */
export const M_FPS = 30;
export const M_W = 1080;
export const M_H = 1920;
export const M_DURATION_S = 30;

export const M_BEAT = 0.466;
export const M_BAR = M_BEAT * 4;
export const mbar = (n: number) => +(0.754 + n * M_BAR).toFixed(3);
/** k beats, in seconds (scene-local choreography). */
export const B = (k: number) => +(k * M_BEAT).toFixed(3);

export const M_OVERLAP = 0.45;

export type MidTransition = 'dark' | 'sweep' | 'flash' | 'circle' | 'zoom' | 'blur';

export const M_SCENES: { id: string; from: number; to: number; enter: MidTransition }[] = [
  { id: 'open', from: 0, to: mbar(1.5), enter: 'dark' }, //               0.00 – 3.55  black → gold line → logo → headline
  { id: 'split', from: mbar(1.5), to: mbar(3), enter: 'sweep' }, //      3.55 – 6.35  pack emerges from darkness
  { id: 'macro', from: mbar(3), to: mbar(4.5), enter: 'flash' }, //      6.35 – 9.14  THE DROP — pack macro
  { id: 'cup', from: mbar(4.5), to: mbar(6.5), enter: 'circle' }, //     9.14 – 12.87 cup, rim light, steam, orbit
  { id: 'texture', from: mbar(6.5), to: mbar(8), enter: 'zoom' }, //     12.87 – 15.66 crema lens
  { id: 'ingredients', from: mbar(8), to: mbar(10), enter: 'sweep' }, // 15.66 – 19.39 ingredients + gold annotation lines
  { id: 'model1', from: mbar(10), to: mbar(11.5), enter: 'dark' }, //    19.39 – 22.19 model, rim light
  { id: 'highlights', from: mbar(11.5), to: mbar(13), enter: 'blur' }, // 22.19 – 24.99 features, dark glass cards
  { id: 'final', from: mbar(13), to: M_DURATION_S, enter: 'flash' }, //  24.99 – 30.00 hero composition + logo
];
