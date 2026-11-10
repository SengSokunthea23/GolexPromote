import React from 'react';
import { OffthreadVideo, staticFile } from 'remotion';
import { easeInOut } from '../lib/easing';
import { useTime } from '../lib/useTime';
import { HEIGHT, PUSH_INS, WIDTH } from '../theme/timeline';

/**
 * The original Coffee-1.mp4 (Khmer text + voice/music preserved) with
 * a warm cinematic grade and a slow push-in per scene.
 */
export const BaseFootage: React.FC = () => {
  const t = useTime();
  let scale = 1;
  let ox = 540;
  let oy = 960;
  for (const [a, b, amt, ax, ay] of PUSH_INS) {
    if (t >= a && t < b) {
      scale = 1 + amt * easeInOut((t - a) / (b - a));
      ox = ax;
      oy = ay;
      break;
    }
  }
  return (
    <OffthreadVideo
      src={staticFile('video/Coffee-1.mp4')}
      style={{
        width: WIDTH,
        height: HEIGHT,
        transform: `scale(${scale})`,
        transformOrigin: `${ox}px ${oy}px`,
        filter: 'contrast(1.06) saturate(1.04) sepia(0.05)',
      }}
    />
  );
};
