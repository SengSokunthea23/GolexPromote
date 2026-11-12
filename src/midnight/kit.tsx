/**
 * Midnight Luxury motion kit — dark cinematic motion graphics.
 *
 * Motion rules: things emerge from darkness (brightness + blur resolve), light is the transition
 * (gold sweeps, ruby washes, short flashes), every element idles, exits are quick and dark.
 */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useTime } from '../lib/useTime';
import { DirBlur, backOut, clampN, cubicIn, cubicInOut, cubicOut, exitK, expoOut, prog } from './ease';
import { GOLD_INK, MC, MF, RUBY_INK, rgba } from './theme';
import { MidTransition, M_OVERLAP } from './timeline';

export { backOut, cubicInOut, cubicOut, exitK, expoOut, prog };

/* ───────────────────────── backgrounds ───────────────────────── */
/**
 * Midnight stage: near-black with a burgundy atmospheric glow, drifting ruby haze, an optional top
 * spotlight cone and a faint perspective grid (the "minimal futuristic" layer).
 */
export const Night: React.FC<{ t0: number; cx?: number; cy?: number; spot?: boolean; grid?: boolean; warm?: number }> = ({ t0, cx = 50, cy = 50, spot = false, grid = true, warm = 1 }) => {
  const t = useTime() + t0;
  const hx = 50 + 22 * Math.sin(t * 0.17);
  const hy = 62 + 10 * Math.cos(t * 0.13);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: MC.black }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at ${cx}% ${cy}%, ${rgba(MC.burgundy, 0.95 * warm)} 0%, ${rgba(MC.espresso, 0.9 * Math.min(1, warm))} 45%, ${MC.black} 85%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${hx}% ${hy}%, ${rgba(MC.ruby, 0.28 * warm)} 0%, transparent 40%)`, mixBlendMode: 'screen' }} />
      {grid && <Grid t={t} />}
      {spot && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 34% 70% at 50% -8%, ${rgba(MC.champagne, 0.32)} 0%, ${rgba(MC.gold, 0.12)} 40%, transparent 75%)`,
            mixBlendMode: 'screen',
            opacity: 0.85 + 0.15 * Math.sin(t * 1.1),
          }}
        />
      )}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba(MC.black, 0.7)} 0%, transparent 20%, transparent 72%, ${rgba(MC.black, 0.85)} 100%)` }} />
    </AbsoluteFill>
  );
};

/** Faint gold perspective grid on the floor, slowly scrolling toward camera. */
const Grid: React.FC<{ t: number }> = ({ t }) => {
  const off = (t * 22) % 80;
  const rows = Array.from({ length: 14 }, (_, i) => i * 80 + off);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.16 }}>
      <defs>
        <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={MC.gold} stopOpacity={0} />
          <stop offset="1" stopColor={MC.gold} stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <g transform="translate(540 1220)" stroke="url(#gridFade)" strokeWidth={1}>
        {rows.map((r, i) => {
          const y = (r * r) / 1100; // perspective spacing
          return y < 700 ? <line key={i} x1={-900} y1={y} x2={900} y2={y} /> : null;
        })}
        {Array.from({ length: 19 }, (_, i) => (i - 9) * 120).map((x) => (
          <line key={x} x1={x * 0.12} y1={0} x2={x * 1.6} y2={700} />
        ))}
      </g>
    </svg>
  );
};

/* ───────────────────────── scene shell & transitions ───────────────────────── */
type ShellProps = { L: number; enter: MidTransition; exit?: MidTransition; origin?: [number, number]; children: React.ReactNode };

/**
 * dark   — emerge from black (brightness 0 → 1, slight scale, blur resolve); outgoing sinks into black
 * sweep  — a hot gold light bar crosses the frame; the next scene is revealed behind it
 * flash  — 3-frame champagne flash + subtle chromatic split on the cut (used on musical hits)
 * circle — glowing circular reveal from `origin`
 * zoom   — scale-through with blur
 * blur   — focus pull
 */
export const Shell: React.FC<ShellProps> = ({ L, enter, exit, origin = [540, 960], children }) => {
  const t = useTime();
  const dur = enter === 'dark' ? 0.9 : enter === 'circle' ? 0.6 : enter === 'sweep' ? 0.5 : enter === 'flash' ? 0.35 : 0.55;
  const p = t / dur;
  let tf = '';
  let filter = '';
  let clip: string | undefined;
  let opacity = 1;
  let ring: number | null = null;
  let sweepX: number | null = null;
  let dx = 0;
  if (p < 1) {
    const e = cubicOut(p);
    if (enter === 'dark') {
      filter += `brightness(${0.05 + 0.95 * e}) blur(${14 * (1 - e)}px)`;
      tf += `scale(${1.06 - 0.06 * e})`;
    } else if (enter === 'sweep') {
      const x = -300 + 1680 * cubicInOut(p);
      clip = `polygon(0 0, ${x + 260}px 0, ${x - 260}px 1920px, 0 1920px)`;
      sweepX = x;
      dx = 18 * (1 - e);
    } else if (enter === 'flash') {
      tf += `scale(${1.08 - 0.08 * e})`;
      filter += `blur(${8 * (1 - e)}px)`;
    } else if (enter === 'circle') {
      const R = 2200 * expoOut(p);
      clip = `circle(${R}px at ${origin[0]}px ${origin[1]}px)`;
      ring = R;
    } else if (enter === 'zoom') {
      tf += `scale(${1.3 - 0.3 * e})`;
      filter += `blur(${16 * (1 - e)}px)`;
      opacity = Math.min(1, p * 2.2);
    } else if (enter === 'blur') {
      filter += `blur(${22 * (1 - e)}px) brightness(${0.6 + 0.4 * e})`;
      opacity = Math.min(1, p * 1.8);
    }
  }
  const po = exit ? clampN((t - (L - M_OVERLAP)) / M_OVERLAP) : 0;
  if (po > 0 && exit) {
    const e = cubicIn(po);
    if (exit === 'dark') filter += ` brightness(${1 - 0.95 * e})`;
    else if (exit === 'zoom') {
      tf += ` scale(${1 + 0.35 * e})`;
      filter += ` blur(${14 * e}px)`;
      opacity *= 1 - e;
    } else if (exit === 'blur') filter += ` blur(${16 * e}px) brightness(${1 - 0.4 * e})`;
    else if (exit === 'circle' || exit === 'sweep') filter += ` brightness(${1 - 0.5 * e})`;
    else if (exit === 'flash') tf += ` scale(${1 + 0.06 * e})`;
  }
  const flash = enter === 'flash' ? Math.max(0, 1 - t / 0.18) : 0;
  return (
    <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip, opacity, isolation: 'isolate' }}>
      <DirBlur x={dx} style={{ position: 'absolute', inset: 0, transform: tf || undefined, filter: filter || undefined, transformOrigin: `${origin[0]}px ${origin[1]}px` }}>
        <AbsoluteFill style={{ overflow: 'hidden' }}>{children}</AbsoluteFill>
      </DirBlur>
      {flash > 0 && (
        <>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #FFFFFF 0%, ${MC.champagne} 45%, ${rgba(MC.gold, 0.6)} 100%)`, opacity: flash * 0.85, mixBlendMode: 'screen' }} />
          <AbsoluteFill style={{ boxShadow: `inset 12px 0 0 ${rgba('#FF2040', 0.35 * flash)}, inset -12px 0 0 ${rgba('#20D0FF', 0.25 * flash)}` }} />
        </>
      )}
      {sweepX !== null && (
        <div
          style={{
            position: 'absolute',
            left: sweepX - 160,
            top: -200,
            width: 320,
            height: 2320,
            transform: 'skewX(-15deg)',
            background: `linear-gradient(90deg, transparent 0%, ${rgba(MC.gold, 0.35)} 35%, ${rgba('#FFF6DA', 0.95)} 50%, ${rgba(MC.gold, 0.35)} 65%, transparent 100%)`,
            mixBlendMode: 'screen',
            filter: 'blur(6px)',
          }}
        />
      )}
      {ring !== null && ring > 0 && p < 1 && (
        <div
          style={{
            position: 'absolute',
            left: origin[0] - ring,
            top: origin[1] - ring,
            width: ring * 2,
            height: ring * 2,
            borderRadius: '50%',
            border: `4px solid ${MC.champagne}`,
            boxShadow: `0 0 34px ${MC.gold}, inset 0 0 34px ${rgba(MC.ruby, 0.9)}`,
            opacity: 1 - p,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/* ───────────────────────── typography ───────────────────────── */
export type Ink = 'ivory' | 'gold' | 'ruby';
const ink = (k: Ink, size: number): React.CSSProperties =>
  k === 'ivory'
    ? { color: MC.ivory, textShadow: `0 0 ${Math.round(size * 0.25)}px ${rgba(MC.black, 0.9)}` }
    : {
        backgroundImage: k === 'gold' ? GOLD_INK : RUBY_INK,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        filter: k === 'gold' ? `drop-shadow(0 0 ${Math.round(size * 0.12)}px ${rgba(MC.gold, 0.45)})` : `drop-shadow(0 0 ${Math.round(size * 0.12)}px ${rgba(MC.crimson, 0.55)})`,
      };

type WordsProps = {
  text: string;
  y: number;
  start: number;
  end: number;
  font?: keyof typeof MF;
  size?: number;
  weight?: number;
  italic?: boolean;
  tone?: Ink;
  x?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  stagger?: number;
  mode?: 'rise' | 'scale' | 'track' | 'slide';
  tracking?: number;
  gap?: number;
  z?: number;
};
/**
 * Dramatic word reveal. Khmer is pre-split on "|" (whole words only — never inside a word, so subscripts
 * stay intact). Each word emerges from darkness: blur + brightness resolve, plus the chosen movement.
 * Glyph boxes are padded so tall Khmer stacks are never clipped by the per-word mask.
 */
export const Words: React.FC<WordsProps> = ({
  text, y, start, end, font = 'khSerif', size = 80, weight = 700, italic = false, tone = 'ivory', x = 0, width = 1080, align = 'center', stagger = 0.12, mode = 'rise', tracking = 0, gap, z = 6,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const o = exitK(t, end, 0.3);
  const words = text.split('|');
  const kh = font === 'khSerif' || font === 'khSans';
  const pad = Math.round(size * (kh ? 0.5 : 0.25));
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y - pad, width, zIndex: z,
        display: 'flex', flexWrap: 'nowrap', gap: gap ?? size * 0.26,
        justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
        opacity: o, filter: o < 1 ? `blur(${(1 - o) * 10}px)` : undefined,
      }}
    >
      {words.map((w, i) => {
        const p = prog(t, start + i * stagger, mode === 'track' ? 1.2 : 0.8);
        const e = mode === 'scale' ? backOut(p, 1.4) : expoOut(p);
        const tr =
          mode === 'rise' ? `translateY(${70 * (1 - e)}%)` : mode === 'slide' ? `translateX(${-50 * (1 - e)}%)` : mode === 'scale' ? `scale(${0.4 + 0.6 * e})` : 'none';
        const track = mode === 'track' ? tracking + 30 * (1 - e) : tracking;
        return (
          <span key={i} style={{ display: 'inline-block', overflow: mode === 'rise' || mode === 'slide' ? 'hidden' : 'visible', padding: `${pad}px ${size * 0.06}px`, margin: `0 ${-size * 0.06}px` }}>
            <span
              style={{
                display: 'inline-block', whiteSpace: 'pre', fontFamily: MF[font], fontSize: size, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal',
                letterSpacing: track, lineHeight: kh ? 1.6 : 1.12, transform: tr,
                opacity: Math.min(1, p * 2), filter: p < 1 ? `blur(${(1 - cubicOut(p)) * 10}px) brightness(${0.3 + 0.7 * cubicOut(p)})` : undefined,
                ...ink(tone, size),
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

/** Uppercase micro label (or Khmer sub-label) with glowing gold dashes. */
export const Label: React.FC<{ text: string; y: number; start: number; end: number; x?: number; width?: number; align?: 'left' | 'center' | 'right'; tone?: 'gold' | 'ivory' | 'ruby'; size?: number; tracking?: number; font?: 'sans' | 'khSans'; dash?: boolean; z?: number }> = ({
  text, y, start, end, x = 0, width = 1080, align = 'center', tone = 'gold', size = 20, tracking = 8, font = 'sans', dash = true, z = 6,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = expoOut(prog(t, start, 1.0));
  const o = exitK(t, end, 0.3);
  const color = tone === 'ivory' ? MC.ivory : tone === 'ruby' ? '#E2505B' : MC.champagne;
  const dashEl = <span style={{ display: 'inline-block', width: 44 * p, height: 1.5, background: MC.gold, boxShadow: `0 0 8px ${MC.gold}` }} />;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width, zIndex: z, display: 'flex', alignItems: 'center', gap: 16, justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end', opacity: Math.min(1, p * 1.5) * o }}>
      {dash && dashEl}
      <span style={{ fontFamily: MF[font], fontWeight: 600, fontSize: size, letterSpacing: font === 'sans' ? tracking + 12 * (1 - p) : 0, color, lineHeight: 1.6, whiteSpace: 'nowrap', textShadow: `0 0 12px ${rgba(MC.black, 0.9)}` }}>{text}</span>
      {dash && align === 'center' && dashEl}
    </div>
  );
};

/* ───────────────────────── light & line graphics ───────────────────────── */
/** A thin horizontal gold light line that opens from the centre — the first thing seen in the dark. */
export const GoldLine: React.FC<{ y: number; start: number; end: number; w?: number; dur?: number; x?: number; z?: number }> = ({ y, start, end, w = 760, dur = 0.9, x = 540, z = 5 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, dur));
  const o = exitK(t, end, 0.3);
  const len = w * p;
  const glint = Math.exp(-(((t - start - dur) / 0.25) ** 2));
  return (
    <>
      <div style={{ position: 'absolute', left: x - len / 2, top: y - 1, width: len, height: 2, zIndex: z, opacity: o, background: `linear-gradient(90deg, transparent, ${MC.gold} 20%, #FFF6DA 50%, ${MC.gold} 80%, transparent)`, boxShadow: `0 0 18px ${MC.champagne}, 0 0 40px ${rgba(MC.gold, 0.6)}` }} />
      {glint > 0.02 && <div style={{ position: 'absolute', left: x - 90, top: y - 90, width: 180, height: 180, zIndex: z, borderRadius: '50%', opacity: glint * o, background: `radial-gradient(circle, #FFFFFF 0%, ${rgba(MC.champagne, 0.6)} 25%, transparent 65%)`, mixBlendMode: 'screen' }} />}
    </>
  );
};

/** Golden glow pool behind a product (controlled, never blown out). */
export const Glow: React.FC<{ cx: number; cy: number; r: number; start: number; end: number; strength?: number; color?: 'gold' | 'ruby'; z?: number }> = ({ cx, cy, r, start, end, strength = 0.7, color = 'gold', z = 1 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const a = cubicOut(prog(t, start, 1.0)) * exitK(t, end, 0.4) * strength * (0.88 + 0.12 * Math.sin(t * 1.3));
  const c1 = color === 'gold' ? MC.champagne : '#E2505B';
  const c2 = color === 'gold' ? MC.gold : MC.crimson;
  return <div style={{ position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, zIndex: z, borderRadius: '50%', opacity: a, mixBlendMode: 'screen', background: `radial-gradient(circle, ${rgba(c1, 0.55)} 0%, ${rgba(c2, 0.25)} 30%, ${rgba(MC.ruby, 0.12)} 55%, transparent 72%)` }} />;
};

/** Glowing circular HUD graphic: drawn ring + ticks + orbiting dot. */
export const Halo: React.FC<{ cx: number; cy: number; r: number; start: number; end: number; z?: number; opacity?: number }> = ({ cx, cy, r, start, end, z = 2, opacity = 1 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, 1.2));
  const o = exitK(t, end, 0.35) * opacity;
  const a = ((t - start) * 40 * Math.PI) / 180;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, opacity: o, overflow: 'visible', filter: `drop-shadow(0 0 6px ${rgba(MC.gold, 0.8)})` }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={MC.champagne} strokeWidth={1.6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} transform={`rotate(-90 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r + 26} fill="none" stroke={MC.gold} strokeOpacity={0.6 * p} strokeWidth={1} strokeDasharray="2 14" transform={`rotate(${t * 8} ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r - 22} fill="none" stroke={MC.crimson} strokeOpacity={0.55 * p} strokeWidth={1.2} strokeDasharray="60 30" transform={`rotate(${-t * 12} ${cx} ${cy})`} />
      {p > 0.3 && <circle cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={5} fill="#FFF6DA" />}
    </svg>
  );
};

/** Ingredient annotation: glowing dot on the object, a leader line draws out, then the label slides along it. */
export const Annot: React.FC<{ x: number; y: number; tx: number; ty: number; len: number; start: number; end: number; num: string; kh: string; en: string; d: string; side?: 'left' | 'right' }> = ({ x, y, tx, ty, len, start, end, num, kh, en, d, side = 'right' }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, 0.55));
  const lp = cubicOut(prog(t, start + 0.4, 0.5));
  const tp = expoOut(prog(t, start + 0.55, 0.8));
  const o = exitK(t, end, 0.3);
  const ex = x + (tx - x) * p;
  const ey = y + (ty - y) * p;
  const dir = side === 'right' ? 1 : -1;
  const lx = tx + dir * len * lp;
  const tx0 = side === 'right' ? tx + 8 : tx - 448;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 8, opacity: o }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: `drop-shadow(0 0 5px ${MC.gold})` }}>
        <circle cx={x} cy={y} r={7 + 16 * (1 - p)} fill="none" stroke={MC.champagne} strokeWidth={1.5} opacity={p} />
        <circle cx={x} cy={y} r={5} fill="#FFF6DA" />
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={MC.champagne} strokeWidth={1.6} />
        {p >= 1 && <line x1={tx} y1={ty} x2={lx} y2={ty} stroke={MC.gold} strokeWidth={1.6} />}
        {lp > 0.95 && <circle cx={lx} cy={ty} r={3.5} fill={MC.champagne} />}
      </svg>
      <div style={{ position: 'absolute', top: ty - 112, left: tx0, width: 440, textAlign: side === 'right' ? 'left' : 'right', opacity: tp, transform: `translateX(${dir * -24 * (1 - tp)}px)`, filter: tp < 1 ? `blur(${(1 - tp) * 6}px)` : undefined }}>
        <div style={{ fontFamily: MF.serif, fontStyle: 'italic', fontSize: 30, color: MC.gold, lineHeight: 1 }}>{num}</div>
        <div style={{ fontFamily: MF.khSerif, fontWeight: 700, fontSize: 54, lineHeight: 1.6, ...ink('ivory', 54) }}>{kh}</div>
      </div>
      <div style={{ position: 'absolute', top: ty + 12, left: tx0, width: 440, textAlign: side === 'right' ? 'left' : 'right', opacity: tp }}>
        <div style={{ fontFamily: MF.sans, fontWeight: 600, fontSize: 16, letterSpacing: 5, color: MC.champagne }}>{en}</div>
        <div style={{ fontFamily: MF.khSans, fontWeight: 400, fontSize: 28, color: rgba(MC.ivory, 0.8), lineHeight: 1.6, marginTop: 4 }}>{d}</div>
      </div>
    </div>
  );
};

/** Dark glassmorphism panel: translucent black, gold hairline border, inner top highlight. */
export const DarkGlass: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; dx?: number; dy?: number; r?: number; phase?: number; z?: number; children?: React.ReactNode }> = ({ x, y, w, h, start, end, dx = 0, dy = 60, r = 30, phase = 0, z = 7, children }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 0.7);
  const e = backOut(p, 1.0);
  const o = Math.min(1, p * 2.2) * exitK(t, end, 0.3);
  const fl = 5 * Math.sin((t - start) * 1.3 + phase);
  const sweep = ((t - start - 0.5) % 3) / 0.8;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, opacity: o, borderRadius: r, overflow: 'hidden',
        transform: `translate(${dx * (1 - e)}px, ${dy * (1 - e) + fl}px)`,
        background: `linear-gradient(150deg, ${rgba('#2A1A1C', 0.72)} 0%, ${rgba(MC.black, 0.62)} 100%)`,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        boxShadow: `inset 0 0 0 1px ${rgba(MC.gold, 0.55)}, inset 0 1px 0 ${rgba(MC.champagne, 0.35)}, 0 24px 50px ${rgba(MC.black, 0.6)}, 0 0 30px ${rgba(MC.ruby, 0.15)}`,
        filter: p < 1 ? `blur(${(1 - cubicOut(p)) * 8}px)` : undefined,
      }}
    >
      {sweep > 0 && sweep < 1 && <div style={{ position: 'absolute', top: 0, bottom: 0, width: 120, left: -160 + sweep * (w + 320), transform: 'skewX(-20deg)', background: `linear-gradient(90deg, transparent, ${rgba(MC.champagne, 0.18)}, transparent)` }} />}
      {children}
    </div>
  );
};

