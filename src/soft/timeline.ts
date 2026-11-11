/**
 * GOLEX — Soft Luxury Edition (Khmer) · 31 s cut.
 *
 * Music: "Golden Lounge" (public/audio/Golden Lounge - usesuno.com.mp3), 90.0 BPM, beat 0.6667 s.
 * It starts MUSIC_TRIM (1.5 beats) into the source, so in video time its beats fall on 0.505 + k·beat and its
 * downbeats on 1.839 + n·bar. Every cut lands on a downbeat or half-bar, and the song's own ending lands at ≈ 31 s.
 *
 * Each scene has a `pace`: its choreography is written in beats and scaled by pace, snapped to the
 * half-beat grid (see `beats()`). Scenes start on beats, so their local beats stay on the music.
 * scripts/generate-soft-sfx.mjs uses the same table and the same snapping — keep both in sync.
 */
export const S_FPS = 30;
export const S_W = 1080;
export const S_H = 1920;
export const S_DURATION_S = 31;

export const S_BEAT = 0.6667;
export const S_BAR = S_BEAT * 4;
/** Seconds skipped at the start of the song (1.5 beats). */
export const MUSIC_TRIM = 1.0;
/** First beat in video time (used by the opening scene, which starts before the first full beat). */
export const S_PICKUP = 0.505;
/** Downbeat of bar n in video time (bar 0 = 1.839 s; half-bars allowed). */
export const sbar = (n: number) => +(1.839 + n * S_BAR).toFixed(3);

/** Choreography beat k, scaled by the scene's pace and snapped to half-beats, in seconds. */
export const beats = (pace: number) => (k: number) => +((Math.round(k * pace * 2) / 2) * S_BEAT).toFixed(3);

/** Optional music loop (null = play the song straight through). */
export const MUSIC: { jumpAt: number; resumeFrom: number } | null = null;

export const S_OVERLAP = 0.6;

export type SoftTransition = 'blur' | 'card' | 'zoom' | 'sheet' | 'light';

export const S_SCENES: { id: string; from: number; to: number; enter: SoftTransition; pace: number }[] = [
  { id: 'open', from: 0, to: sbar(0.5), enter: 'light', pace: 1 }, //                 0.00 – 3.17
  { id: 'split', from: sbar(0.5), to: sbar(1.5), enter: 'zoom', pace: 0.5 }, //       3.17 – 5.84
  { id: 'macro', from: sbar(1.5), to: sbar(2.5), enter: 'blur', pace: 0.5 }, //       5.84 – 8.51
  { id: 'cup', from: sbar(2.5), to: sbar(4), enter: 'card', pace: 0.75 }, //          8.51 – 12.51
  { id: 'texture', from: sbar(4), to: sbar(5), enter: 'zoom', pace: 0.5 }, //         12.51 – 15.17
  { id: 'ingredients', from: sbar(5), to: sbar(7), enter: 'sheet', pace: 0.67 }, //   15.17 – 20.51
  { id: 'model1', from: sbar(7), to: sbar(8), enter: 'card', pace: 0.5 }, //          20.51 – 23.17
  { id: 'highlights', from: sbar(8), to: sbar(9), enter: 'blur', pace: 0.5 }, //      23.17 – 25.84
  { id: 'final', from: sbar(9), to: S_DURATION_S, enter: 'light', pace: 0.7 }, //     25.84 – 31.00
];
