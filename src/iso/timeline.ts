/**
 * GOLEX — The Golden Ginger World · 3D Isometric Storytelling Edition (Khmer) · 30 s.
 *
 * Music: "Sunny Morning" (public/audio/Sunny Morning - usesuno.com.mp3), measured at 104.35 BPM, key D major.
 * beat 0.575 s, first downbeat 0.739 s, one bar = 2.30 s. The groove lifts at bar 2 (5.34 s), outro from ≈ 28.3 s.
 * Every cut lands on a bar or half-bar. scripts/generate-iso-sfx.mjs uses the same numbers — keep both in sync.
 */
export const I_FPS = 30;
export const I_W = 1080;
export const I_H = 1920;
export const I_DURATION_S = 30;

export const I_BEAT = 0.575;
export const I_BAR = I_BEAT * 4;
export const ibar = (n: number) => +(0.739 + n * I_BAR).toFixed(3);
/** k beats in seconds (scene-local choreography). */
export const B = (k: number) => +(k * I_BEAT).toFixed(3);

export const I_OVERLAP = 0.5;

export type IsoTransition = 'blur' | 'ribbon' | 'flip' | 'circle' | 'zoom' | 'pull';

/** Each scene owns a pastel gradient; the stage colour morphs between them at every cut. */
export const I_SCENES: { id: string; from: number; to: number; enter: IsoTransition; bg: [string, string] }[] = [
  { id: 'open', from: 0, to: ibar(1), enter: 'blur', bg: ['#FFF6EA', '#F6C9B6'] }, //              0.00 – 3.04  the Golden Ginger World
  { id: 'split', from: ibar(1), to: ibar(2.5), enter: 'ribbon', bg: ['#F7D8D3', '#F6C9B6'] }, //    3.04 – 6.49  package on a pedestal
  { id: 'macro', from: ibar(2.5), to: ibar(4), enter: 'flip', bg: ['#FFF6EA', '#F8E7D5'] }, //      6.49 – 9.94  sachet → package, 5 IN 1
  { id: 'cup', from: ibar(4), to: ibar(5.5), enter: 'circle', bg: ['#F6C9B6', '#F7D8D3'] }, //      9.94 – 13.39 cup on a floating island
  { id: 'texture', from: ibar(5.5), to: ibar(6.5), enter: 'zoom', bg: ['#F8E7D5', '#F6C9B6'] }, //  13.39 – 15.69 coffee-bean pathway
  { id: 'ingredients', from: ibar(6.5), to: ibar(8.5), enter: 'ribbon', bg: ['#FFF6EA', '#F7D8D3'] }, // 15.69 – 20.29 ingredient world
  { id: 'model1', from: ibar(8.5), to: ibar(9.5), enter: 'pull', bg: ['#F7D8D3', '#F6C9B6'] }, //   20.29 – 22.59 lifestyle
  { id: 'highlights', from: ibar(9.5), to: ibar(10.5), enter: 'flip', bg: ['#FFF6EA', '#F6C9B6'] }, // 22.59 – 24.89 feature cards
  { id: 'final', from: ibar(10.5), to: I_DURATION_S, enter: 'ribbon', bg: ['#FFF6EA', '#F6C9B6'] }, // 24.89 – 30.00 hero composition
];
