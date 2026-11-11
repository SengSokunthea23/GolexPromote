import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from 'remotion';
import { FilmGrain } from '../components/FilmGrain';
import { GoldDust } from '../components/GoldDust';
import { LightSweeps } from '../components/LightSweeps';
import { Vignette } from '../components/Vignette';
import { pulse } from '../lib/easing';
import { useTime } from '../lib/useTime';
import { COLORS } from '../theme/colors';
import { loadLuxFonts } from './fonts';
import { Shell } from './kit';
import { BenefitsScene, CupScene, EndScene, IngredientsScene, IntroScene, Model1Scene, Model2Scene, PackScene, SceneProps, TitleScene } from './scenes';
import { L_DURATION_S, L_OVERLAP, L_SCENES, bar } from './timeline';

loadLuxFonts();

const MAP: Record<string, React.FC<SceneProps>> = {
  intro: IntroScene,
  title: TitleScene,
  pack: PackScene,
  cup: CupScene,
  ingredients: IngredientsScene,
  benefits: BenefitsScene,
  model1: Model1Scene,
  model2: Model2Scene,
  end: EndScene,
};

/** Per-scene stage settings: backdrop, glow centre and where circle reveals open from. */
const STAGE: Record<string, { bg: 'silk' | 'cream'; cy?: number; origin?: [number, number] }> = {
  intro: { bg: 'silk', cy: 860 },
  title: { bg: 'cream', origin: [540, 860] },
  pack: { bg: 'silk', cy: 900, origin: [540, 900] },
  cup: { bg: 'silk', cy: 1040, origin: [540, 1040] },
  ingredients: { bg: 'silk', cy: 1000 },
  benefits: { bg: 'silk', cy: 1040 },
  model1: { bg: 'silk', cy: 980, origin: [450, 1150] },
  model2: { bg: 'silk', cy: 1000 },
  end: { bg: 'silk', cy: 960, origin: [540, 960] },
};

const CUTS = L_SCENES.slice(1).map((s) => s.from);
const HITS = [bar(3), bar(11)]; // music lift (7.35 s) and the big final hit (26.01 s)

/** Subtle global camera: a slow breathing drift plus a scale punch on the two big musical hits. */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTime();
  const punch = HITS.reduce((a, h) => a + pulse(t, h + 0.03, 0.09), 0);
  const s = 1 + 0.018 * punch;
  const dx = 4 * Math.sin(t * 0.37);
  const dy = 5 * Math.sin(t * 0.29 + 1);
  return <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(${1.012 * s})` }}>{children}</AbsoluteFill>;
};

/**
 * GOLEX — THE GOLDEN GINGER EXPERIENCE · Royal Silk (សូត្រមាស), Khmer luxury cut.
 * Stack: scenes (each in a transition Shell) · camera · gold dust · cut sweeps · vignette · grain · music + SFX.
 */
export const LuxCommercial: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.espresso }}>
      <Camera>
        {L_SCENES.map((s, i) => {
          const Scene = MAP[s.id];
          const next = L_SCENES[i + 1];
          const L = s.to - s.from + (next ? L_OVERLAP : 0);
          const st = STAGE[s.id];
          return (
            <Sequence key={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round(L * fps)} name={`${i + 1} · ${s.id}`}>
              <Shell L={L} t0={s.from} enter={s.enter} exit={next?.enter} bg={st.bg} cy={st.cy} origin={st.origin}>
                <Scene L={L} />
              </Shell>
            </Sequence>
          );
        })}
      </Camera>
      <GoldDust amount={0.55} />
      <LightSweeps cuts={CUTS} big={HITS} />
      <Vignette />
      <FilmGrain opacity={0.05} />
      <Audio
        src={staticFile('audio/Golden Bells - usesuno.com.mp3')}
        volume={(f) => interpolate(f, [0, 6, durationInFrames - 36, durationInFrames - 1], [0, 0.78, 0.78, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
      <Audio src={staticFile('audio/golex-lux-sfx.wav')} volume={0.5} />
    </AbsoluteFill>
  );
};

export const LUX_DURATION_FRAMES = (fps: number) => Math.round(L_DURATION_S * fps);