/**
 * Thin animated gold outline around any cut-out image (e.g. a ginger slice): four 1-px gold drop-shadows
 * trace the alpha edge; a glow pulse travels while a wipe reveals the outline.
 */
export const outlineFilter = (p: number, t: number) => {
  const a = 0.95 * p;
  const g = 6 + 4 * Math.sin(t * 3);
  return `drop-shadow(1.5px 0 0 ${rgba(MC.champagne, a)}) drop-shadow(-1.5px 0 0 ${rgba(MC.champagne, a)}) drop-shadow(0 1.5px 0 ${rgba(MC.champagne, a)}) drop-shadow(0 -1.5px 0 ${rgba(MC.champagne, a)}) drop-shadow(0 0 ${g}px ${rgba(MC.gold, 0.7 * p)})`;
};

/** Rim light behind a model/product: a warm edge glow made from a blurred, gold-tinted copy of the image. */
export const rimFilter = (k: number) => `drop-shadow(0 0 ${2 + 2 * k}px ${rgba(MC.champagne, 0.9 * k)}) drop-shadow(0 0 ${18 * k}px ${rgba(MC.gold, 0.55 * k)}) drop-shadow(0 0 ${40 * k}px ${rgba(MC.crimson, 0.45 * k)})`;

/** Minimal infographic: an animated gold curve with points (used behind the highlights headline). */
export const Curve: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; z?: number }> = ({ x, y, w, h, start, end, z = 2 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, 1.3));
  const o = exitK(t, end, 0.3);
  const pts = [0, 0.18, 0.32, 0.5, 0.66, 0.82, 1].map((k, i) => [x + w * k, y + h * (1 - [0.1, 0.25, 0.2, 0.45, 0.55, 0.78, 0.95][i])]);
  const d = pts.map((q, i) => (i ? 'L' : 'M') + q[0] + ' ' + q[1]).join(' ');
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, opacity: o * 0.8, overflow: 'visible' }}>
      {[0.25, 0.5, 0.75].map((k) => <line key={k} x1={x} x2={x + w} y1={y + h * k} y2={y + h * k} stroke={MC.gold} strokeOpacity={0.12} strokeDasharray="2 8" />)}
      <path d={d} fill="none" stroke={MC.champagne} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 0 6px ${MC.gold})` }} />
      {pts.map((q, i) => (i / (pts.length - 1) <= p ? <circle key={i} cx={q[0]} cy={q[1]} r={i === pts.length - 1 ? 7 : 4} fill={i === pts.length - 1 ? '#FFF6DA' : MC.gold} /> : null))}
    </svg>
  );
};

/** Stroke icon set in gold. */
const st = { fill: 'none', stroke: MC.champagne, strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
export const MICONS: Record<string, React.ReactNode> = {
  drop: (<><path {...st} d="M32 10 C32 10 14 30 14 40 A18 18 0 0 0 50 40 C50 30 32 10 32 10Z" /><path {...st} d="M10 10 L54 54" /></>),
  flask: (<><path {...st} d="M26 10 H38 M28 10 V26 L14 50 A4 4 0 0 0 18 56 H46 A4 4 0 0 0 50 50 L36 26 V10" /><path {...st} d="M10 10 L54 54" /></>),
  heart: (<><path {...st} d="M32 52 C10 36 8 20 20 14 C27 11 32 16 32 20 C32 16 37 11 44 14 C56 20 54 36 32 52Z" /><path {...st} d="M14 32 H24 L28 25 L34 40 L38 32 H50" /></>),
  leaf: (<><path {...st} d="M12 52 C12 24 30 12 54 12 C54 38 40 52 12 52Z" /><path {...st} d="M12 52 L40 24" /></>),
};

export { MF, MC, rgba };
