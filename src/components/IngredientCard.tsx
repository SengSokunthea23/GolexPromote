import React from 'react';
import { COLORS } from '../theme/colors';
import { GoldText } from './GoldText';
import { Line } from './Line';
import { Reveal } from './Reveal';

type Props = { index: string; name: string; sub: string; start: number; end: number };

/** Premium feature card: serif numeral │ gold divider │ name + descriptor. */
export const IngredientCard: React.FC<Props> = ({ index, name, sub, start, end }) => (
  <Line top={1712}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Reveal start={start} end={end} mode="rise" ein={0.6} eout={0.25}>
        <GoldText family="serif" weight={400} italic size={104}>
          {index}
        </GoldText>
      </Reveal>
      <Reveal start={start + 0.05} end={end} mode="vwipe" ein={0.5} eout={0.25} style={{ margin: '0 34px' }}>
        <div
          style={{
            width: 2,
            height: 118,
            background: `linear-gradient(180deg, transparent 0%, ${COLORS.gold} 20%, ${COLORS.champagne} 50%, ${COLORS.gold} 80%, transparent 100%)`,
          }}
        />
      </Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Reveal start={start + 0.12} end={end} mode="wipe" ein={0.6} eout={0.25}>
          <GoldText family="sans" weight={700} size={38} tracking={5} variant="cream" style={{ paddingLeft: 0 }}>
            {name}
          </GoldText>
        </Reveal>
        <Reveal start={start + 0.28} end={end} mode="wipe" ein={0.6} eout={0.25} style={{ marginTop: 14 }}>
          <GoldText family="micro" weight={500} size={21} tracking={6} style={{ paddingLeft: 0 }}>
            {sub}
          </GoldText>
        </Reveal>
      </div>
    </div>
  </Line>
);
