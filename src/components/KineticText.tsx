import React from 'react';
import { easeInOut, easeOut } from '../lib/easing';
import { useTime } from '../lib/useTime';
import { Line } from './Line';
import { TypeStyle, typeStyle } from './GoldText';

type Props = {
  text: string;
  top: number;
  start: number;
  end: number;
  /** delay between letters (s) */
  stagger?: number;
  eout?: number;
} & Partial<TypeStyle>;

/** Luxury serif kinetic headline: each letter rises and fades in on a stagger. */
export const KineticText: React.FC<Props> = ({ text, top, start, end, stagger = 0.032, eout = 0.35, ...type }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const out = t > end - eout ? 1 - easeInOut((t - (end - eout)) / eout) : 1;
  const st = typeStyle({
    family: 'serif',
    weight: 600,
    size: 74,
    variant: 'gold',
    ...type,
    italic: type.italic ?? type.family !== 'khmer',
  });
  if (type.family === 'khmer') {
    const q = easeOut((t - start) / 0.65);
    return (
      <Line top={top}>
        <div style={{ ...st, opacity: out * q, transform: `translateY(${30 * (1 - q)}px)` }}>
          {text}
        </div>
      </Line>
    );
  }
  let k = -1;
  return (
    <Line top={top}>
      <div style={{ opacity: out, transform: `translateY(${-14 * (1 - out)}px)`, display: 'flex' }}>
        {text.split('').map((ch, i) => {
          if (ch === ' ') return <span key={i} style={{ ...st, width: (type.size ?? 74) * 0.26, paddingLeft: 0 }} />;
          k += 1;
          const q = easeOut((t - start - k * stagger) / 0.65);
          return (
            <span key={i} style={{ ...st, paddingLeft: 0, display: 'inline-block', opacity: q, transform: `translateY(${30 * (1 - q)}px)` }}>
              {ch}
            </span>
          );
        })}
      </div>
    </Line>
  );
};
