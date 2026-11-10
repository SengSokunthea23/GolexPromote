import React from 'react';
import { COLORS, rgba } from '../theme/colors';
import { envelope } from '../lib/easing';
import { useTime } from '../lib/useTime';

/** Espresso gradient behind lower-third typography for mobile legibility. */
export const LowerBand: React.FC<{ start: number; end: number; strength: number; ein?: number; eout?: number }> = ({
  start,
  end,
  strength,
  ein = 0.6,
  eout = 0.3,
}) => {
  const t = useTime();
  const a = envelope(t, start, end, ein, eout) * strength;
  if (a <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1500,
        height: 420,
        opacity: a,
        background: `linear-gradient(180deg, ${rgba(COLORS.espresso, 0)} 0%, ${rgba(COLORS.espresso, 0.28)} 40%, ${rgba(COLORS.espresso, 0.7)} 72%, ${rgba(COLORS.espresso, 1)} 100%)`,
      }}
    />
  );
};
