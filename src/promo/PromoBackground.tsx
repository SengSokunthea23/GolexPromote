import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, rgba } from '../theme/colors';
import { useTime } from '../lib/useTime';

/** Burgundy / ruby studio backdrop with a slow golden god-ray fan and breathing crimson glow. */
export const PromoBackground: React.FC = () => {
  const t = useTime();
  const breathe = 0.85 + 0.15 * Math.sin(t * 0.9);
  const rays = `repeating-conic-gradient(from ${t * 3}deg at 50% 46%, ${rgba(COLORS.champagne, 0.16)} 0deg, transparent 5deg, transparent 15deg, ${rgba(COLORS.gold, 0.1)} 20deg, transparent 25deg, transparent 36deg)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 60% at 50% 46%, ${COLORS.crimson} 0%, ${COLORS.ruby} 38%, ${COLORS.burgundy} 72%, ${COLORS.espresso} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: rays,
          mixBlendMode: 'screen',
          opacity: 0.55,
          WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 46%, #000 0%, transparent 78%)',
          maskImage: 'radial-gradient(ellipse 75% 55% at 50% 46%, #000 0%, transparent 78%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.55 * breathe,
          background: `radial-gradient(circle at 50% 46%, ${rgba(COLORS.gold, 0.35)} 0%, transparent 46%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba(COLORS.espresso, 0.55)} 0%, transparent 22%, transparent 70%, ${rgba(COLORS.espresso, 0.75)} 100%)` }} />
    </AbsoluteFill>
  );
};
