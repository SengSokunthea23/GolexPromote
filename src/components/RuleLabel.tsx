import React from 'react';
import { COLORS } from '../theme/colors';
import { GoldText, TypeStyle } from './GoldText';
import { Line } from './Line';
import { Reveal } from './Reveal';

export const GoldRule: React.FC<{ length: number; thickness?: number }> = ({ length, thickness = 2 }) => (
  <span
    style={{
      display: 'inline-block',
      width: length,
      height: thickness,
      background: `linear-gradient(90deg, transparent 0%, ${COLORS.gold} 18%, ${COLORS.champagne} 50%, ${COLORS.gold} 82%, transparent 100%)`,
    }}
  />
);

type Props = {
  text: string;
  top: number;
  start: number;
  end: number;
  lineLength?: number;
  gap?: number;
  ein?: number;
} & TypeStyle;

/** Micro label flanked by animated gold hairlines — opens from the centre. */
export const RuleLabel: React.FC<Props> = ({ text, top, start, end, lineLength = 60, gap = 22, ein = 0.9, ...type }) => (
  <Line top={top}>
    <Reveal start={start} end={end} mode="center" ein={ein}>
      <div style={{ display: 'flex', alignItems: 'center', gap }}>
        <GoldRule length={lineLength} />
        <GoldText {...type}>{text}</GoldText>
        <GoldRule length={lineLength} />
      </div>
    </Reveal>
  </Line>
);
