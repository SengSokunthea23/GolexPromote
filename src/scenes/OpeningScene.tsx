import React from 'react';
import { AnamorphicFlare } from '../components/AnamorphicFlare';
import { GoldText } from '../components/GoldText';
import { KineticText } from '../components/KineticText';
import { Line } from '../components/Line';
import { LowerBand } from '../components/LowerBand';
import { Reveal } from '../components/Reveal';

/** 0–4.4s · Luxury golden opening over the cup hero shot. Times are local to the scene. */
export const OpeningScene: React.FC = () => (
  <>
    <AnamorphicFlare />
    <LowerBand start={0.9} end={4.35} strength={0.62} />
    <KineticText text="The Golden Ginger" top={1712} start={1.05} end={4.25} size={74} />
    <Line top={1830}>
      <Reveal start={1.6} end={4.25} mode="wipe" ein={0.9}>
        <GoldText family="sans" weight={500} size={26} tracking={17} variant="cream">
          EXPERIENCE
        </GoldText>
      </Reveal>
    </Line>
  </>
);
