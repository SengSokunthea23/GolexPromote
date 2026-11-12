/**
 * Editorial motion kit — kinetic typography + abstract 2D graphics. No 3D, no miniatures.
 *
 * Motion rules: type is the hero (oversized italic words letter-by-letter, Khmer word-by-word from masks);
 * graphics are flat and organic (morphing blobs, drawn lines, waveforms, grids, dot fields); photos are
 * cropped in editorial frames; cuts are white flashes, colour-block wipes, shape reveals and focus pulls.
 */
import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { clamp } from '../lib/easing';
import { useTime } from '../lib/useTime';
import { DirBlur, backOut, cubicIn, cubicInOut, cubicOut, exitK, expoOut, prog } from '../lux/kit';
import { EC, EF, rgba } from './theme';
import { EdTransition, E_OVERLAP } from './timeline';

export { backOut, cubicInOut, cubicOut, exitK, expoOut, prog, EC, EF, rgba };

type Tone = 'ivory' | 'cream' | 'ruby' | 'burgundy' | 'espresso';
const BG: Record<Tone, string> = { ivory: EC.ivory, cream: EC.cream, ruby: EC.ruby, burgundy: EC.burgundy, espresso: EC.espresso };
const dark = (t: Tone) => t === 'ruby' || t === 'burgundy' || t === 'espresso';

/* ───────────────────────── paper: background + fine grid + dotted texture ───────────────────────── */
export const Paper: React.FC<{ t0: number; tone?: Tone; grid?: boolean; dots?: [number, number, number, number] }> = ({ t0, tone = 'ivory', grid = true, dots }) => {
  const t = useTime() + t0;
  const d = dark(tone);
  const line = d ? rgba(EC.champagne, 0.09) : rgba(EC.gold, 0.16);
  const lx = 30 + 25 * Math.sin(t * 0.15);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: BG[tone] }}>
      <AbsoluteFill style={{ background: d ? `radial-gradient(ellipse 80% 60% at ${lx}% 30%, ${rgba(EC.crimson, 0.45)} 0%, transparent 60%)` : `radial-gradient(ellipse 80% 60% at ${lx}% 25%, #FFFFFF 0%, transparent 60%)` }} />
      {grid && (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id={`g${tone}`} width={54} height={54} patternUnits="userSpaceOnUse">
              <path d="M 54 0 L 0 0 0 54" fill="none" stroke={line} strokeWidth={1} />
            </pattern>
          </defs>
          <rect width={1080} height={1920} fill={`url(#g${tone})`} />
        </svg>
      )}
      {dots && <Dots x={dots[0]} y={dots[1]} w={dots[2]} h={dots[3]} color={d ? EC.champagne : EC.ruby} t={t} />}
    </AbsoluteFill>
  );
};
const Dots: React.FC<{ x: number; y: number; w: number; h: number; color: string; t: number }> = ({ x, y, w, h, color, t }) => {
  const off = (t * 6) % 22;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.32 }}>
      <defs>
        <pattern id={`d${x}${y}`} width={22} height={22} patternUnits="userSpaceOnUse" patternTransform={`translate(${off} 0)`}>
          <circle cx={4} cy={4} r={2.2} fill={color} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#d${x}${y})`} />
    </svg>
  );
};

/* ───────────────────────── abstract graphics ───────────────────────── */
/** Organic morphing shape (flat colour). Scales in with an overshoot and keeps breathing. */
export const Blob: React.FC<{ cx: number; cy: number; r: number; start: number; end: number; color: string; seed?: number; z?: number; opacity?: number }> = ({ cx, cy, r, start, end, color, seed = 0, z = 1, opacity = 1 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const e = backOut(prog(t, start, 0.9), 1.2);
  const o = exitK(t, end, 0.35) * opacity;
  const pts: string[] = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const rr = r * e * (1 + 0.11 * Math.sin(3 * a + t * 0.7 + seed) + 0.07 * Math.sin(5 * a - t * 1.0 + seed * 2) + 0.04 * Math.sin(2 * a + t * 0.5));
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, opacity: o, overflow: 'visible' }}>
      <polygon points={pts.join(' ')} fill={color} />
    </svg>
  );
};

/** Any thin gold line illustration, drawn on (paths in frame coordinates). */
export const Draw: React.FC<{ d: string[]; start: number; end: number; dur?: number; color?: string; width?: number; z?: number }> = ({ d, start, end, dur = 1.0, color = EC.gold, width = 2.5, z = 4 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, dur));
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, opacity: exitK(t, end, 0.3), overflow: 'visible' }}>
      {d.map((path, i) => <path key={i} d={path} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p * 1.15 - i * 0.08)} />)}
    </svg>
  );
};

