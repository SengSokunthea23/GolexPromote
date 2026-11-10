import React from 'react';
import { GoldText } from '../components/GoldText';
import { KineticText } from '../components/KineticText';
import { Line } from '../components/Line';
import { LowerBand } from '../components/LowerBand';
import { Reveal } from '../components/Reveal';
import { RuleLabel } from '../components/RuleLabel';
import { Sparkle } from '../components/Sparkle';

/** 4.4–8.3s · GOLEX 5 IN 1 pack + sachet reveal. All claims are copied from the packaging. */
export const PackagingScene: React.FC = () => (
  <>
    <LowerBand start={0.2} end={3.85} strength={0.55} />
    <Sparkle x={770} y={600} at={2.5} size={104} />
    <Sparkle x={330} y={900} at={2.9} size={104} />
    <Line top={1544}>
      <Reveal start={0.35} end={3.75} mode="wipe" ein={0.8}>
        <GoldText family="sans" weight={700} size={40} tracking={6} variant="cream">
          GINGER INSTANT COFFEE
        </GoldText>
      </Reveal>
    </Line>
    <KineticText text="The 5 in 1 Experience" top={1592} start={0.55} end={3.75} size={72} />
    <RuleLabel text="RICH & CREAMY  +  WARMING & ENERGIZING" top={1704} start={0.95} end={3.75} family="micro" weight={500} size={21} tracking={3} lineLength={56} gap={20} />
    <Line top={1750}>
      <Reveal start={1.3} end={3.75} mode="rise">
        <GoldText family="micro" weight={300} size={20} tracking={4} variant="cream">
          25 SACHETS  ·  19 g × 25  ·  NET WEIGHT 475 g
        </GoldText>
      </Reveal>
    </Line>
  </>
);
