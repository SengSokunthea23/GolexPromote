import React, { useMemo } from 'react';
import { AbsoluteFill, random } from 'remotion';
import { COLORS, rgba } from '../theme/colors';
import { useTime } from '../lib/useTime';
import { HEIGHT, WIDTH } from '../theme/timeline';

type P = { x: number; y: number; v: number; s: number; ph: number; a: number };

const make = (n: number, seed: string, v: [number, number], s: [number, number], a: [number, number]): P[] =>
  Array.from({ length: n }, (_, i) => {
    const r = (k: string) => random(`${seed}-${i}-${k}`);
    return {
      x: r('x') * WIDTH,
      y: r('y') * HEIGHT,
      v: v[0] + r('v') * (v[1] - v[0]),
      s: s[0] + r('s') * (s[1] - s[0]),
      ph: r('p') * Math.PI * 2,
      a: a[0] + r('a') * (a[1] - a[0]),
    };
  });

/** Drifting gold dust + soft bokeh — the atmospheric "particle air" of the spot. */
export const GoldDust: React.FC<{ amount?: number }> = ({ amount = 1 }) => {
  const t = useTime();
  const dust = useMemo(() => make(90, 'dust', [18, 55], [1.2, 3.6], [0.25, 0.8]), []);
  const bokeh = useMemo(() => make(14, 'bokeh', [8, 20], [18, 46], [0.05, 0.12]), []);
  const draw = (p: P, i: number, key: string) => {
    const y = ((((p.y - p.v * t) % (HEIGHT + 100)) + HEIGHT + 100) % (HEIGHT + 100)) - 50;
    const x = p.x + 14 * Math.sin(t * 0.6 + p.ph);
    const op = p.a * (0.55 + 0.45 * Math.sin(t * 2.2 + p.ph * 3)) * amount;
    const d = p.s * 6;
    return (
      <div
        key={key + i}
        style={{
          position: 'absolute',
          left: x - d / 2,
          top: y - d / 2,
          width: d,
          height: d,
          borderRadius: '50%',
          opacity: op,
          background: `radial-gradient(circle, ${COLORS.champagne} 0%, ${rgba(COLORS.champagne, 0.35)} 22%, ${rgba(COLORS.champagne, 0)} 55%)`,
          mixBlendMode: 'screen',
        }}
      />
    );
  };
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {bokeh.map((p, i) => draw(p, i, 'b'))}
      {dust.map((p, i) => draw(p, i, 'd'))}
    </AbsoluteFill>
  );
};
