import React from 'react';
import { COLORS } from '../theme/colors';
import { easeOut } from '../lib/easing';
import { useTime } from '../lib/useTime';

/** Elegant thin gold ring that expands from centre — a geometric shape wipe. */
export const RingWipe: React.FC<{ at: number; cx?: number; cy?: number; dur?: number }> = ({ at, cx = 540, cy = 900, dur = 0.8 }) => {
  const t = useTime();
  const dt = t - at;
  if (dt < 0 || dt > dur) return null;
  const R = 60 + 1500 * easeOut(dt / dur);
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - R,
        top: cy - R,
        width: R * 2,
        height: R * 2,
        borderRadius: '50%',
        border: `4px solid ${COLORS.champagne}`,
        boxShadow: `0 0 18px ${COLORS.champagne}, inset 0 0 18px ${COLORS.champagne}`,
        opacity: (1 - dt / dur) * 0.9,
        mixBlendMode: 'screen',
      }}
    />
  );
};
