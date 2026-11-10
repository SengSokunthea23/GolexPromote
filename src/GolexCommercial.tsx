import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { BaseFootage } from './components/BaseFootage';
import { CornerFrame } from './components/CornerFrame';
import { FilmGrain } from './components/FilmGrain';
import { GoldDust } from './components/GoldDust';
import { LightSweeps } from './components/LightSweeps';
import { Vignette } from './components/Vignette';
import { useTime } from './lib/useTime';
import { EndCardScene } from './scenes/EndCardScene';
import { IngredientsScene } from './scenes/IngredientsScene';
import { OpeningScene } from './scenes/OpeningScene';
import { PackagingScene } from './scenes/PackagingScene';
import { RichnessScene } from './scenes/RichnessScene';
import { WarmthScene } from './scenes/WarmthScene';
import { COLORS } from './theme/colors';
import { loadFonts } from './theme/fonts';
import { SCENES, sec } from './theme/timeline';

loadFonts();

const Scene: React.FC<{ span: { from: number; to: number }; name: string; children: React.ReactNode }> = ({ span, name, children }) => (
  <Sequence from={sec(span.from)} durationInFrames={sec(span.to) - sec(span.from)} name={name}>
    {children}
  </Sequence>
);

/**
 * GOLEX — THE GOLDEN GINGER EXPERIENCE
 * Layer stack (bottom → top): graded footage · vignette · gold dust · light sweeps ·
 * scene graphics & typography · editorial frame · film grain · sound design.
 */
export const GolexCommercial: React.FC = () => {
  const t = useTime();
  const onModel = t >= SCENES.richness.from && t < SCENES.endCard.from;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.espresso }}>
      <BaseFootage />
      <Vignette />
      <GoldDust amount={onModel ? 0.55 : 1} />
      <LightSweeps />

      <Scene span={SCENES.opening} name="01 Opening · Cup hero">
        <OpeningScene />
      </Scene>
      <Scene span={SCENES.packaging} name="02 Packaging reveal">
        <PackagingScene />
      </Scene>
      <Scene span={SCENES.ingredients} name="03 Five ingredients">
        <IngredientsScene />
      </Scene>
      <Scene span={SCENES.richness} name="04 Model · Richness">
        <RichnessScene />
      </Scene>
      <Scene span={SCENES.warmth} name="05 Model · Warmth">
        <WarmthScene />
      </Scene>
      <Scene span={SCENES.endCard} name="06 End card · Logo + CTA">
        <EndCardScene />
      </Scene>

      <CornerFrame />
      <FilmGrain />
      {/* Original voice/music comes from the footage itself; SFX bed sits underneath. */}
      <Audio src={staticFile('audio/golex-sfx.wav')} volume={0.8} />
    </AbsoluteFill>
  );
};
