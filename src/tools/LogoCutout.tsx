import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

/**
 * Utility composition: cuts the GOLEX badge out of public/images/Logo-Brand.png (which has a baked-in
 * glow background) and renders it on transparency. Regenerate the cut-out with:
 *   npm run logo
 * -> public/promo/logo-brand.png (1304 × 756, RGBA) used by every promo composition.
 *
 * The clip path traces the outer edge of the gold rim in source pixels, cropped to the badge box.
 */
export const LOGO_BOX = { x: 116, y: 133, w: 1304, h: 756 } as const;
const SRC_W = 1536;

// Outer rim of the badge, in source pixels (symmetric around x = 768).
const RIM = `
  M 120 312
  Q 120 295 141 290
  C 450 196 562 138 768 136
  C 974 138 1086 196 1395 290
  Q 1416 295 1416 312
  L 1416 738
  Q 1416 756 1395 760
  C 1086 842 974 884 768 886
  C 562 884 450 842 141 760
  Q 120 756 120 738
  Z`;

export const LogoCutout: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
    <svg width={0} height={0} style={{ position: 'absolute' }}>
      <clipPath id="golexBadge">
        <path d={RIM} transform={`translate(${-LOGO_BOX.x} ${-LOGO_BOX.y})`} />
      </clipPath>
    </svg>
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: 'url(#golexBadge)' }}>
      <Img src={staticFile('images/Logo-Brand.png')} style={{ position: 'absolute', width: SRC_W, left: -LOGO_BOX.x, top: -LOGO_BOX.y }} />
    </div>
  </AbsoluteFill>
);
