import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from 'remotion';
import { FilmGrain } from '../components/FilmGrain';
import { useTime } from '../lib/useTime';
import { Box, FineDust, Shell } from './kit';
import { BrewScene, CupScene, FinalScene, HighlightsScene, IngredientsScene, MacroScene, Model1Scene, OpenScene, SceneProps, SplitScene, TextureScene } from './scenes';
import { SC, loadSoftFonts, rgba } from './theme';
import { MUSIC, MUSIC_TRIM, S_OVERLAP, S_SCENES } from './timeline';

loadSoftFonts();

const SONG = staticFile('audio/Golden Lounge - usesuno.com.mp3');
const VOL = 0.7;
const XF = 4; // crossfade frames at the loop point

/**
 * Sidechain-style ducking: the music dips ≈ 5 dB around every cut (and ≈ 3 dB under the logo signature)
 * so the transition sounds in golex-soft-sfx.wav cut through instead of being masked.
 */
const CUT_TIMES = S_SCENES.slice(1).map((s) => s.from);
const FINAL = S_SCENES[S_SCENES.length - 1];
const LOGO_T = FINAL.from + 1.33; // final scene: logo light sweep
const duck = (t: number) => {
  let d = 0;
  for (const c of CUT_TIMES) d = Math.max(d, 0.2 * Math.exp(-(((t - c) / (t < c ? 0.25 : 0.35)) ** 2)));
  d = Math.max(d, 0.2 * Math.exp(-(((t - LOGO_T) / 0.5) ** 2)));
  return 1 - d;
};

const MAP: Record<string, React.FC<SceneProps>> = {
  open: OpenScene,
  split: SplitScene,
  macro: MacroScene,
  cup: CupScene,
  texture: TextureScene,
  ingredients: IngredientsScene,
  model1: Model1Scene,
  highlights: HighlightsScene,
  brew: BrewScene,
  final: FinalScene,
};

/** Where each scene's transition originates (rounded-card growth box / zoom origin). */
const STAGE: Record<string, { from?: Box; origin?: [number, number] }> = {
  split: { origin: [540, 1400] }, // zoom out of the product card
  macro: { origin: [770, 930] },
  cup: { from: { x: 290, y: 620, w: 500, h: 720, r: 60 }, origin: [540, 1000] },
  texture: { origin: [540, 900] },
  model1: { from: { x: 340, y: 640, w: 680, h: 1190, r: 340 }, origin: [680, 1200] },
  highlights: { origin: [740, 1120] },
  brew: { origin: [480, 1150] },
  final: { origin: [540, 820] },
};

/** Barely-there handheld drift so no frame is ever static. */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTime();
  return <AbsoluteFill style={{ transform: `translate(${3 * Math.sin(t * 0.33)}px, ${4 * Math.sin(t * 0.27 + 1)}px) scale(1.01)` }}>{children}</AbsoluteFill>;
};

/**
 * GOLEX — THE GOLDEN GINGER EXPERIENCE · Soft Luxury Edition (Khmer).
 * Bright editorial ivory layouts + ruby product stages, glass panels, rounded product cards,
 * cut on the downbeats of "Golden Lounge" (90 BPM) with a synchronised SFX layer.
 */
export const SoftCommercial: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const jump = MUSIC ? Math.round(MUSIC.jumpAt * fps) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: SC.ivory }}>
      <Camera>
        {S_SCENES.map((s, i) => {
          const Scene = MAP[s.id];
          const next = S_SCENES[i + 1];
          const L = s.to - s.from + (next ? S_OVERLAP : 0);
          const st = STAGE[s.id] ?? {};
          return (
            <Sequence key={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round(L * fps)} name={`${i + 1} · ${s.id}`}>
              <Shell L={L} enter={s.enter} exit={next?.enter} from={st.from} origin={st.origin}>
                <Scene L={L} t0={s.from} pace={s.pace} />
              </Shell>
            </Sequence>
          );
        })}
      </Camera>
      <FineDust amount={0.5} />
      <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse 85% 75% at 50% 48%, transparent 62%, ${rgba('#8A6A45', 0.22)} 100%)` }} />
      <FilmGrain opacity={0.03} />
      {MUSIC === null ? (
        /* Music: "Golden Lounge" played straight through to its own ending. */
        <Audio src={SONG} trimBefore={Math.round(MUSIC_TRIM * fps)} volume={(f) => VOL * duck(f / fps) * interpolate(f, [0, 6, durationInFrames - 50, durationInFrames - 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      ) : (
        /* Music extended by a bar-aligned loop: plays to video jumpAt, then continues from the music at video resumeFrom. */
        <>
          <Sequence durationInFrames={jump + XF} name="music A">
            <Audio src={SONG} trimBefore={Math.round(MUSIC_TRIM * fps)} volume={(f) => VOL * duck(f / fps) * interpolate(f, [0, 6, jump, jump + XF], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
          </Sequence>
          <Sequence from={jump} name="music B (loop)">
            <Audio
              src={SONG}
              trimBefore={Math.round((MUSIC.resumeFrom + MUSIC_TRIM) * fps)}
              volume={(f) => VOL * duck((f + jump) / fps) * interpolate(f, [0, XF, durationInFrames - jump - 45, durationInFrames - jump - 1], [0.35, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            />
          </Sequence>
        </>
      )}
      <Audio src={staticFile('audio/golex-soft-sfx.wav')} volume={0.7} />
    </AbsoluteFill>
  );
};