/** Thin drawn circle with a travelling dot. */
export const Ring: React.FC<{ cx: number; cy: number; r: number; start: number; end: number; color?: string; z?: number; width?: number }> = ({ cx, cy, r, start, end, color = EC.gold, z = 2, width = 2 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, 1.1));
  const a = ((t - start) * 50 * Math.PI) / 180 - Math.PI / 2;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, opacity: exitK(t, end, 0.3), overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={width} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} transform={`rotate(-90 ${cx} ${cy})`} />
      {p > 0.25 && <circle cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={6} fill={color} />}
    </svg>
  );
};

/** Animated waveform: several phase-shifted sine lines drawn on, then flowing. */
export const Wave: React.FC<{ x: number; y: number; w: number; amp: number; start: number; end: number; color?: string; lines?: number; z?: number; freq?: number }> = ({ x, y, w, amp, start, end, color = EC.gold, lines = 3, z = 2, freq = 3 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, 1.0));
  const o = exitK(t, end, 0.3);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, opacity: o, overflow: 'visible' }}>
      {Array.from({ length: lines }, (_, j) => {
        const pts: string[] = [];
        for (let i = 0; i <= 80; i++) {
          const k = i / 80;
          const env = Math.sin(Math.PI * k);
          const yy = y + j * 16 + amp * env * Math.sin(2 * Math.PI * freq * k + t * (2 + j * 0.4) + j);
          pts.push(`${(x + w * k).toFixed(1)},${yy.toFixed(1)}`);
        }
        return <polyline key={j} points={pts.join(' ')} fill="none" stroke={color} strokeWidth={j === 0 ? 2.4 : 1.2} opacity={1 - j * 0.25} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
      })}
    </svg>
  );
};

/** Flat colour block that wipes in from a side (split-screen panels). */
export const Block: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; color: string; from?: 'left' | 'right' | 'top' | 'bottom'; z?: number; r?: number; children?: React.ReactNode }> = ({ x, y, w, h, start, end, color, from = 'top', z = 1, r = 0, children }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const e = expoOut(prog(t, start, 0.8));
  const k = (1 - e) * 100;
  const clip = from === 'top' ? `inset(0 0 ${k}% 0 round ${r}px)` : from === 'bottom' ? `inset(${k}% 0 0 0 round ${r}px)` : from === 'left' ? `inset(0 ${k}% 0 0 round ${r}px)` : `inset(0 0 0 ${k}% round ${r}px)`;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, background: color, clipPath: clip, WebkitClipPath: clip, opacity: exitK(t, end, 0.3), overflow: 'hidden' }}>
      {children}
    </div>
  );
};

/** Editorial photo crop: image inside a rectangle revealed by a directional mask, with a gold hairline frame. */
export const Crop: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; bg?: string; from?: 'left' | 'right' | 'top' | 'bottom'; r?: number; border?: boolean; z?: number; children: React.ReactNode }> = ({ x, y, w, h, start, end, bg, from = 'bottom', r = 0, border = true, z = 3, children }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const e = expoOut(prog(t, start, 0.9));
  const k = (1 - e) * 100;
  const clip = from === 'top' ? `inset(0 0 ${k}% 0 round ${r}px)` : from === 'bottom' ? `inset(${k}% 0 0 0 round ${r}px)` : from === 'left' ? `inset(0 ${k}% 0 0 round ${r}px)` : `inset(0 0 0 ${k}% round ${r}px)`;
  const bp = cubicInOut(prog(t, start + 0.35, 1.0));
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, opacity: exitK(t, end, 0.3) }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: r, background: bg, clipPath: clip, WebkitClipPath: clip }}>{children}</div>
      {border && (
        <svg width={w + 2} height={h + 2} style={{ position: 'absolute', left: -1, top: -1, overflow: 'visible' }}>
          <rect x={-12} y={-12} width={w + 26} height={h + 26} rx={r ? r + 12 : 0} fill="none" stroke={EC.gold} strokeWidth={1.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - bp} />
        </svg>
      )}
    </div>
  );
};

/** A photo/cut-out that resolves from a flat silhouette into full colour (product silhouette reveal). */
export const Silhouette: React.FC<{ start: number; dur?: number; tint?: string; children: React.ReactNode }> = ({ start, dur = 0.9, tint = EC.espresso, children }) => {
  const t = useTime();
  const k = cubicInOut(prog(t, start, dur));
  return (
    <div style={{ position: 'absolute', inset: 0, filter: k < 1 ? `brightness(${k}) ${k < 0.05 ? `drop-shadow(0 0 0 ${tint})` : ''}` : undefined }}>
      {children}
    </div>
  );
};

