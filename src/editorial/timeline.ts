/**
 * GOLEX — Editorial Kinetic Typography Edition (Khmer) · 35 s.
 *
 * Music: "Sunset Breeze" (public/audio/Sunset Breeze - usesuno.com.mp3), 100 BPM, key G major.
 * beat 0.5997 s, first beat 0.42 s, first downbeat 1.02 s, one bar = 2.399 s.
 * The song (31.15 s) is extended by a bar-aligned loop (MUSIC): source plays to bar 7 (17.81 s), then jumps back
 * two bars to source bar 5 and plays to its natural ending. The jump is hidden under the ingredients cut, the beat
 * grid stays continuous, and the song's big hit (source 25.01 s) still lands on the final scene (29.81 s).
 * Every cut lands on a downbeat or half-bar. scripts/generate-editorial-sfx.mjs uses the same numbers.
 */
export const E_FPS = 30;
export const E_W = 1080;
export const E_H = 1920;
export const E_DURATION_S = 35;

export const E_BEAT = 0.5997;
export const E_BAR = E_BEAT * 4;
export const E_PICKUP = 0.42; // first beat in video time (opening scene)
export const ebar = (n: number) => +(1.02 + n * E_BAR).toFixed(3);
/** k beats in seconds (scene-local choreography). */
export const B = (k: number) => +(k * E_BEAT).toFixed(3);

/** Music edit: play source 0 → ebar(7), then source ebar(5) → end, butted at video ebar(7). */
export const MUSIC = { jumpAt: ebar(7), resumeFrom: ebar(5) } as const;

/** How long the outgoing scene stays under the incoming one. */
export const E_OVERLAP = 0.6;

export type EdTransition = 'blur' | 'flash' | 'wipe' | 'zoom' | 'shape' | 'slide';

export const E_SCENES: { id: string; from: number; to: number; enter: EdTransition }[] = [
  { id: 'open', from: 0, to: ebar(1), enter: 'blur' }, //                   0.00 – 3.42  editorial brand intro
  { id: 'split', from: ebar(1), to: ebar(2.5), enter: 'wipe' }, //         3.42 – 7.02  split-screen product intro
  { id: 'macro', from: ebar(2.5), to: ebar(4), enter: 'flash' }, //        7.02 – 10.62 5 IN 1 close-up
  { id: 'cup', from: ebar(4), to: ebar(5.5), enter: 'zoom' }, //           10.62 – 14.21 cup + oversized "Richness" (the lift)
  { id: 'texture', from: ebar(5.5), to: ebar(7), enter: 'shape' }, //      14.21 – 17.81 crema + waveforms
  { id: 'ingredients', from: ebar(7), to: ebar(9), enter: 'slide' }, //    17.81 – 22.61 ingredient grid (music loop hidden here)
  { id: 'model1', from: ebar(9), to: ebar(10.5), enter: 'wipe' }, //       22.61 – 26.21 lifestyle split-screen
  { id: 'highlights', from: ebar(10.5), to: ebar(12), enter: 'blur' }, //  26.21 – 29.81 product highlights
  { id: 'final', from: ebar(12), to: E_DURATION_S, enter: 'flash' }, //    29.81 – 35.00 final composition
];
