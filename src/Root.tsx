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
import { MidnightCommercial } from './midnight/MidnightCommercial';
import { M_DURATION_S, M_FPS, M_H, M_W } from './midnight/timeline';
import { IsoCommercial } from './iso/IsoCommercial';
import { I_DURATION_S, I_FPS, I_H, I_W } from './iso/timeline';
import { EditorialCommercial } from './editorial/EditorialCommercial';
import { E_DURATION_S, E_FPS, E_H, E_W } from './editorial/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    {/* v2 · all-new promo built purely from product stills (no source footage) */}
    <Composition id="GolexPromo" component={PromoCommercial} durationInFrames={P_DURATION_S * P_FPS} fps={P_FPS} width={P_W} height={P_H} />
    <Composition id="GolexKhmer" component={PromoKhmerCommercial} durationInFrames={P_DURATION_S * P_FPS} fps={P_FPS} width={P_W} height={P_H} />
    {/* v3 · Royal Silk (សូត្រមាស) — Khmer luxury cut, beat-synced to "Golden Bells" + synthesised SFX */}
    <Composition id="GolexKhmerLux" component={LuxCommercial} durationInFrames={L_DURATION_S * L_FPS} fps={L_FPS} width={L_W} height={L_H} />
    {/* v4 · Soft Luxury Edition — bright editorial Khmer cut, beat-synced to "Golden Lounge" + synthesised SFX */}
    <Composition id="GolexSoftLux" component={SoftCommercial} durationInFrames={S_DURATION_S * S_FPS} fps={S_FPS} width={S_W} height={S_H} />
    {/* v5 · Midnight Luxury Edition — dark cinematic Khmer cut, beat-synced to "Rising Gold" + synthesised SFX */}
    <Composition id="GolexMidnight" component={MidnightCommercial} durationInFrames={M_DURATION_S * M_FPS} fps={M_FPS} width={M_W} height={M_H} />
    {/* v6 · The Golden Ginger World — 3D isometric storytelling Khmer cut, beat-synced to "Sunny Morning" + synthesised SFX */}
    <Composition id="GolexIsoWorld" component={IsoCommercial} durationInFrames={I_DURATION_S * I_FPS} fps={I_FPS} width={I_W} height={I_H} />
    {/* v7 · Editorial Kinetic Typography — abstract 2D motion, Khmer, beat-synced to "Sunset Breeze" + synthesised SFX */}
    <Composition id="GolexEditorial" component={EditorialCommercial} durationInFrames={E_DURATION_S * E_FPS} fps={E_FPS} width={E_W} height={E_H} />
    {/* tool · cuts the badge out of images/Logo-Brand.png -> promo/logo-brand.png (npm run logo) */}
    <Composition id="LogoCutout" component={LogoCutout} durationInFrames={1} fps={30} width={LOGO_BOX.w} height={LOGO_BOX.h} />
    {/* v1 · re-edit of the original Coffee-1.mp4 */}
    <Composition id="GolexCommercial" component={GolexCommercial} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
