import React from 'react';
import { Composition } from 'remotion';
import { GolexCommercial } from './GolexCommercial';
import { PromoCommercial, PromoKhmerCommercial } from './promo/PromoCommercial';
import { P_DURATION_S, P_FPS, P_H, P_W } from './promo/timeline';
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from './theme/timeline';
import { LuxCommercial } from './lux/LuxCommercial';
import { L_DURATION_S, L_FPS, L_H, L_W } from './lux/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    {/* v2 · all-new promo built purely from product stills (no source footage) */}
    <Composition id="GolexPromo" component={PromoCommercial} durationInFrames={P_DURATION_S * P_FPS} fps={P_FPS} width={P_W} height={P_H} />
    <Composition id="GolexKhmer" component={PromoKhmerCommercial} durationInFrames={P_DURATION_S * P_FPS} fps={P_FPS} width={P_W} height={P_H} />
    {/* v3 · Royal Silk (សូត្រមាស) — Khmer luxury cut, beat-synced to "Golden Bells" + synthesised SFX */}
    <Composition id="GolexKhmerLux" component={LuxCommercial} durationInFrames={L_DURATION_S * L_FPS} fps={L_FPS} width={L_W} height={L_H} />
    {/* v1 · re-edit of the original Coffee-1.mp4 */}
    <Composition id="GolexCommercial" component={GolexCommercial} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
