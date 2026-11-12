import '@fontsource/playfair-display/600.css';
import React from 'react';
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useVideoConfig } from 'remotion';
import { FilmGrain } from '../components/FilmGrain';
import { useTime } from '../lib/useTime';
import { loadSoftFonts } from '../soft/theme';
import { Shell } from './kit';
import { CupScene, FinalScene, HighlightsScene, IngredientsScene, MacroScene, Model1Scene, OpenScene, SceneProps, SplitScene, TextureScene } from './scenes';
import { I_OVERLAP, I_SCENES } from './timeline';

loadSoftFonts();
let started = false;
if (!started && typeof document !== 'undefined') {
  started = true;
  const h = delayRender('Loading Playfair Display');
  document.fonts.load('600 40px "Playfair Display"', '5 IN 1').then(() => continueRender(h)).catch(() => continueRender(h));
}

const SONG = staticFile('audio/Sunny Morning - usesuno.com.mp3');
const VOL = 0.72;
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

/** Transition origins (circle reveal / zoom / pull-back centre). */
const ORIGIN: Record<string, [number, number]> = {
  cup: [540, 1010],
  texture: [600, 820],
  model1: [680, 1230],
  final: [540, 1000],
};

/** Gentle isometric camera: a slow diagonal drift and breathing scale. */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTime();
  return <AbsoluteFill style={{ transform: `translate(${5 * Math.sin(t * 0.28)}px, ${4 * Math.sin(t * 0.21 + 1)}px) scale(${1.012 + 0.006 * Math.sin(t * 0.4)})` }}>{children}</AbsoluteFill>;
};

/**
 * GOLEX — THE GOLDEN GINGER EXPERIENCE · The Golden Ginger World (3D Isometric Storytelling, Khmer).
 * Stack: scenes (each in a transition Shell) · camera · grain · music + SFX.
 */
export const IsoCommercial: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: '#FFF6EA' }}>
      <Camera>
        {I_SCENES.map((s, i) => {
          const Scene = MAP[s.id];
          const next = I_SCENES[i + 1];
          const L = s.to - s.from + (next ? I_OVERLAP : 0);
          return (
            <Sequence key={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round(L * fps)} name={`${i + 1} · ${s.id}`}>
              <Shell L={L} enter={s.enter} exit={next?.enter} origin={ORIGIN[s.id]}>
                <Scene L={L} t0={s.from} idx={i} />
              </Shell>
            </Sequence>
          );
        })}
      </Camera>
      <FilmGrain opacity={0.025} />
      <Audio src={SONG} volume={(f) => VOL * interpolate(f, [0, 4, durationInFrames - 36, durationInFrames - 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      <Audio src={staticFile('audio/golex-iso-sfx.wav')} volume={SFX_VOL} />
    </AbsoluteFill>
  );
};
