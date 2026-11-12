import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from 'remotion';
import { FilmGrain } from '../components/FilmGrain';
import { GoldDust } from '../components/GoldDust';
import { useTime } from '../lib/useTime';
import { Shell } from './kit';
import { CupScene, FinalScene, HighlightsScene, IngredientsScene, MacroScene, Model1Scene, OpenScene, SceneProps, SplitScene, TextureScene } from './scenes';
import { MC, loadMidnightFonts, rgba } from './theme';
import { M_OVERLAP, M_SCENES } from './timeline';

loadMidnightFonts();

const SONG = staticFile('audio/RisingGold-usesuno.com.mp3');
const VOL = 0.75;
const SFX_VOL = 0.5;

const MAP: Record<string, React.FC<SceneProps>> = {
  open: OpenScene,
  split: SplitScene,
  macro: MacroScene,
  cup: CupScene,
  texture: TextureScene,
  ingredients: IngredientsScene,
  model1: Model1Scene,
  highlights: HighlightsScene,
  final: FinalScene,
};

/** Where each scene's transition originates (circle reveal / zoom centre). */
const ORIGIN: Record<string, [number, number]> = {
  cup: [540, 1000],
  texture: [540, 860],
  highlights: [760, 1120],
  final: [540, 1040],
};

/** Slow cinematic push-in on the whole frame plus a tiny drift, so no frame is static. */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTime();
  return <AbsoluteFill style={{ transform: `translate(${3 * Math.sin(t * 0.3)}px, ${4 * Math.sin(t * 0.23 + 1)}px) scale(${1.01 + 0.0006 * t})` }}>{children}</AbsoluteFill>;
};

/**
 * GOLEX — THE GOLDEN GINGER EXPERIENCE · Midnight Luxury Edition (Khmer).
 * Stack: scenes (each in a transition Shell) · camera · gold particles · deep vignette · grain · music + SFX.
 */
export const MidnightCommercial: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: MC.black }}>
      <Camera>
        {M_SCENES.map((s, i) => {
          const Scene = MAP[s.id];
          const next = M_SCENES[i + 1];
          const L = s.to - s.from + (next ? M_OVERLAP : 0);
          return (
            <Sequence key={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round(L * fps)} name={`${i + 1} · ${s.id}`}>
              <Shell L={L} enter={s.enter} exit={next?.enter} origin={ORIGIN[s.id]}>
                <Scene L={L} t0={s.from} />
              </Shell>
            </Sequence>
          );
        })}
      </Camera>
      <GoldDust amount={0.45} />
      <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse 80% 70% at 50% 48%, transparent 55%, ${rgba(MC.black, 0.75)} 100%)` }} />
      <FilmGrain opacity={0.05} />
      <Audio src={SONG} volume={(f) => VOL * interpolate(f, [0, 4, durationInFrames - 30, durationInFrames - 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      <Audio src={staticFile('audio/golex-midnight-sfx.wav')} volume={SFX_VOL} />
    </AbsoluteFill>
  );
};
