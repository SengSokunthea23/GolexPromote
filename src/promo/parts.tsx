import React from 'react';
import { Img, staticFile } from 'remotion';
import { COLORS, GOLD_GRADIENT, rgba } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { easeInOut, easeOut, envelope } from '../lib/easing';
import { useTime } from '../lib/useTime';

export const asset = (n: string) => staticFile(`promo/${n}`);

const fadeOut = (t: number, end: number, eout: number) => (t > end - eout ? 1 - easeInOut((t - (end - eout)) / eout) : 1);

/* ───────────── Hero product / model with 3D reveal ───────────── */
type HeroProps = {
  src: string;
  cx: number;
  cy: number;
  w: number;
  start: number;
  end: number;
  ein?: number;
  eout?: number;
  rise?: number;
  rotY0?: number;
  tilt?: number;
  scale0?: number;
  float?: number;
  sway?: number;
  push?: number;
  z?: number;
};
export const Hero: React.FC<HeroProps> = ({ src, cx, cy, w, start, end, ein = 1.1, eout = 0.45, rise = 120, rotY0 = 0, tilt = 0, scale0 = 0.9, float = 10, sway = 0, push = 0, z = 1 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = easeOut((t - start) / ein);
  const o = Math.min(1, p * 1.5) * fadeOut(t, end, eout);
  const s = (scale0 + (1 - scale0) * p) * (1 + push * ((t - start) / (end - start)));
  const rotY = rotY0 * (1 - p) + sway * Math.sin(t * 0.9);
  const fl = float * Math.sin(t * 1.6 + cx * 0.01);
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: cy,
        width: w,
        zIndex: z,
        opacity: o,
        transform: `translate(-50%, -50%) translateY(${rise * (1 - p) + fl}px) perspective(1600px) rotateY(${rotY}deg) rotateZ(${tilt}deg) scale(${s})`,
      }}
    >
      <Img
        src={src}
        style={{
          width: '100%',
          display: 'block',
          filter: 'drop-shadow(0 38px 46px rgba(23,11,13,0.6))',
          translate: '2.1px -7.3px'
        }}
      />
    </div>
  );
};

/* ───────────── Free-floating ingredient with parallax + depth of field ───────────── */
type DriftProps = { src: string; w: number; from: [number, number]; to: [number, number]; start: number; end: number; blur?: number; rot0?: number; rotSpeed?: number; opacity?: number; z?: number };
export const Drifter: React.FC<DriftProps> = ({ src, w, from, to, start, end, blur = 0, rot0 = 0, rotSpeed = 8, opacity = 1, z = 3 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const k = (t - start) / (end - start);
  const x = from[0] + (to[0] - from[0]) * k + 7 * Math.sin(t * 1.3 + from[0]);
  const y = from[1] + (to[1] - from[1]) * k + 9 * Math.sin(t * 1.7 + from[1]);
  const a = envelope(t, start, end, 0.5, 0.4) * opacity;
  return (
    <Img
      src={src}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        zIndex: z,
        opacity: a,
        transform: `translate(-50%, -50%) rotate(${rot0 + rotSpeed * (t - start)}deg)`,
        filter: `${blur ? `blur(${blur}px) ` : ''}drop-shadow(0 12px 16px rgba(23,11,13,0.5))`,
      }}
    />
  );
};

/* ───────────── Golden glow behind a product ───────────── */
export const Glow: React.FC<{ cx: number; cy: number; r: number; start: number; end: number; strength?: number }> = ({ cx, cy, r, start, end, strength = 0.7 }) => {
  const t = useTime();
  const a = envelope(t, start, end, 1.0, 0.5) * strength * (0.85 + 0.15 * Math.sin(t * 1.4));
  if (a <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        opacity: a,
        mixBlendMode: 'screen',
        background: `radial-gradient(circle, ${rgba(COLORS.champagne, 0.7)} 0%, ${rgba(COLORS.gold, 0.35)} 28%, ${rgba(COLORS.crimson, 0.2)} 52%, transparent 70%)`,
      }}
    />
  );
};

/* ───────────── Rising coffee steam ───────────── */
export const Steam: React.FC<{ cx: number; baseY: number; start: number; end: number; height?: number; count?: number }> = ({ cx, baseY, start, end, height = 420, count = 7 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const master = envelope(t, start, end, 0.8, 0.5);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const k = (((t - start) * 0.2 + i / count) % 1 + 1) % 1;
        const x = cx + (i - count / 2) * 26 + 34 * Math.sin(k * 6.5 + i * 1.7);
        const y = baseY - k * height;
        const o = Math.sin(Math.PI * k) * 0.32 * master;
        const s = 90 + k * 120;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - s / 2,
              top: y - s / 2,
              width: s,
              height: s * 1.4,
              borderRadius: '50%',
              opacity: o,
              filter: 'blur(22px)',
              background: 'radial-gradient(ellipse, rgba(255,246,232,0.9) 0%, rgba(255,240,210,0) 70%)',
              zIndex: 4,
            }}
          />
        );
      })}
    </>
  );
};

