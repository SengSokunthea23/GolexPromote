import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { CornerFrame } from '../components/CornerFrame';
import { FilmGrain } from '../components/FilmGrain';
import { GoldDust } from '../components/GoldDust';
import { LightSweeps } from '../components/LightSweeps';
import { Vignette } from '../components/Vignette';
import { COLORS } from '../theme/colors';
import { loadFonts } from '../theme/fonts';
import { PromoBackground } from './PromoBackground';
import { CupScene } from './scenes';
import { EndScene, IngredientsScene, LogoScene, Model1Scene, Model2Scene, PackScene, SachetScene } from './scenes';
import { P_BIG, P_CUTS, P_OVERLAP, P_SCENES } from './timeline';

loadFonts();

const MAP: Record<string, React.FC<{ L: number; khmer?: boolean }>> = {
  logo: LogoScene,
  cup: CupScene,
  pack: PackScene,
  sachet: SachetScene,
  ingredients: IngredientsScene,
  model1: Model1Scene,
  model2: Model2Scene,
  end: EndScene,
};

/**
 * GOLEX — THE GOLDEN GINGER EXPERIENCE (all-new promo, built from stills only).
 * Stack: studio backdrop · gold dust · scenes · cut sweeps · vignette · frame · grain · music + SFX.
 */
export const PromoCommercial: React.FC<{ khmer?: boolean }> = ({ khmer = false }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.espresso }}>
      <PromoBackground />
      <GoldDust amount={0.9} />
      {P_SCENES.map((s, i) => {
        const Scene = MAP[s.id];
        const last = i === P_SCENES.length - 1;
        const L = s.to - s.from + (last ? 0 : P_OVERLAP);
        return (
          <Sequence key={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round(L * fps)} name={`${i + 1} · ${s.id}`}>
            <Scene L={L} khmer={khmer} />
          </Sequence>
        );
      })}
      <LightSweeps cuts={P_CUTS} big={P_BIG} />
      <Vignette />
      <CornerFrame start={0.8} />
      <FilmGrain opacity={0.06} />
      <Audio src={staticFile('audio/BrightDanceEnergy-usesuno.com.mp3')} volume={0.8} />
      <Audio src={staticFile('audio/golex-sfx.wav')} volume={1} />
    </AbsoluteFill>
  );
};

export const PromoKhmerCommercial: React.FC = () => <PromoCommercial khmer />;
