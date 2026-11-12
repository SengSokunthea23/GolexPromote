/**
 * Soft Luxury motion kit — minimal editorial motion graphics on ivory, ruby product stages,
 * glass panels, rounded product cards and golden light sweeps.
 *
 * Motion rules: everything enters soft (expo / gentle back ease, 0.7–1.1 s), with a little blur that
 * resolves into focus; everything idles (float, sway); exits are quick and clean.
 */
import React, { useMemo } from 'react';
import { AbsoluteFill, Img, random } from 'remotion';
import { useTime } from '../lib/useTime';
import { DirBlur, backOut, cubicIn, cubicInOut, cubicOut, exitK, expoOut, prog } from '../lux/kit';
import { SC, SF, GOLD_INK, RUBY_INK, rgba } from './theme';
import { SoftTransition, S_OVERLAP } from './timeline';

export { backOut, cubicInOut, cubicOut, expoOut, prog, exitK };

/* ───────────────────────── backgrounds ───────────────────────── */
/** Warm ivory editorial gradient with slow-moving champagne light and fine geometric linework. */
export const Ivory: React.FC<{ t0: number; lines?: boolean; cx?: number; cy?: number }> = ({ t0, lines = true, cx = 540, cy = 900 }) => {
  const t = useTime() + t0;
  const lx = 30 + 25 * Math.sin(t * 0.18);
  const ly = 25 + 12 * Math.cos(t * 0.21);
  const mx = 75 - 20 * Math.sin(t * 0.14 + 1);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `linear-gradient(170deg, ${SC.cream} 0%, ${SC.ivory} 45%, ${SC.beige} 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${lx}% ${ly}%, ${rgba('#FFFFFF', 0.85)} 0%, transparent 38%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${mx}% 78%, ${rgba(SC.softGold, 0.45)} 0%, transparent 42%)` }} />
      {lines && (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={cx} cy={cy} r={430} fill="none" stroke={SC.gold} strokeOpacity={0.28} strokeWidth={1.2} />
          <circle cx={cx} cy={cy} r={520} fill="none" stroke={SC.gold} strokeOpacity={0.2} strokeWidth={1} strokeDasharray="2 14" transform={`rotate(${t * 4} ${cx} ${cy})`} />
          <line x1={80} y1={1830} x2={1000} y2={1830} stroke={SC.gold} strokeOpacity={0.25} strokeWidth={1} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

/** Ruby product stage: rich red with a soft key light and a gentle floor glow. */
export const Ruby: React.FC<{ t0: number; cx?: number; cy?: number }> = ({ t0, cx = 50, cy = 46 }) => {
  const t = useTime() + t0;
  const k = 0.9 + 0.1 * Math.sin(t * 0.8);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 65% at ${cx}% ${cy}%, #B0242F 0%, ${SC.ruby} 42%, ${SC.burgundy} 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${cx}% ${cy - 8}%, ${rgba(SC.softGold, 0.28 * k)} 0%, transparent 34%)`, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 70%, ${rgba(SC.espresso, 0.45)} 100%)` }} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── scene shell & transitions ───────────────────────── */
export type Box = { x: number; y: number; w: number; h: number; r?: number };
type ShellProps = { L: number; enter: SoftTransition; exit?: SoftTransition; from?: Box; origin?: [number, number]; children: React.ReactNode };

/**
 * blur  — focus pull: incoming resolves from soft blur, outgoing softens away
 * card  — rounded-card expansion: the next scene grows out of a rounded rectangle (`from`)
 * zoom  — scale-through: outgoing pushes past camera, incoming settles from slightly large
 * sheet — a rounded sheet slides up over the frame with vertical motion blur
 * light — soft light: an ivory bloom washes over the cut
 */
export const Shell: React.FC<ShellProps> = ({ L, enter, exit, from = { x: 340, y: 760, w: 400, h: 400, r: 48 }, origin = [540, 960], children }) => {
  const t = useTime();
  const dur = enter === 'card' ? 1.05 : enter === 'sheet' ? 0.95 : enter === 'light' ? 0.9 : 0.8;
  const p = t / dur;
  let tf = '';
  let filter = '';
  let clip: string | undefined;
  let opacity = 1;
  let vy = 0;
  if (p < 1) {
    if (enter === 'blur') {
      const e = cubicOut(p);
      filter += `blur(${24 * (1 - e)}px)`;
      tf += `scale(${1.05 - 0.05 * e})`;
      opacity = Math.min(1, p * 1.8);
    } else if (enter === 'card') {
      const e = expoOut(p);
      const top = from.y * (1 - e);
      const left = from.x * (1 - e);
      const right = (1080 - from.x - from.w) * (1 - e);
      const bottom = (1920 - from.y - from.h) * (1 - e);
      clip = `inset(${top}px ${right}px ${bottom}px ${left}px round ${(from.r ?? 48) * (1 - e) + 0.01}px)`;
      tf += `scale(${1.15 - 0.15 * cubicOut(p)})`;
    } else if (enter === 'zoom') {
      const e = cubicOut(p);
      tf += `scale(${1.22 - 0.22 * e})`;
      filter += `blur(${14 * (1 - e)}px)`;
      opacity = Math.min(1, p * 2);
    } else if (enter === 'sheet') {
      const e = cubicOut(p);
      tf += `translateY(${1920 * (1 - e)}px)`;
      clip = `inset(0 0 0 0 round ${60 * (1 - e)}px ${60 * (1 - e)}px 0 0)`;
      vy = 50 * Math.pow(1 - e, 2);
    } else if (enter === 'light') {
      opacity = cubicOut(Math.min(1, p * 1.4));
      filter += `brightness(${1 + 0.5 * (1 - cubicOut(p))}) blur(${10 * (1 - cubicOut(p))}px)`;
    }
  }
  const po = exit ? Math.max(0, (t - (L - S_OVERLAP)) / S_OVERLAP) : 0;
  if (po > 0 && exit) {
    const e = cubicIn(Math.min(1, po));
    if (exit === 'blur') {
      filter += ` blur(${18 * e}px)`;
      tf += ` scale(${1 - 0.03 * e})`;
    } else if (exit === 'card') {
      tf += ` scale(${1 - 0.1 * e})`;
      filter += ` blur(${8 * e}px) brightness(${1 - 0.25 * e})`;
    } else if (exit === 'zoom') {
      tf += ` scale(${1 + 0.35 * e})`;
      filter += ` blur(${14 * e}px)`;
      opacity *= 1 - e;
    } else if (exit === 'sheet') {
      tf += ` translateY(${-260 * e}px) scale(${1 - 0.05 * e})`;
      filter += ` brightness(${1 - 0.3 * e})`;
    } else if (exit === 'light') {
      filter += ` brightness(${1 + 0.6 * e})`;
    }
  }
  const bloom = enter === 'light' ? Math.max(0, 1 - p) * 0.9 : 0;
  return (
    <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip, opacity, isolation: 'isolate' }}>
      <DirBlur y={vy} style={{ position: 'absolute', inset: 0, transform: tf || undefined, filter: filter || undefined, transformOrigin: `${origin[0]}px ${origin[1]}px` }}>
        <AbsoluteFill style={{ overflow: 'hidden' }}>{children}</AbsoluteFill>
      </DirBlur>
      {bloom > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #FFFFFF 0%, ${SC.cream} 50%, ${SC.ivory} 100%)`, opacity: bloom }} />}
    </AbsoluteFill>
  );
};

/* ───────────────────────── typography ───────────────────────── */
export type Ink = 'espresso' | 'ruby' | 'gold' | 'ivory' | 'burgundy';
const ink = (k: Ink, size: number): React.CSSProperties => {
  if (k === 'gold' || k === 'ruby')
    return { backgroundImage: k === 'gold' ? GOLD_INK : RUBY_INK, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', ...(k === 'gold' ? { filter: `drop-shadow(0 ${Math.round(size * 0.03) + 1}px ${Math.round(size * 0.05)}px ${rgba(SC.burgundy, 0.35)})` } : {}) };
  if (k === 'ivory') return { color: SC.cream, textShadow: `0 2px ${Math.round(size * 0.12)}px ${rgba(SC.espresso, 0.45)}` };
  return { color: k === 'espresso' ? SC.espresso : SC.burgundy };
};

type WordsProps = {
  text: string;
  y: number;
  start: number;
  end: number;
  font?: keyof typeof SF;
  size?: number;
  weight?: number;
  italic?: boolean;
  tone?: Ink;
  x?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  stagger?: number;
  mode?: 'rise' | 'slide' | 'scale';
  tracking?: number;
  gap?: number;
  z?: number;
  /** 2.5D: tilt the whole line in perspective with a layered depth shadow */
  depth?: boolean;
};
/**
 * Editorial word-by-word reveal. Khmer must be pre-split on "|" (whole words) so subscript
 * consonants never break; English can be split on "|" too. Each word slides out of its own mask.
 */
export const Words: React.FC<WordsProps> = ({
  text, y, start, end, font = 'khSerif', size = 80, weight = 700, italic = false, tone = 'espresso', x = 0, width = 1080, align = 'center', stagger = 0.11, mode = 'rise', tracking = 0, gap, z = 6, depth = false,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const o = exitK(t, end, 0.35);
  const words = text.split('|');
  const kh = font === 'khSerif' || font === 'khSans';
  const lh = kh ? 1.6 : 1.12;
  const life = t - start;
  const tilt = depth ? `perspective(1200px) rotateX(${8 * (1 - cubicOut(life / 1.2)) + 2 * Math.sin(life * 0.9)}deg) rotateY(${-6 * Math.sin(life * 0.6)}deg)` : '';
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width, zIndex: z,
        display: 'flex', flexWrap: 'nowrap', gap: gap ?? size * 0.26,
        justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
        opacity: o, transform: `translateY(${-24 * (1 - o)}px) ${tilt}`, filter: o < 1 ? `blur(${(1 - o) * 8}px)` : undefined,
      }}
    >
      {words.map((w, i) => {
        const p = prog(t, start + i * stagger, 1.0);
        const e = mode === 'scale' ? backOut(p, 1.3) : expoOut(p);
        const tr = mode === 'rise' ? `translateY(${110 * (1 - e)}%)` : mode === 'slide' ? `translateX(${-60 * (1 - e)}%)` : `scale(${0.5 + 0.5 * e})`;
        return (
          <span key={i} style={{ display: 'inline-block', overflow: mode === 'scale' ? 'visible' : 'hidden', padding: `${size * 0.08}px ${size * 0.05}px`, margin: `${-size * 0.08}px ${-size * 0.05}px` }}>
            <span
              style={{
                display: 'inline-block', whiteSpace: 'pre', fontFamily: SF[font], fontSize: size, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal',
                letterSpacing: tracking, lineHeight: lh, transform: tr, opacity: Math.min(1, p * 2), filter: p < 1 ? `blur(${(1 - cubicOut(p)) * 8}px)` : undefined,
                ...ink(tone, size),
                ...(depth && (tone === 'gold' || tone === 'ruby') ? {} : {}),
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Uppercase micro label with a small gold dash, fades and slides in. */
export const Label: React.FC<{ text: string; y: number; start: number; end: number; x?: number; width?: number; align?: 'left' | 'center' | 'right'; tone?: Ink; size?: number; tracking?: number; font?: 'sans' | 'khSans'; dash?: boolean; z?: number }> = ({
  text, y, start, end, x = 0, width = 1080, align = 'center', tone = 'burgundy', size = 22, tracking = 7, font = 'sans', dash = true, z = 6,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = expoOut(prog(t, start, 1.1));
  const o = exitK(t, end, 0.35);
  const color = tone === 'ivory' ? SC.cream : tone === 'gold' ? SC.gold : tone === 'espresso' ? SC.espresso : SC.ruby;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width, zIndex: z, display: 'flex', alignItems: 'center', gap: 16, justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end', opacity: Math.min(1, p * 1.5) * o, transform: `translateX(${(align === 'right' ? 30 : -30) * (1 - p)}px)` }}>
      {dash && <span style={{ display: 'inline-block', width: 46 * p, height: 2, background: SC.gold }} />}
      <span style={{ fontFamily: SF[font], fontWeight: font === 'sans' ? 600 : 600, fontSize: size, letterSpacing: font === 'sans' ? tracking : 0, color, lineHeight: 1.5, whiteSpace: 'nowrap' }}>{text}</span>
      {dash && align === 'center' && <span style={{ display: 'inline-block', width: 46 * p, height: 2, background: SC.gold }} />}
    </div>
  );
};

/** Animated golden underline (draws from `from` side, with a soft glint at the head). */
export const Underline: React.FC<{ x: number; y: number; w: number; start: number; end: number; dur?: number; from?: 'left' | 'center'; thick?: number; z?: number }> = ({ x, y, w, start, end, dur = 0.8, from = 'center', thick = 3, z = 6 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, dur));
  const o = exitK(t, end, 0.35);
  const len = w * p;
  const left = from === 'center' ? x + (w - len) / 2 : x;
  return (
    <div style={{ position: 'absolute', left, top: y, width: len, height: thick, zIndex: z, opacity: o, borderRadius: thick, background: `linear-gradient(90deg, ${rgba(SC.gold, 0)} 0%, ${SC.gold} 15%, ${SC.softGold} 50%, ${SC.gold} 85%, ${rgba(SC.gold, 0)} 100%)`, boxShadow: `0 0 10px ${rgba(SC.softGold, 0.8)}` }} />
  );
};

/* ───────────────────────── panels & frames ───────────────────────── */
/** Glassmorphism panel: frosted translucent card with a delicate gold border and soft shadow. */
export const Glass: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; dx?: number; dy?: number; dark?: boolean; r?: number; phase?: number; z?: number; children?: React.ReactNode }> = ({
  x, y, w, h, start, end, dx = 0, dy = 70, dark = false, r = 34, phase = 0, z = 7, children,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 1.05);
  const e = backOut(p, 1.1);
  const o = Math.min(1, p * 2.2) * exitK(t, end, 0.35);
  const life = t - start;
  const fl = 6 * Math.sin(life * 1.3 + phase);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, opacity: o, borderRadius: r, overflow: 'hidden',
        transform: `translate(${dx * (1 - e)}px, ${dy * (1 - e) + fl}px) scale(${0.92 + 0.08 * e})`,
        background: dark ? `linear-gradient(145deg, ${rgba('#FFFFFF', 0.16)} 0%, ${rgba('#FFFFFF', 0.06)} 100%)` : `linear-gradient(145deg, ${rgba('#FFFFFF', 0.84)} 0%, ${rgba(SC.cream, 0.6)} 100%)`,
        backdropFilter: 'blur(18px) saturate(1.2)', WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
        boxShadow: `inset 0 0 0 1.5px ${rgba(SC.champagne, dark ? 0.6 : 0.75)}, inset 0 1px 0 ${rgba('#FFFFFF', 0.8)}, 0 24px 50px ${rgba(SC.burgundy, dark ? 0.35 : 0.16)}`,
        filter: p < 1 ? `blur(${(1 - cubicOut(p)) * 8}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/** Rounded media frame: opens as a rounded mask from its centre, content inside can push in. */
export const Frame: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; r?: number; bg?: string; border?: boolean; z?: number; dy?: number; children: React.ReactNode }> = ({ x, y, w, h, start, end, r = 44, bg, border = true, z = 3, dy = 80, children }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 1.25);
  const e = expoOut(p);
  const o = exitK(t, end, 0.35);
  const ih = (h / 2) * (1 - e);
  const iw = (w / 2) * (1 - e) * 0.6;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, opacity: o * Math.min(1, p * 3), transform: `translateY(${dy * (1 - e)}px)`, filter: `drop-shadow(0 30px 40px ${rgba(SC.burgundy, 0.28)})` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: r, overflow: 'hidden', background: bg, clipPath: `inset(${ih}px ${iw}px ${ih}px ${iw}px round ${r}px)` }}>{children}</div>
      {border && (
        <svg width={w + 2} height={h + 2} style={{ position: 'absolute', left: -1, top: -1, overflow: 'visible' }}>
          <rect x={1} y={1} width={w} height={h} rx={r} fill="none" stroke={SC.champagne} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cubicInOut(prog(t, start + 0.3, 1.1))} />
          <rect x={-13} y={-13} width={w + 28} height={h + 28} rx={r + 14} fill="none" stroke={SC.gold} strokeOpacity={0.45} strokeWidth={1} pathLength={1} strokeDasharray="1 1" strokeDashoffset={-(1 - cubicInOut(prog(t, start + 0.5, 1.2)))} />
        </svg>
      )}
    </div>
  );
};

/* ───────────────────────── floating product with studio shadow & light sweep ───────────────────────── */
type ProductProps = {
  src: string; x: number; y: number; w: number; start: number; end: number;
  dur?: number; dx?: number; dy?: number; s0?: number; rotY0?: number; r0?: number; blur0?: number;
  bob?: number; sway?: number; rot?: number; push?: number; phase?: number; z?: number;
  /** times (local s) at which a golden reflection sweeps across the product pixels */
  sheen?: number[]; mask?: string; shadow?: 'floor' | 'drop' | 'none'; shadowY?: number; mb?: number;
};
export const Product: React.FC<ProductProps> = ({
  src, x, y, w, start, end, dur = 1.2, dx = 0, dy = 110, s0 = 0.86, rotY0 = 0, r0 = 0, blur0 = 16, bob = 8, sway = 0, rot = 0, push = 0, phase = 0, z = 4, sheen = [], mask, shadow = 'floor', shadowY = 0.5, mb = 0,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, dur);
  const e = backOut(p, 1.0);
  const ce = cubicOut(p);
  const o = Math.min(1, p * 2.2) * exitK(t, end, 0.4);
  const life = t - start;
  const fl = bob * Math.sin(life * 1.45 + phase);
  const s = (s0 + (1 - s0) * e) * (1 + push * life);
  const rY = rotY0 * (1 - ce) + sway * Math.sin(life * 0.85 + phase);
  const bl = blur0 * (1 - ce);
  const sweepK = sheen.map((st) => (t - start - st) / 0.95).find((k) => k > 0 && k < 1);
  const maskCss = mask ? `${mask}, url(${src})` : `url(${src})`;
  const speed = mb * Math.pow(1 - p, 2.2);
  const body = (
    <div style={{ position: 'relative' }}>
      <Img src={src} style={{ width: '100%', display: 'block', WebkitMaskImage: mask, maskImage: mask, filter: shadow === 'drop' ? `drop-shadow(0 30px 34px ${rgba(SC.burgundy, 0.35)})` : undefined }} />
      {sweepK !== undefined && (
        <div
          style={{
            position: 'absolute', inset: 0, mixBlendMode: 'screen',
            background: `linear-gradient(112deg, transparent ${sweepK * 160 - 50}%, ${rgba(SC.softGold, 0.0)} ${sweepK * 160 - 40}%, ${rgba('#FFF4D6', 0.85)} ${sweepK * 160 - 30}%, ${rgba(SC.softGold, 0)} ${sweepK * 160 - 20}%, transparent ${sweepK * 160 - 10}%)`,
            WebkitMaskImage: maskCss, maskImage: maskCss, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskComposite: mask ? 'source-in' : undefined, maskComposite: mask ? 'intersect' : undefined,
          }}
        />
      )}
    </div>
  );
  return (
    <>
      {shadow === 'floor' && (
        <div style={{ position: 'absolute', left: x - w * 0.36, top: y + w * shadowY - 18, width: w * 0.72, height: 40, zIndex: z - 1, borderRadius: '50%', opacity: o * (0.55 - 0.15 * Math.sin(life * 1.45 + phase)), background: `radial-gradient(ellipse, ${rgba(SC.burgundy, 0.55)} 0%, transparent 70%)`, filter: 'blur(6px)', transform: `scale(${s * (1 - 0.06 * Math.sin(life * 1.45 + phase))})` }} />
      )}
      <div style={{ position: 'absolute', left: x, top: y, width: w, zIndex: z, opacity: o, transform: `translate(-50%, -50%) translate(${dx * (1 - e)}px, ${dy * (1 - e) + fl}px) perspective(1600px) rotateY(${rY}deg) rotateZ(${r0 * (1 - e) + rot}deg) scale(${s})`, filter: bl > 0.3 ? `blur(${bl.toFixed(2)}px)` : undefined }}>
        {speed > 0.3 ? <DirBlur x={Math.abs(dx) > Math.abs(dy) ? speed : 0} y={Math.abs(dy) >= Math.abs(dx) ? speed : 0}>{body}</DirBlur> : body}
      </div>
    </>
  );
};

/** Thin gold ring drawn on (minimal geometric framing). */
export const Ring: React.FC<{ cx: number; cy: number; r: number; start: number; end: number; dur?: number; width?: number; dashed?: boolean; opacity?: number; z?: number }> = ({ cx, cy, r, start, end, dur = 1.2, width = 1.6, dashed = false, opacity = 1, z = 2 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, dur));
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, opacity: opacity * exitK(t, end, 0.35), overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={SC.champagne} strokeWidth={width} pathLength={1} strokeDasharray={dashed ? undefined : '1 1'} strokeDashoffset={dashed ? undefined : 1 - p} transform={`rotate(-90 ${cx} ${cy})`} />
      {dashed && <circle cx={cx} cy={cy} r={r} fill="none" stroke={SC.gold} strokeWidth={width} strokeDasharray="2 12" opacity={p} transform={`rotate(${t * 10} ${cx} ${cy})`} />}
    </svg>
  );
};

/** Fine gold particles (normal blend so they read on ivory and on ruby). */
export const FineDust: React.FC<{ amount?: number }> = ({ amount = 1 }) => {
  const t = useTime();
  const ps = useMemo(() => Array.from({ length: 46 }, (_, i) => ({ x: random(`sd-x${i}`) * 1080, y: random(`sd-y${i}`) * 1920, v: 12 + random(`sd-v${i}`) * 30, s: 2 + random(`sd-s${i}`) * 4, ph: random(`sd-p${i}`) * 6.28 })), []);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {ps.map((p, i) => {
        const y = ((((p.y - p.v * t) % 2000) + 2000) % 2000) - 40;
        const op = (0.35 + 0.35 * Math.sin(t * 2 + p.ph)) * amount;
        return <div key={i} style={{ position: 'absolute', left: p.x + 10 * Math.sin(t * 0.5 + p.ph), top: y, width: p.s, height: p.s, borderRadius: '50%', opacity: op, background: SC.softGold, boxShadow: `0 0 ${p.s * 2}px ${SC.champagne}` }} />;
      })}
    </AbsoluteFill>
  );
};

/** Benefit icon set (stroke icons) in the soft palette. */
const st = { fill: 'none', stroke: SC.gold, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
export const SICONS: Record<string, React.ReactNode> = {
  heart: (<><path {...st} d="M32 52 C10 36 8 20 20 14 C27 11 32 16 32 20 C32 16 37 11 44 14 C56 20 54 36 32 52Z" /><path {...st} d="M14 32 H24 L28 25 L34 40 L38 32 H50" /></>),
  drop: (<><path {...st} d="M32 10 C32 10 14 30 14 40 A18 18 0 0 0 50 40 C50 30 32 10 32 10Z" /><path {...st} d="M10 10 L54 54" /></>),
  flask: (<><path {...st} d="M26 10 H38 M28 10 V26 L14 50 A4 4 0 0 0 18 56 H46 A4 4 0 0 0 50 50 L36 26 V10" /><path {...st} d="M10 10 L54 54" /></>),
  leaf: (<><path {...st} d="M12 52 C12 24 30 12 54 12 C54 38 40 52 12 52Z" /><path {...st} d="M12 52 L40 24" /></>),
  bean: (<><ellipse {...st} cx={32} cy={32} rx={15} ry={21} transform="rotate(30 32 32)" /><path {...st} d="M24 16 C34 26 30 38 40 48" /></>),
  bowl: (<><path {...st} d="M10 34 H54 C54 46 44 54 32 54 C20 54 10 46 10 34Z" /><path {...st} d="M20 30 C22 22 42 22 44 30" /></>),
};
