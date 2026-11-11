/**
 * "Royal Silk · សូត្រមាស" — Khmer luxury cut of THE GOLDEN GINGER EXPERIENCE.
 *
 * Every cut sits on a downbeat of "Golden Bells" (102.9 BPM, beat 0.583 s, first downbeat 0.356 s),
 * measured from public/audio/Golden Bells - usesuno.com.mp3. One bar = 2.332 s.
 * scripts/generate-lux-sfx.mjs reads the same numbers, so keep the two files in sync.
 */
export const L_FPS = 30;
export const L_W = 1080;
export const L_H = 1920;
export const L_DURATION_S = 30;

export const BEAT = 0.5831;
export const BAR = BEAT * 4;
export const BAR0 = 0.356;
/** time of downbeat n (bar n) */
export const bar = (n: number) => +(BAR0 + n * BAR).toFixed(3);

/** Transition overlap: the outgoing scene lives this long under the incoming one. */
export const L_OVERLAP = 0.5;

export type TransitionIn = 'focus' | 'circle' | 'zoom' | 'whipL' | 'whipR' | 'lift';

export const L_SCENES: { id: string; from: number; to: number; enter: TransitionIn }[] = [
  { id: 'intro', from: 0, to: bar(1), enter: 'focus' }, //            0.00 – 2.69  logo blur-to-focus
  { id: 'title', from: bar(1), to: bar(2), enter: 'circle' }, //       2.69 – 5.02  cream kinetic title
  { id: 'pack', from: bar(2), to: bar(4), enter: 'circle' }, //        5.02 – 9.69  masked pack reveal + 2.5D turn
  { id: 'cup', from: bar(4), to: bar(6), enter: 'zoom' }, //           9.69 – 14.35 cup hero + ingredient orbit
  { id: 'ingredients', from: bar(6), to: bar(8), enter: 'whipL' }, // 14.35 – 19.01 floating ingredient cards
  { id: 'benefits', from: bar(8), to: bar(9), enter: 'whipR' }, //    19.01 – 21.35 sachet + benefit chips
  { id: 'model1', from: bar(9), to: bar(10), enter: 'circle' }, //    21.35 – 23.68 lifestyle 1
  { id: 'model2', from: bar(10), to: bar(11), enter: 'lift' }, //     23.68 – 26.01 lifestyle 2 (music breath)
  { id: 'end', from: bar(11), to: 30, enter: 'zoom' }, //             26.01 – 30.00 hero end card on the big hit
];
