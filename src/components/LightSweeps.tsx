import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, rgba } from '../theme/colors';
import { pulse } from '../lib/easing';
import { useTime } from '../lib/useTime';
import { BIG_CUTS, CUTS } from '../theme/timeline';

/**
 * Golden diagonal light sweep + soft exposure flash on every cut of the
 * original footage. Bigger beats (scene changes) get a stronger sweep.
 */
export const LightSweeps: React.FC<{ cuts?: number[]; big?: number[] }> = ({ cuts = CUTS, big = BIG_CUTS }) => {
  const t = useTime();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {cuts.map((c) => {
        const dt = t - c;
        if (dt < -0.35 || dt > 0.4) return null;
        const strength = big.includes(c) ? 1 : 0.6;
        const pos = 18 + ((dt + 0.35) / 0.75) * 64; // % across a 200% box
        return (
          <React.Fragment key={c}>
            <div
              style={{
                position: 'absolute',
                left: '-50%',
                top: '-50%',
                width: '200%',
                height: '200%',
                mixBlendMode: 'screen',
                background: `linear-gradient(116deg, transparent ${pos - 4}%, ${rgba(COLORS.gold, 0.55 * strength)} ${pos}%, transparent ${pos + 4}%)`,
              }}
            />
            <AbsoluteFill style={{ background: COLORS.champagne, opacity: pulse(t, c, 0.09) * 0.16 * strength, mixBlendMode: 'screen' }} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
