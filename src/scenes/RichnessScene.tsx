import React from 'react';
import { GoldText } from '../components/GoldText';
import { KineticText } from '../components/KineticText';
import { Line } from '../components/Line';
import { LowerBand } from '../components/LowerBand';
import { Reveal } from '../components/Reveal';
import { RingWipe } from '../components/RingWipe';
import { RuleLabel } from '../components/RuleLabel';

/** 20.35–23.95s · Male lifestyle model #1 — "Experience the Richness". */
export const RichnessScene: React.FC = () => (
  <>
    <RingWipe at={0} />
    <LowerBand start={0.15} end={3.6} strength={0.7} eout={0.15} />
    <RuleLabel text="RICH  ·  CREAMY  ·  WARMING  ·  ENERGIZING" top={1680} start={0.3} end={3.45} family="micro" weight={500} size={20} tracking={4} lineLength={50} gap={20} />
    <KineticText text="Experience the Richness" top={1712} start={0.5} end={3.45} size={70} />
    <Line top={1822}>
      <Reveal start={1.05} end={3.45} mode="rise">
        <GoldText family="micro" weight={300} size={19} tracking={6} variant="cream">
          GOLEX  GINGER INSTANT COFFEE  5 IN 1
        </GoldText>
      </Reveal>
    </Line>
  </>
);
