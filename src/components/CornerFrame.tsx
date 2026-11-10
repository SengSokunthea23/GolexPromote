import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../theme/colors';
import { easeOut } from '../lib/easing';
import { useTime } from '../lib/useTime';
import { HEIGHT, WIDTH } from '../theme/timeline';

/** Elegant editorial corner brackets that draw on after the opening beat. */
export const CornerFrame: React.FC<{ start?: number; inset?: number; arm?: number }> = ({ start = 0.55, inset = 38, arm = 64 }) => {
  const t = useTime();
  const p = easeOut((t - start) / 0.9);
  if (p <= 0) return null;
  const L = arm * p;
  const m = inset;
  const paths = [
    `M${m} ${m + L} L${m} ${m} L${m + L} ${m}`,
    `M${WIDTH - m - L} ${m} L${WIDTH - m} ${m} L${WIDTH - m} ${m + L}`,
    `M${m} ${HEIGHT - m - L} L${m} ${HEIGHT - m} L${m + L} ${HEIGHT - m}`,
    `M${WIDTH - m - L} ${HEIGHT - m} L${WIDTH - m} ${HEIGHT - m} L${WIDTH - m} ${HEIGHT - m - L}`,
  ];
  return (
    <AbsoluteFill style={{ opacity: 0.65 * p }}>
      <svg width={WIDTH} height={HEIGHT}>
        {paths.map((d) => (
          <path key={d} d={d} stroke={COLORS.gold} strokeWidth={2} fill="none" />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
