import React from 'react';
import { COLORS, rgba } from '../theme/colors';
import { useTime } from '../lib/useTime';

/** Golden light sweep confined to the GOLEX logo area on the end card. */
export const LogoSheen: React.FC<{ start: number; dur?: number; box?: { left: number; top: number; width: number; height: number } }> = ({
  start,
  dur = 1.0,
  box = { left: 280, top: 430, width: 520, height: 270 },
}) => {
  const t = useTime();
  const k = (t - start) / dur;
  if (k < 0 || k > 1.15) return null;
  const pos = -30 + 160 * k;
  return (
    <div
      style={{
        position: 'absolute',
        ...box,
        mixBlendMode: 'overlay',
        WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)',
        background: `linear-gradient(115deg, transparent ${pos - 9}%, ${rgba(COLORS.champagne, 0.95)} ${pos}%, transparent ${pos + 9}%)`,
      }}
    />
  );
};
