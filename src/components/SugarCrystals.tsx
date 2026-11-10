import React, { useMemo } from 'react';
import { random } from 'remotion';
import { envelope } from '../lib/easing';
import { useTime } from '../lib/useTime';

type Crystal = { x: number; y: number; dx: number; size: number; blur: number; rot: number; rs: number; delay: number };

/** Floating amber brown-sugar crystals (procedural SVG cubes) for the brown sugar beat. */
export const SugarCrystals: React.FC<{ start: number; end: number; count?: number }> = ({ start, end, count = 16 }) => {
  const t = useTime();
  const items = useMemo<Crystal[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (k: string) => random(`sugar-${i}-${k}`);
        const side = i % 2 ? -1 : 1;
        const blur = [0.6, 0.8, 3, 6][Math.floor(r('b') * 4)];
        return {
          x: 540 + side * (300 + r('x') * 200),
          y: 600 + r('y') * 900,
          dx: (r('d') - 0.5) * 40,
          size: (10 + r('s') * 10) * (blur > 5 ? 1.6 : 1) * (0.6 + r('k') * 0.5) * 2.6,
          blur,
          rot: r('r') * 360,
          rs: (r('q') - 0.5) * 50,
          delay: r('t') * 0.25,
        };
      }),
    [count],
  );
  if (t < start || t > end) return null;
  return (
    <>
      {items.map((c, i) => {
        const s0 = start + c.delay;
        const k = (t - s0) / (end - s0);
        const a = envelope(t, s0, end, 0.45, 0.3) * 0.95;
        if (a <= 0) return null;
        const x = c.x + c.dx * k + 6 * Math.sin(t * 1.3 + c.x);
        const y = c.y + 60 - 150 * k + 8 * Math.sin(t * 1.7 + c.y);
        const S = c.size;
        const m = S / 2;
        const q = S * 0.42;
        return (
          <svg
            key={i}
            width={S}
            height={S}
            viewBox={`0 0 ${S} ${S}`}
            style={{ position: 'absolute', left: x - m, top: y - m, opacity: a, filter: c.blur ? `blur(${c.blur}px)` : undefined, transform: `rotate(${c.rot + c.rs * (t - s0)}deg)` }}
          >
            <polygon points={`${m},${m - q} ${m + q * 0.9},${m - q * 0.45} ${m},${m} ${m - q * 0.9},${m - q * 0.45}`} fill="#F0BE6E" />
            <polygon points={`${m - q * 0.9},${m - q * 0.45} ${m},${m} ${m},${m + q} ${m - q * 0.9},${m + q * 0.5}`} fill="#B06828" />
            <polygon points={`${m + q * 0.9},${m - q * 0.45} ${m},${m} ${m},${m + q} ${m + q * 0.9},${m + q * 0.5}`} fill="#84461A" />
          </svg>
        );
      })}
    </>
  );
};