/** Thin gold outline that traces a cut-out's edge (for floating ingredient photography). */
export const goldEdge = (p: number) => `drop-shadow(1.4px 0 0 ${rgba(EC.gold, p)}) drop-shadow(-1.4px 0 0 ${rgba(EC.gold, p)}) drop-shadow(0 1.4px 0 ${rgba(EC.gold, p)}) drop-shadow(0 -1.4px 0 ${rgba(EC.gold, p)})`;

/* ───────────────────────── typography ───────────────────────── */
/**
 * Oversized italic editorial word — letters rise out of a mask one by one, then the whole word drifts.
 * `outline` draws it as a gold/colour stroke only; `rotate` turns it (e.g. -90 for a vertical word).
 */
export const Giant: React.FC<{ text: string; x: number; y: number; size: number; start: number; end: number; color?: string; outline?: boolean; z?: number; stagger?: number; rotate?: number; drift?: number; align?: 'left' | 'center' }> = ({
  text, x, y, size, start, end, color = EC.ruby, outline = false, z = 1, stagger = 0.045, rotate = 0, drift = 18, align = 'left',
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const o = exitK(t, end, 0.3);
  const life = t - start;
  return (
    <div
      style={{
        position: 'absolute', left: align === 'center' ? 0 : x, width: align === 'center' ? 1080 : undefined, top: y, zIndex: z, opacity: o,
        display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start',
        transform: `translateX(${-drift * life * 0.3}px) rotate(${rotate}deg)`, transformOrigin: 'left top',
        clipPath: 'inset(-5% -20% 0 -20%)', WebkitClipPath: 'inset(-5% -20% 0 -20%)',
      }}
    >
      {text.split('').map((ch, i) => {
        const p = expoOut(prog(t, start + i * stagger, 0.9));
        return (
          <span
            key={i}
            style={{
              display: 'inline-block', whiteSpace: 'pre', fontFamily: EF.display, fontStyle: 'italic', fontWeight: 500, fontSize: size, lineHeight: 1.05, letterSpacing: -size * 0.02,
              transform: `translateY(${105 * (1 - p)}%) rotate(${8 * (1 - p)}deg)`,
              ...(outline ? { color: 'transparent', WebkitTextStroke: `${Math.max(1.5, size / 140)}px ${color}` } : { color }),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

type Ink = 'espresso' | 'ruby' | 'gold' | 'ivory' | 'burgundy' | 'softGold';
const ink = (k: Ink, size: number): React.CSSProperties => {
  if (k === 'gold')
    return { backgroundImage: `linear-gradient(180deg, ${EC.softGold} 0%, ${EC.champagne} 35%, ${EC.gold} 70%, #8E6A2A 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 ${Math.round(size * 0.03) + 1}px ${Math.round(size * 0.05)}px ${rgba(EC.burgundy, 0.35)})` };
  if (k === 'ivory') return { color: EC.cream };
  if (k === 'softGold') return { color: EC.softGold };
  return { color: k === 'espresso' ? EC.espresso : k === 'ruby' ? EC.ruby : EC.burgundy };
};

/**
 * Word-by-word reveal. Khmer must be pre-split on "|" (whole words only — subscripts stay intact).
 * Each word slides out of its own mask; the mask is padded so tall Khmer stacks are never clipped.
 */
export const Words: React.FC<{
  text: string; y: number; start: number; end: number; font?: keyof typeof EF; size?: number; weight?: number; italic?: boolean; tone?: Ink;
  x?: number; width?: number; align?: 'left' | 'center' | 'right'; stagger?: number; mode?: 'rise' | 'slide' | 'scale'; tracking?: number; gap?: number; z?: number;
}> = ({ text, y, start, end, font = 'khSerif', size = 80, weight = 700, italic = false, tone = 'espresso', x = 0, width = 1080, align = 'center', stagger = 0.1, mode = 'rise', tracking = 0, gap, z = 6 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const o = exitK(t, end, 0.3);
  const words = text.split('|');
  const kh = font === 'khSerif' || font === 'khSans';
  const pad = Math.round(size * (kh ? 0.5 : 0.25));
  return (
    <div style={{ position: 'absolute', left: x, top: y - pad, width, zIndex: z, display: 'flex', flexWrap: 'nowrap', gap: gap ?? size * 0.26, justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end', opacity: o, transform: `translateY(${-20 * (1 - o)}px)` }}>
      {words.map((w, i) => {
        const p = prog(t, start + i * stagger, 0.8);
        const e = mode === 'scale' ? backOut(p, 1.3) : expoOut(p);
        const tr = mode === 'rise' ? `translateY(${80 * (1 - e)}%)` : mode === 'slide' ? `translateX(${-60 * (1 - e)}%)` : `scale(${0.5 + 0.5 * e})`;
        return (
          <span key={i} style={{ display: 'inline-block', overflow: mode === 'scale' ? 'visible' : 'hidden', padding: `${pad}px ${size * 0.06}px`, margin: `0 ${-size * 0.06}px` }}>
            <span style={{ display: 'inline-block', whiteSpace: 'pre', fontFamily: EF[font], fontSize: size, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', letterSpacing: tracking, lineHeight: kh ? 1.6 : 1.12, transform: tr, opacity: Math.min(1, p * 2), filter: p < 1 ? `blur(${(1 - cubicOut(p)) * 8}px)` : undefined, ...ink(tone, size) }}>
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Uppercase caption with an animated dash; tracking collapses from wide to final. */
export const Caption: React.FC<{ text: string; y: number; start: number; end: number; x?: number; width?: number; align?: 'left' | 'center' | 'right'; color?: string; size?: number; tracking?: number; font?: 'sans' | 'khSans'; dash?: boolean; z?: number }> = ({
  text, y, start, end, x = 0, width = 1080, align = 'center', color = EC.ruby, size = 21, tracking = 7, font = 'sans', dash = true, z = 6,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = expoOut(prog(t, start, 1.0));
  const o = exitK(t, end, 0.3);
  const dl = <span style={{ display: 'inline-block', width: 44 * p, height: 2, background: EC.gold }} />;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width, zIndex: z, display: 'flex', alignItems: 'center', gap: 16, justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end', opacity: Math.min(1, p * 1.5) * o }}>
      {dash && dl}
      <span style={{ fontFamily: EF[font], fontWeight: 700, fontSize: size, letterSpacing: font === 'sans' ? tracking + 14 * (1 - p) : 0, color, lineHeight: 1.6, whiteSpace: 'nowrap' }}>{text}</span>
      {dash && align === 'center' && dl}
    </div>
  );
};

/** Animated decorative underline (gold), drawing from the left or from the centre. */
export const Underline: React.FC<{ x: number; y: number; w: number; start: number; end: number; dur?: number; from?: 'left' | 'center'; z?: number; color?: string }> = ({ x, y, w, start, end, dur = 0.7, from = 'center', z = 6, color = EC.gold }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, dur));
  const len = w * p;
  return <div style={{ position: 'absolute', left: from === 'center' ? x + (w - len) / 2 : x, top: y, width: len, height: 3, zIndex: z, background: color, opacity: exitK(t, end, 0.3) }} />;
};

/** Editorial info card: flat cream face, gold hairline, slides in from a side. */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; from?: 'left' | 'right'; z?: number; dark?: boolean; children?: React.ReactNode }> = ({ x, y, w, h, start, end, from = 'left', z = 7, dark: dk = false, children }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 0.7);
  const e = expoOut(p);
  const sgn = from === 'left' ? -1 : 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, opacity: Math.min(1, p * 2.5) * exitK(t, end, 0.3), transform: `translateX(${sgn * 160 * (1 - e)}px)`, background: dk ? rgba(EC.burgundy, 0.9) : EC.cream, boxShadow: `inset 0 0 0 1.5px ${rgba(EC.gold, 0.85)}, 0 18px 36px ${rgba(EC.burgundy, 0.14)}`, overflow: 'hidden' }}>
      {children}
    </div>
  );
};

/** Floating cut-out photo with gentle bob, optional gold edge tracing and an entrance from any side. */
export const Float: React.FC<{ src: string; x: number; y: number; w: number; start: number; end: number; dx?: number; dy?: number; rot?: number; edge?: boolean; z?: number; phase?: number; shadow?: boolean; blur?: number }> = ({ src, x, y, w, start, end, dx = 0, dy = 80, rot = 0, edge = false, z = 5, phase = 0, shadow = true, blur = 0 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 0.9);
  const e = backOut(p, 1.2);
  const life = t - start;
  const ep = cubicInOut(prog(t, start + 0.4, 0.8));
  const sh = shadow ? `drop-shadow(0 22px 22px ${rgba(EC.burgundy, 0.28)})` : '';
  return (
    <Img
      src={src}
      style={{
        position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, zIndex: z,
        opacity: Math.min(1, p * 2.2) * exitK(t, end, 0.3),
        transform: `translate(${dx * (1 - e)}px, ${dy * (1 - e) + 8 * Math.sin(life * 1.5 + phase)}px) rotate(${rot + 3 * Math.sin(life * 1.1 + phase)}deg)`,
        filter: `${blur ? `blur(${blur}px) ` : ''}${edge ? goldEdge(ep) + ' ' : ''}${sh}` || undefined,
      }}
    />
  );
};

/* ───────────────────────── scene shell & transitions ───────────────────────── */
type ShellProps = { L: number; enter: EdTransition; exit?: EdTransition; origin?: [number, number]; wipeColor?: string; children: React.ReactNode };
/**
 * blur  — focus pull                    flash — soft white flash (outgoing burns to white just before the cut)
 * wipe  — a flat colour block sweeps across and uncovers the next layout
 * zoom  — push-through                  shape — circular reveal from `origin`
 * slide — directional move with motion blur
 */
export const Shell: React.FC<ShellProps> = ({ L, enter, exit, origin = [540, 960], wipeColor = EC.ruby, children }) => {
  const t = useTime();
  const dur = enter === 'wipe' ? 0.95 : enter === 'flash' ? 0.6 : enter === 'slide' ? 0.75 : enter === 'shape' ? 0.85 : 0.75;
  const p = t / dur;
  let tf = '';
  let filter = '';
  let clip: string | undefined;
  let opacity = 1;
  let dx = 0;
  let panelX: number | null = null;
  let white = 0;
  if (p < 1) {
    const e = cubicOut(p);
    if (enter === 'blur') { filter += `blur(${20 * (1 - e)}px)`; tf += `scale(${1.04 - 0.04 * e})`; opacity = Math.min(1, p * 1.6); }
    else if (enter === 'flash') { white = 1 - cubicOut(p); tf += `scale(${1.05 - 0.05 * e})`; }
    else if (enter === 'wipe') {
      const k = cubicInOut(p);
      panelX = -1080 + 2160 * k;
      const vis = Math.max(0, panelX);
      clip = `inset(0 ${1080 - vis}px 0 0)`;
    } else if (enter === 'zoom') { tf += `scale(${1.3 - 0.3 * e})`; filter += `blur(${14 * (1 - e)}px)`; opacity = Math.min(1, p * 2.2); }
    else if (enter === 'shape') { clip = `circle(${2200 * expoOut(p)}px at ${origin[0]}px ${origin[1]}px)`; tf += `scale(${1.08 - 0.08 * e})`; }
    else if (enter === 'slide') { tf += `translateX(${1080 * (1 - e)}px)`; dx = 50 * (1 - e) ** 2; }
  }
  // exits play during the overlap (under the incoming scene) — except flash, which burns to white before the cut
  let burn = 0;
  if (exit === 'flash') burn = 0.85 * cubicIn(clamp((t - (L - E_OVERLAP - 0.35)) / 0.35));
  const po = exit ? clamp((t - (L - E_OVERLAP)) / E_OVERLAP) : 0;
  if (po > 0 && exit && exit !== 'flash') {
    const e = cubicIn(po);
    if (exit === 'slide') { tf += ` translateX(${-700 * e}px)`; dx = Math.max(dx, 40 * e); }
    else if (exit === 'zoom') { tf += ` scale(${1 + 0.35 * e})`; filter += ` blur(${12 * e}px)`; opacity *= 1 - e; }
    else if (exit === 'blur') filter += ` blur(${14 * e}px)`;
    else tf += ` scale(${1 - 0.04 * e})`;
  }
  return (
    <AbsoluteFill style={{ opacity, isolation: 'isolate' }}>
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        <DirBlur x={dx} style={{ position: 'absolute', inset: 0, transform: tf || undefined, filter: filter || undefined, transformOrigin: `${origin[0]}px ${origin[1]}px` }}>
          <AbsoluteFill style={{ overflow: 'hidden' }}>{children}</AbsoluteFill>
        </DirBlur>
      </AbsoluteFill>
      {panelX !== null && <div style={{ position: 'absolute', top: 0, bottom: 0, left: panelX, width: 1080, background: wipeColor, boxShadow: `-6px 0 0 ${EC.champagne}` }} />}
      {white > 0 && <AbsoluteFill style={{ background: '#FFFFFF', opacity: white }} />}
      {burn > 0 && <AbsoluteFill style={{ background: '#FFFFFF', opacity: burn }} />}
    </AbsoluteFill>
  );
};
