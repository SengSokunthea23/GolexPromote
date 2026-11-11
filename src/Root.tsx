import React from 'react';
import { Composition } from 'remotion';
import { GolexCommercial } from './GolexCommercial';
import { PromoCommercial, PromoKhmerCommercial } from './promo/PromoCommercial';
import { P_DURATION_S, P_FPS, P_H, P_W } from './promo/timeline';
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from './theme/timeline';
import { LuxCommercial } from './lux/LuxCommercial';
import { L_DURATION_S, L_FPS, L_H, L_W } from './lux/timeline';
import { SoftCommercial } from './soft/SoftCommercial';
import { LOGO_BOX, LogoCutout } from './tools/LogoCutout';
import { S_DURATION_S, S_FPS, S_H, S_W } from './soft/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    {/* v2 · all-new promo built purely from product stills (no source footage) */}
    <Composition id="GolexPromo" component={PromoCommercial} durationInFrames={P_DURATION_S * P_FPS} fps={P_FPS} width={P_W} height={P_H} />
    <Composition id="GolexKhmer" component={PromoKhmerCommercial} durationInFrames={P_DURATION_S * P_FPS} fps={P_FPS} width={P_W} height={P_H} />
    {/* v3 · Royal Silk (សូត្រមាស) — Khmer luxury cut, beat-synced to "Golden Bells" + synthesised SFX */}
    <Composition id="GolexKhmerLux" component={LuxCommercial} durationInFrames={L_DURATION_S * L_FPS} fps={L_FPS} width={L_W} height={L_H} />
    {/* v4 · Soft Luxury Edition — bright editorial Khmer cut, beat-synced to "Golden Lounge" + synthesised SFX */}
    <Composition id="GolexSoftLux" component={SoftCommercial} durationInFrames={S_DURATION_S * S_FPS} fps={S_FPS} width={S_W} height={S_H} />
    {/* tool · cuts the badge out of images/Logo-Brand.png -> promo/logo-brand.png (npm run logo) */}
    <Composition id="LogoCutout" component={LogoCutout} durationInFrames={1} fps={30} width={LOGO_BOX.w} height={LOGO_BOX.h} />
    {/* v1 · re-edit of the original Coffee-1.mp4 */}
    <Composition id="GolexCommercial" component={GolexCommercial} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
