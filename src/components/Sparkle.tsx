import React from 'react';
import { COLORS } from '../theme/colors';
import { pulse } from '../lib/easing';
import { useTime } from '../lib/useTime';

/** Four-point star glint that blooms at `at` seconds. */
export const Sparkle: React.FC<{ x: number; y: number; at: number; size?: number }> = ({ x, y, at, size = 92 }) => {
  const t = useTime();
  const a = pulse(t, at, 0.18);
  if (a < 0.01) return null;
  const h = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: 'absolute', left: x - h, top: y - h, opacity: a, mixBlendMode: 'screen', transform: `scale(${0.6 + 0.4 * a}) rotate(${(t - at) * 40}deg)` }}
    >
      <defs>
        <radialGradient id={`sg-${at}`}>
          <stop offset="0%" stopColor="#fff" />
          <stop offset="35%" stopColor={COLORS.champagne} />
          <stop offset="100%" stopColor={COLORS.champagne} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d={`M${h} 0 Q${h + 3} ${h - 3} ${size} ${h} Q${h + 3} ${h + 3} ${h} ${size} Q${h - 3} ${h + 3} 0 ${h} Q${h - 3} ${h - 3} ${h} 0Z`}
        fill={`url(#sg-${at})`}
      />
      <circle cx={h} cy={h} r={size * 0.12} fill={`url(#sg-${at})`} />
    </svg>
  );
};