/* ───────────── Concentric gold rings (premium circular graphics) ───────────── */
export const GoldRings: React.FC<{ cx: number; cy: number; r: number; start: number; end: number; opacity?: number }> = ({ cx, cy, r, start, end, opacity = 1 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const a = envelope(t, start, end, 0.9, 0.5) * opacity;
  const grow = 0.9 + 0.1 * easeOut((t - start) / 1.4);
  const rings: [number, number, string, number, number][] = [
    [r, 2.5, '', 0, 0.95],
    [r + 64, 1.6, '3 15', 8, 0.8],
    [r + 140, 1.2, '70 22 8 22', -5, 0.65],
  ];
  const ang = t * 28;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, opacity: a }}>
      <g transform={`translate(${cx} ${cy}) scale(${grow})`}>
        {rings.map(([rad, sw, dash, speed, op], i) => (
          <circle key={i} r={rad} fill="none" stroke={i === 0 ? COLORS.champagne : COLORS.gold} strokeWidth={sw} strokeDasharray={dash || undefined} opacity={op} transform={`rotate(${t * speed})`} />
        ))}
        <circle cx={r * Math.cos((ang * Math.PI) / 180)} cy={r * Math.sin((ang * Math.PI) / 180)} r={7} fill={COLORS.champagne} />
        <circle cx={(r + 64) * Math.cos(((-ang * 0.7 + 90) * Math.PI) / 180)} cy={(r + 64) * Math.sin(((-ang * 0.7 + 90) * Math.PI) / 180)} r={5} fill={COLORS.gold} />
      </g>
    </svg>
  );
};

/* ───────────── Ingredient medallion ───────────── */
export const Medallion: React.FC<{ cx: number; cy: number; d: number; start: number; end: number; children: React.ReactNode }> = ({ cx, cy, d, start, end, children }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = easeOut((t - start) / 0.9);
  const o = fadeOut(t, end, 0.4);
  const R = d / 2 + 16;
  const C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'absolute', left: cx - d / 2 - 30, top: cy - d / 2 - 30, width: d + 60, height: d + 60, opacity: o }}>
      <svg width={d + 60} height={d + 60} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <circle cx={(d + 60) / 2} cy={(d + 60) / 2} r={R} fill="none" stroke={COLORS.gold} strokeWidth={3} strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform={`rotate(-90 ${(d + 60) / 2} ${(d + 60) / 2})`} />
        <circle cx={(d + 60) / 2} cy={(d + 60) / 2} r={R + 14} fill="none" stroke={COLORS.gold} strokeWidth={1} strokeDasharray="3 12" opacity={0.7 * p} transform={`rotate(${t * 10} ${(d + 60) / 2} ${(d + 60) / 2})`} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 30,
          width: d,
          height: d,
          borderRadius: '50%',
          overflow: 'hidden',
          transform: `scale(${0.8 + 0.2 * p})`,
          opacity: Math.min(1, p * 1.6),
          background: `radial-gradient(circle at 50% 42%, ${COLORS.ruby} 0%, ${COLORS.burgundy} 62%, ${COLORS.espresso} 100%)`,
          boxShadow: `inset 0 0 60px ${rgba(COLORS.espresso, 0.8)}, 0 0 50px ${rgba(COLORS.gold, 0.35)}`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ───────────── Benefit icons (stroke style, inline SVG) ───────────── */
