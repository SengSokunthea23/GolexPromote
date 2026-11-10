import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, rgba } from '../theme/colors';
import { clamp } from '../lib/easing';
import { useTime } from '../lib/useTime';

/** Opening golden anamorphic flare that streaks across the dark first beat. */
export const AnamorphicFlare: React.FC<{ end?: number; y?: number }> = ({ end = 0.75, y = 940 }) => {
  const t = useTime();
  if (t > end) return null;
  const a = Math.sin(clamp(t / end) * Math.PI);
  const x = 100 + (880 * t) / end;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: a }}>
      <div
        style={{
          position: 'absolute',
          left: x - 1100,
          top: y - 6,
          width: 2200,
          height: 12,
          filter: 'blur(4px)',
          background: `linear-gradient(90deg, transparent 0%, ${rgba(COLORS.champagne, 0.9)} 50%, transparent 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - 260,
          top: y - 120,
          width: 520,
          height: 240,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${rgba(COLORS.champagne, 0.45)} 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
