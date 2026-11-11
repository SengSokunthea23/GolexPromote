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

/** Widest a single headline line may be (1080 frame minus side margins). */
const MAX_W = 980;
let ctx: CanvasRenderingContext2D | null = null;
/** Text width in px (fonts are already loaded before any frame renders — see loadFonts). */
const measure = (s: string, font: string) => {
  if (typeof document === 'undefined') return 0;
  ctx = ctx ?? document.createElement('canvas').getContext('2d');
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(s).width;
};

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
    // "|" is a word separator in the other themes' copy — show it as a space here.
    const line = text.split('|').join(' ');
    // Shrink the font if the line would be wider than the safe area, so it never runs off-screen.
    const size = st.fontSize as number;
    const w = measure(line, `${st.fontWeight} ${size}px ${st.fontFamily}`);
    const fit = w > MAX_W ? MAX_W / w : 1;
    return (
      <Line top={top}>
        <div style={{ ...st, ...(fit < 1 ? typeStyle({ family: 'khmer', weight: 600, variant: 'gold', ...type, size: Math.floor(size * fit) }) : {}), opacity: out * q, transform: `translateY(${30 * (1 - q)}px)` }}>
          {line}
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