const stroke = { fill: 'none', stroke: COLORS.champagne, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
export const ICONS: Record<string, React.ReactNode> = {
  heart: (
    <>
      <path {...stroke} d="M32 52 C10 36 8 20 20 14 C27 11 32 16 32 20 C32 16 37 11 44 14 C56 20 54 36 32 52Z" />
      <path {...stroke} d="M14 32 H24 L28 25 L34 40 L38 32 H50" />
    </>
  ),
  drop: (
    <>
      <path {...stroke} d="M32 10 C32 10 14 30 14 40 A18 18 0 0 0 50 40 C50 30 32 10 32 10Z" />
      <path {...stroke} d="M10 10 L54 54" />
    </>
  ),
  flask: (
    <>
      <path {...stroke} d="M26 10 H38 M28 10 V26 L14 50 A4 4 0 0 0 18 56 H46 A4 4 0 0 0 50 50 L36 26 V10" />
      <path {...stroke} d="M10 10 L54 54" />
    </>
  ),
  leaf: (
    <>
      <path {...stroke} d="M12 52 C12 24 30 12 54 12 C54 38 40 52 12 52Z" />
      <path {...stroke} d="M12 52 L40 24" />
    </>
  ),
  bowl: (
    <>
      <path {...stroke} d="M10 34 H54 C54 46 44 54 32 54 C20 54 10 46 10 34Z" />
      <path {...stroke} d="M20 30 C22 22 42 22 44 30" />
    </>
  ),
};

export const BenefitRow: React.FC<{ icon: keyof typeof ICONS; text: string; top: number; left: number; width: number; start: number; end: number; khmer?: boolean }> = ({ icon, text, top, left, width, start, end, khmer = false }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = easeOut((t - start) / 0.7);
  const o = fadeOut(t, end, 0.4);
  return (
    <div style={{ position: 'absolute', left, top, width, display: 'flex', alignItems: 'center', gap: 28, opacity: p * o, transform: `translateX(${50 * (1 - p)}px)` }}>
      <div
        style={{
          flex: '0 0 104px',
          width: 104,
          height: 104,
          borderRadius: '50%',
          border: `2.5px solid ${COLORS.gold}`,
          background: rgba(COLORS.espresso, 0.45),
          boxShadow: `0 0 30px ${rgba(COLORS.gold, 0.25)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={64} height={64} viewBox="0 0 64 64">
          {ICONS[icon]}
        </svg>
      </div>
      <div style={{ fontFamily: FONTS[khmer ? 'khmer' : 'sans'], fontWeight: 600, fontSize: khmer ? 32 : 31, letterSpacing: khmer ? 0 : 2.5, lineHeight: 1.3, color: COLORS.cream, textShadow: `0 3px 10px ${rgba(COLORS.espresso, 0.8)}` }}>{text}</div>
    </div>
  );
};

/* ───────────── Call-to-action pill ───────────── */
export const CtaButton: React.FC<{ text: string; top: number; start: number; end: number; w?: number; h?: number; khmer?: boolean }> = ({ text, top, start, end, w = 560, h = 92, khmer = false }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = easeOut((t - start) / 0.8);
  const sheen = ((t - start - 0.7) % 2.4) / 1.1;
  return (
    <div style={{ position: 'absolute', left: (1080 - w) / 2, top, width: w, height: h, opacity: p * fadeOut(t, end, 0.3), transform: `translateY(${24 * (1 - p)}px) scale(${1 + 0.012 * Math.sin(t * 4)})` }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: h / 2,
          background: GOLD_GRADIENT,
          boxShadow: `0 0 ${34 + 14 * Math.sin(t * 4)}px ${rgba(COLORS.gold, 0.55)}, inset 0 2px 0 ${rgba('#ffffff', 0.5)}`,
          overflow: 'hidden',
        }}
      >
        {sheen > 0 && sheen < 1 && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: 90, left: -120 + sheen * (w + 240), transform: 'skewX(-22deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)' }} />
        )}
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS[khmer ? 'khmer' : 'sans'], fontWeight: 700, fontSize: khmer ? 34 : 30, letterSpacing: khmer ? 0 : 7, color: COLORS.espresso }}>{text}</div>
    </div>
  );
};

/* ───────────── Small helpers for scene copy ───────────── */
export const Label: React.FC<{ text: string; left?: number; top: number; width: number; align?: 'left' | 'right' | 'center'; size?: number; start: number; end: number; weight?: number; tracking?: number; color?: string; family?: 'sans' | 'micro' | 'serif' | 'khmer'; italic?: boolean }> = ({
  text,
  left = 0,
  top,
  width,
  align = 'left',
  size = 38,
  start,
  end,
  weight = 700,
  tracking = 5,
  color = COLORS.cream,
  family = 'sans',
  italic = false,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = easeOut((t - start) / 0.7);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        textAlign: align,
        opacity: p * fadeOut(t, end, 0.35),
        transform: `translateY(${18 * (1 - p)}px)`,
        fontFamily: FONTS[family],
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: size,
        letterSpacing: tracking,
        lineHeight: family === 'khmer' ? 1.35 : 1.2,
        color,
        textShadow: `0 3px 12px ${rgba(COLORS.espresso, 0.85)}`,
      }}
    >
      {text}
    </div>
  );
};
