import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from 'remotion';
import { FilmGrain } from '../components/FilmGrain';
import { useTime } from '../lib/useTime';
import { EC, Shell } from './kit';
import { CupScene, FinalScene, HighlightsScene, IngredientsScene, MacroScene, Model1Scene, OpenScene, SceneProps, SplitScene, TextureScene } from './scenes';
import { loadEditorialFonts } from './theme';
import { E_OVERLAP, E_SCENES, MUSIC } from './timeline';

loadEditorialFonts();

const SONG = staticFile('audio/Sunset Breeze - usesuno.com.mp3');
const VOL = 0.75;
const SFX_VOL = 0.5;
const XF = 4; // crossfade frames at the music loop point

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
const ORIGIN: Record<string, [number, number]> = { cup: [540, 1060], texture: [540, 860], highlights: [760, 1150], final: [540, 1030] };
const WIPE: Record<string, string> = { split: EC.ruby, model1: EC.burgundy };

/** Subtle editorial camera drift. */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTime();
  return <AbsoluteFill style={{ transform: `translate(${3 * Math.sin(t * 0.3)}px, ${3 * Math.sin(t * 0.23 + 1)}px) scale(1.008)` }}>{children}</AbsoluteFill>;
};

/**
 * GOLEX — THE GOLDEN GINGER EXPERIENCE · Editorial Kinetic Typography Edition (Khmer).
 * Stack: scenes (each in a transition Shell) · camera · grain · music + SFX.
 */
export const EditorialCommercial: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const jump = Math.round(MUSIC.jumpAt * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: EC.ivory }}>
      <Camera>
        {E_SCENES.map((s, i) => {
          const Scene = MAP[s.id];
          const next = E_SCENES[i + 1];
          const L = s.to - s.from + (next ? E_OVERLAP : 0);
          return (
            <Sequence key={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round(L * fps)} name={`${i + 1} · ${s.id}`}>
              <Shell L={L} enter={s.enter} exit={next?.enter} origin={ORIGIN[s.id]} wipeColor={WIPE[s.id]}>
                <Scene L={L} t0={s.from} />
              </Shell>
            </Sequence>
          );
        })}
      </Camera>
      <FilmGrain opacity={0.03} />
      {/* Music: Sunset Breeze extended by a bar-aligned loop (source 0 → bar 7, then source bar 5 → end). */}
      <Sequence durationInFrames={jump + XF} name="music A">
        <Audio src={SONG} volume={(f) => VOL * interpolate(f, [0, 4, jump, jump + XF], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
      <Sequence from={jump} name="music B (loop)">
        <Audio src={SONG} trimBefore={Math.round(MUSIC.resumeFrom * fps)} volume={(f) => VOL * interpolate(f, [0, XF, durationInFrames - jump - 36, durationInFrames - jump - 1], [0.35, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
      <Audio src={staticFile('audio/golex-editorial-sfx.wav')} volume={SFX_VOL} />
    </AbsoluteFill>
  );
};
