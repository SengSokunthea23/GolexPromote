import React from 'react';
import { GoldText } from '../components/GoldText';
import { Line } from '../components/Line';
import { LogoSheen } from '../components/LogoSheen';
import { LowerBand } from '../components/LowerBand';
import { Reveal } from '../components/Reveal';
import { RingWipe } from '../components/RingWipe';
import { RuleLabel } from '../components/RuleLabel';
import { Sparkle } from '../components/Sparkle';

/** 26.85–30s · Final hero: original GOLEX logo + Khmer CTA, with sheen, glints and tagline. */
export const EndCardScene: React.FC = () => (
  <>
    <RingWipe at={0} />
    <LowerBand start={0.35} end={4} strength={0.55} ein={0.7} />
    <LogoSheen start={1.4} />
    <Sparkle x={250} y={1050} at={0.55} />
    <Sparkle x={930} y={280} at={0.85} />
    <Sparkle x={760} y={470} at={1.65} />
    <Sparkle x={300} y={640} at={2.05} />
    <Sparkle x={850} y={1150} at={2.4} />
    <RuleLabel text="THE GOLDEN GINGER EXPERIENCE" top={1748} start={0.5} end={4} family="serif" weight={600} size={30} tracking={5} lineLength={60} gap={22} ein={1} />
    <Line top={1802}>
      <Reveal start={0.9} end={4} mode="rise">
        <GoldText family="micro" weight={300} size={18} tracking={4} variant="cream">
          PREMIUM QUALITY  ·  GINGER INSTANT COFFEE  5 IN 1
        </GoldText>
      </Reveal>
    </Line>
  </>
);
