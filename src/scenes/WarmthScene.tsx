import React from 'react';
import { KineticText } from '../components/KineticText';
import { LowerBand } from '../components/LowerBand';
import { RuleLabel } from '../components/RuleLabel';

/** 23.95–26.85s · Male lifestyle model #2 — "Your Daily Moment of Warmth". */
export const WarmthScene: React.FC = () => (
  <>
    <LowerBand start={0} end={2.9} strength={0.7} ein={0.01} />
    <KineticText text="Your Daily Moment" top={1690} start={0.3} end={2.77} size={76} />
    <RuleLabel text="OF WARMTH" top={1806} start={0.85} end={2.77} family="sans" weight={600} size={28} tracking={18} variant="cream" lineLength={90} gap={26} />
  </>
);
