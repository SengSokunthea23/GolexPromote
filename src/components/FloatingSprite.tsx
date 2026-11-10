import React from 'react';
import { Img, staticFile } from 'remotion';
import { envelope } from '../lib/easing';
import { useTime } from '../lib/useTime';

export type FloatSpec = {
  src: string; // path inside /public
  width: number;
  blur?: number;
  from: [number, number];
  to: [number, number];
  start: number;
  end: number;
  opacity?: number;
  rot0?: number;
  rotSpeed?: number; // deg / s
};

/** A real ingredient (bean, ginger slice) drifting through frame with parallax, rotation and depth-of-field. */
export const FloatingSprite: React.FC<FloatSpec> = ({ src, width, blur = 0, from, to, start, end, opacity = 1, rot0 = 0, rotSpeed = 6 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const k = (t - start) / (end - start);
  const x = from[0] + (to[0] - from[0]) * k + 6 * Math.sin(t * 1.3 + from[0]);
  const y = from[1] + (to[1] - from[1]) * k + 8 * Math.sin(t * 1.7 + from[1]);
  const a = envelope(t, start, end, 0.45, 0.3) * opacity;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        width,
        left: x - width / 2,
        top: y - width / 2,
        opacity: a,
        transform: `rotate(${rot0 + rotSpeed * (t - start)}deg)`,
        filter: `${blur ? `blur(${blur}px) ` : ''}drop-shadow(0 10px 14px rgba(23,11,13,0.45))`,
      }}
    />
  );
};
