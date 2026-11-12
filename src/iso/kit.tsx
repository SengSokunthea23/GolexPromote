/**
 * Golden Ginger World motion kit — pastel stages, floating isometric miniatures, gold ribbons, 3D cards.
 *
 * Motion rules: objects float in on a soft overshoot and keep bobbing; cameras push and pull; ribbons and
 * card flips carry the cuts; shadows always sit under floating objects so the world reads as dimensional.
 */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useTime } from '../lib/useTime';
import { DirBlur, backOut, cubicIn, cubicInOut, cubicOut, exitK, expoOut, prog } from '../lux/kit';
import { clamp } from '../lib/easing';
import { IsoTransition, I_OVERLAP } from './timeline';

export { backOut, cubicInOut, cubicOut, exitK, expoOut, prog };

/** Golden Ginger World palette (from the brief). Packaging colours are never altered. */
export const IC = {
  peach: '#F6C9B6',
  pink: '#F7D8D3',
  ivory: '#FFF6EA',
  beige: '#F8E7D5',
  ruby: '#790D18',
  burgundy: '#3B1016',
  crimson: '#A71924',
  champagne: '#D9B66F',
  gold: '#C99B45',
  softGold: '#F4D98A',
} as const;
export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
const mixHex = (a: string, b: string, k: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
};

/* ───────────────────────── pastel stage ───────────────────────── */
/**
 * Pastel gradient stage that morphs from the previous scene's colours (`prev`) into this scene's (`bg`)
 * during the entrance — the "background colour transformation" transition. Soft light blobs, a faint
 * isometric lattice and drifting light motes complete the world.
 */
export const Pastel: React.FC<{ t0: number; bg: [string, string]; prev?: [string, string]; lattice?: boolean }> = ({ t0, bg, prev, lattice = true }) => {
  const lt = useTime();
  const t = lt + t0;
  const k = prev ? cubicInOut(clamp(lt / 0.9)) : 1;
  const c1 = prev ? mixHex(prev[0], bg[0], k) : bg[0];
  const c2 = prev ? mixHex(prev[1], bg[1], k) : bg[1];
  const bx = 30 + 20 * Math.sin(t * 0.2);
  const by = 70 + 8 * Math.cos(t * 0.17);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `linear-gradient(165deg, ${c1} 0%, ${c2} 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 22%, ${rgba('#FFFFFF', 0.7)} 0%, transparent 40%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${bx}% ${by}%, ${rgba(IC.softGold, 0.35)} 0%, transparent 45%)` }} />
      {lattice && <Lattice t={t} />}
      <Motes t={t} />
    </AbsoluteFill>
  );
};

/** Faint isometric lattice (30° lines) drifting slowly — the "graphic grid" of the miniature world. */
const Lattice: React.FC<{ t: number }> = ({ t }) => {
  const off = (t * 10) % 120;
  const lines = Array.from({ length: 34 }, (_, i) => i * 120 - 1920 + off);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
      <g stroke={IC.gold} strokeWidth={1}>
        {lines.map((c) => <line key={`a${c}`} x1={0} y1={c} x2={1080} y2={c + 623} />)}
        {lines.map((c) => <line key={`b${c}`} x1={0} y1={c + 623} x2={1080} y2={c} />)}
      </g>
    </svg>
  );
};
const MOTES = Array.from({ length: 24 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 733) % 1920, s: 4 + ((i * 7) % 9), v: 14 + ((i * 13) % 20), ph: i }));
const Motes: React.FC<{ t: number }> = ({ t }) => (
  <>
    {MOTES.map((m, i) => {
      const y = ((((m.y - m.v * t) % 2000) + 2000) % 2000) - 40;
      return <div key={i} style={{ position: 'absolute', left: m.x + 12 * Math.sin(t * 0.5 + m.ph), top: y, width: m.s, height: m.s, borderRadius: '50%', background: '#FFFFFF', opacity: 0.35 + 0.3 * Math.sin(t * 1.5 + m.ph), boxShadow: `0 0 ${m.s * 2}px ${rgba(IC.softGold, 0.8)}` }} />;
    })}
  </>
);

/* ───────────────────────── isometric primitives ───────────────────────── */
type Faces = { top: string; left: string; right: string; edge?: string };
/** Isometric block: top-face centre (cx, cy), half-width s (2:1 projection), height h. */
export const IsoBlock: React.FC<{ cx: number; cy: number; s: number; h: number; c: Faces }> = ({ cx, cy, s, h, c }) => (
  <g strokeLinejoin="round" stroke={c.edge ?? 'none'} strokeWidth={c.edge ? 1.5 : 0}>
    <polygon points={`${cx - s},${cy} ${cx},${cy + s / 2} ${cx},${cy + s / 2 + h} ${cx - s},${cy + h}`} fill={c.left} />
    <polygon points={`${cx},${cy + s / 2} ${cx + s},${cy} ${cx + s},${cy + h} ${cx},${cy + s / 2 + h}`} fill={c.right} />
    <polygon points={`${cx},${cy - s / 2} ${cx + s},${cy} ${cx},${cy + s / 2} ${cx - s},${cy}`} fill={c.top} />
  </g>
);

export const PLATFORM: Faces = { top: IC.ivory, left: '#E9C3A6', right: '#D9A98A', edge: rgba(IC.gold, 0.6) };
export const RUBY_PLATFORM: Faces = { top: IC.beige, left: IC.crimson, right: IC.ruby, edge: rgba(IC.champagne, 0.9) };
export const GOLD_PLATFORM: Faces = { top: '#FFF2D2', left: IC.champagne, right: IC.gold, edge: rgba('#FFFFFF', 0.6) };

/**
 * A floating miniature island: an isometric platform with a soft ground shadow, entering with a rise +
 * overshoot + tilt and then bobbing. Children are positioned in island-local pixels (top face centre at
 * (W/2, W*0.3)).
 */
export const Island: React.FC<{ x: number; y: number; W: number; start: number; end: number; faces?: Faces; depth?: number; phase?: number; z?: number; delayIn?: number; children?: React.ReactNode }> = ({
  x, y, W, start, end, faces = PLATFORM, depth = 0.14, phase = 0, z = 3, children,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 0.95);
  const e = backOut(p, 1.3);
  const o = Math.min(1, p * 2.5) * exitK(t, end, 0.35);
  const life = t - start;
  const bob = 10 * Math.sin(life * 1.6 + phase);
  const H = W * 0.95;
  const s = W * 0.46;
  const cy = W * 0.3;
  return (
    <>
      <div style={{ position: 'absolute', left: x - W * 0.38, top: y + W * 0.2 + 40, width: W * 0.76, height: W * 0.14, zIndex: z - 1, borderRadius: '50%', opacity: o * (0.42 - 0.12 * Math.sin(life * 1.6 + phase)), background: `radial-gradient(ellipse, ${rgba(IC.burgundy, 0.45)} 0%, transparent 70%)`, filter: 'blur(8px)', transform: `scale(${(0.7 + 0.3 * e) * (1 - 0.08 * Math.sin(life * 1.6 + phase))})` }} />
      <div style={{ position: 'absolute', left: x - W / 2, top: y - H / 2, width: W, height: H, zIndex: z, opacity: o, transform: `translateY(${220 * (1 - e) + bob}px) perspective(1400px) rotateX(${14 * (1 - cubicOut(p))}deg) rotateZ(${-6 * (1 - e)}deg) scale(${0.7 + 0.3 * e})`, filter: p < 1 ? `blur(${(1 - cubicOut(p)) * 10}px)` : undefined }}>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: `drop-shadow(0 12px 14px ${rgba(IC.burgundy, 0.18)})` }}>
          <IsoBlock cx={W / 2} cy={cy} s={s} h={W * depth} c={faces} />
        </svg>
        {children}
      </div>
    </>
  );
};

/** Miniature GOLEX coffee shop (isometric), drawn to sit on an island top face centred at (cx, cy). */
export const Cafe: React.FC<{ cx: number; cy: number; s?: number; build?: number }> = ({ cx, cy, s = 120, build = 1 }) => {
  const t = useTime();
  const h = s * 1.15 * build;
  const top = cy - h;
  const L = (x: number, y: number) => `matrix(1, 0.5, 0, 1, ${x}, ${y})`; // left face plane
  const R = (x: number, y: number) => `matrix(1, -0.5, 0, 1, ${x}, ${y})`; // right face plane
  return (
    <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }} width="100%" height="100%">
      {/* walls */}
      <IsoBlock cx={cx} cy={top} s={s} h={h} c={{ top: IC.beige, left: IC.ivory, right: '#F3DCC5', edge: rgba(IC.gold, 0.5) }} />
      {/* roof */}
      {build > 0.9 && <IsoBlock cx={cx} cy={top - 16} s={s * 1.12} h={18} c={{ top: IC.crimson, left: IC.ruby, right: IC.burgundy }} />}
      {build > 0.95 && (
        <>
          {/* awning stripes on the left face */}
          <g transform={L(cx - s, top + 22)}>
            {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * (s / 8)} y={0} width={s / 8} height={26} fill={i % 2 ? IC.ivory : IC.crimson} />)}
            <rect x={s * 0.12} y={40} width={s * 0.76} height={22} rx={3} fill={IC.ruby} />
            <text x={s * 0.5} y={57} textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight={700} fontSize={16} letterSpacing={3} fill={IC.softGold}>GOLEX</text>
            <rect x={s * 0.14} y={74} width={s * 0.32} height={h - 92} rx={4} fill={rgba(IC.softGold, 0.75)} stroke={IC.gold} strokeWidth={2} />
            <rect x={s * 0.56} y={74} width={s * 0.3} height={h * 0.32} rx={4} fill={rgba(IC.softGold, 0.75)} stroke={IC.gold} strokeWidth={2} />
          </g>
          {/* door on the right face */}
          <g transform={R(cx, top + s / 2 + 30)}>
            <rect x={s * 0.34} y={h * 0.38 - 30} width={s * 0.34} height={h * 0.62} rx={4} fill={IC.ruby} stroke={IC.gold} strokeWidth={2} />
            <circle cx={s * 0.62} cy={h * 0.7} r={3} fill={IC.softGold} />
          </g>
          {/* chimney steam */}
          {[0, 1, 2].map((i) => {
            const k = (((t * 0.35 + i / 3) % 1) + 1) % 1;
            return <circle key={i} cx={cx + s * 0.55 + 10 * Math.sin(k * 6 + i)} cy={top - 40 - k * 90} r={10 + k * 16} fill="#FFFFFF" opacity={0.55 * Math.sin(Math.PI * k)} />;
          })}
        </>
      )}
    </svg>
  );
};

/* ───────────────────────── gold ribbon ───────────────────────── */
/**
 * A large flowing champagne-gold ribbon. The visible segment travels along the path (head leads, tail
 * follows), so it sweeps through the frame. `hold` keeps a drawn ribbon on screen instead of passing.
 */
export const Ribbon: React.FC<{ d: string; start: number; dur?: number; width?: number; hold?: boolean; end?: number; z?: number; opacity?: number }> = ({ d, start, dur = 1.0, width = 120, hold = false, end = 1e9, z = 9, opacity = 1 }) => {
  const t = useTime();
  const p = (t - start) / dur;
  if (p < 0 || t > end || (!hold && p > 1)) return null;
  const head = cubicInOut(clamp(p * 1.4));
  const tail = hold ? 0 : cubicInOut(clamp(p * 1.4 - 0.45));
  const o = (hold ? exitK(t, end, 0.35) : 1) * opacity;
  const id = `rb${Math.round(start * 1000)}${width}`;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, overflow: 'visible', opacity: o, filter: `drop-shadow(0 18px 22px ${rgba(IC.burgundy, 0.25)})` }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={IC.softGold} />
          <stop offset="0.35" stopColor={IC.champagne} />
          <stop offset="0.6" stopColor="#FFF4D6" />
          <stop offset="1" stopColor={IC.gold} />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0.0001, head - tail)} 3`} strokeDashoffset={-tail} />
      <path d={d} fill="none" stroke={rgba('#FFFFFF', 0.55)} strokeWidth={width * 0.08} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0.0001, head - tail)} 3`} strokeDashoffset={-tail} transform={`translate(0 ${-width * 0.22})`} />
    </svg>
  );
};
/** The transition ribbon's path: a big S-curve from bottom-left to top-right. */
export const SWEEP_PATH = 'M -200 1700 C 300 1500, 200 900, 560 860 S 900 400, 1300 180';

/* ───────────────────────── scene shell ───────────────────────── */
type ShellProps = { L: number; enter: IsoTransition; exit?: IsoTransition; origin?: [number, number]; children: React.ReactNode };
/**
 * blur   — soft focus-in
 * ribbon — a wide gold ribbon sweeps across; the next scene settles in behind it
 * flip   — 3D rotation: outgoing turns away, incoming turns in (like a card in space)
 * circle — shape reveal from `origin`
 * zoom   — camera push-through
 * pull   — camera pull-back: the incoming world starts as a rounded window and opens to full frame
 */
export const Shell: React.FC<ShellProps> = ({ L, enter, exit, origin = [540, 960], children }) => {
  const t = useTime();
  const dur = enter === 'ribbon' ? 0.75 : enter === 'flip' ? 0.7 : enter === 'pull' ? 0.85 : 0.6;
  const p = t / dur;
  let tf = '';
  let filter = '';
  let clip: string | undefined;
  let opacity = 1;
  let vx = 0;
  if (p < 1) {
    const e = cubicOut(p);
    if (enter === 'blur') { filter += `blur(${18 * (1 - e)}px)`; tf += `scale(${1.04 - 0.04 * e})`; opacity = Math.min(1, p * 1.6); }
    else if (enter === 'ribbon') { tf += `scale(${1.08 - 0.08 * e}) translateY(${60 * (1 - e)}px)`; filter += `blur(${10 * (1 - e)}px)`; opacity = clamp((t - 0.12) / 0.3); }
    else if (enter === 'flip') { tf += `perspective(2200px) rotateY(${-75 * (1 - e)}deg) scale(${0.9 + 0.1 * e})`; opacity = Math.min(1, p * 2); vx = 30 * (1 - e) ** 2; }
    else if (enter === 'circle') { clip = `circle(${2200 * expoOut(p)}px at ${origin[0]}px ${origin[1]}px)`; tf += `scale(${1.1 - 0.1 * e})`; }
    else if (enter === 'zoom') { tf += `scale(${1.35 - 0.35 * e})`; filter += `blur(${14 * (1 - e)}px)`; opacity = Math.min(1, p * 2.2); }
    else if (enter === 'pull') {
      const k = expoOut(p);
      clip = `inset(${560 * (1 - k)}px ${300 * (1 - k)}px ${560 * (1 - k)}px ${300 * (1 - k)}px round ${120 * (1 - k) + 0.01}px)`;
      tf += `scale(${1.25 - 0.25 * e})`;
    }
  }
  const po = exit ? clamp((t - (L - I_OVERLAP)) / I_OVERLAP) : 0;
  if (po > 0 && exit) {
    const e = cubicIn(po);
    if (exit === 'flip') { tf += ` perspective(2200px) rotateY(${70 * e}deg)`; opacity *= 1 - e; }
    else if (exit === 'zoom') { tf += ` scale(${1 + 0.4 * e})`; filter += ` blur(${12 * e}px)`; opacity *= 1 - e; }
    else if (exit === 'pull') { tf += ` scale(${1 - 0.12 * e})`; filter += ` blur(${6 * e}px)`; }
    else { tf += ` scale(${1 - 0.05 * e})`; filter += ` blur(${6 * e}px)`; }
  }
  return (
    <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip, opacity, isolation: 'isolate' }}>
      <DirBlur x={vx} style={{ position: 'absolute', inset: 0, transform: tf || undefined, filter: filter || undefined, transformOrigin: `${origin[0]}px ${origin[1]}px` }}>
        <AbsoluteFill style={{ overflow: 'hidden' }}>{children}</AbsoluteFill>
      </DirBlur>
      {enter === 'ribbon' && <Ribbon d={SWEEP_PATH} start={-0.15} dur={0.95} width={260} z={20} />}
    </AbsoluteFill>
  );
};

/* ───────────────────────── 3D cards & counters ───────────────────────── */
/** Rounded info card that rotates into view in 3D and settles (soft shadow, white face, gold hairline). */
export const Card3D: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; from?: 'left' | 'right'; phase?: number; z?: number; children?: React.ReactNode }> = ({ x, y, w, h, start, end, from = 'left', phase = 0, z = 7, children }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 0.8);
  const e = backOut(p, 1.2);
  const o = Math.min(1, p * 2.5) * exitK(t, end, 0.3);
  const life = t - start;
  const sgn = from === 'left' ? -1 : 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, opacity: o, perspective: 1400 }}>
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: 32,
          transform: `translateY(${6 * Math.sin(life * 1.4 + phase)}px) rotateY(${sgn * 80 * (1 - e) + 3 * Math.sin(life * 0.9 + phase)}deg) rotateX(${2 * Math.sin(life * 1.1 + phase)}deg) translateX(${sgn * 120 * (1 - e)}px)`,
          background: `linear-gradient(150deg, #FFFFFF 0%, ${IC.ivory} 100%)`,
          boxShadow: `inset 0 0 0 1.5px ${rgba(IC.champagne, 0.85)}, 0 26px 40px ${rgba(IC.burgundy, 0.18)}, 0 6px 12px ${rgba(IC.burgundy, 0.08)}`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const KH_DIGITS = '០១២៣៤៥៦៧៨៩';
export const khNum = (n: number) => String(n).split('').map((d) => KH_DIGITS[+d] ?? d).join('');
/** Animated counter in Khmer numerals (e.g. ០ → ២៥). */
export const Counter: React.FC<{ to: number; start: number; dur?: number; style?: React.CSSProperties; suffix?: string }> = ({ to, start, dur = 1.0, style, suffix = '' }) => {
  const t = useTime();
  const v = Math.round(to * cubicOut(prog(t, start, dur)));
  return <span style={style}>{khNum(v)}{suffix}</span>;
};

/* ───────────────────────── path helpers ───────────────────────── */
type Pt = [number, number];
/** Point on a cubic Bézier. */
export const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, k: number): Pt => {
  const u = 1 - k;
  return [u * u * u * p0[0] + 3 * u * u * k * p1[0] + 3 * u * k * k * p2[0] + k * k * k * p3[0], u * u * u * p0[1] + 3 * u * u * k * p1[1] + 3 * u * k * k * p2[1] + k * k * k * p3[1]];
};

/** Small isometric icon cube (ivory/gold) with a stroke icon on its top-left face. */
export const IsoIcon: React.FC<{ size?: number; draw?: number; icon: React.ReactNode }> = ({ size = 120, draw = 1, icon }) => {
  const s = size * 0.42;
  const cx = size / 2;
  const cy = size * 0.32;
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      <IsoBlock cx={cx} cy={cy} s={s} h={s * 0.9} c={{ top: '#FFF2D2', left: IC.crimson, right: IC.ruby, edge: rgba(IC.champagne, 0.9) }} />
      <g transform={`matrix(${s / 64}, ${s / 128}, 0, ${(s * 0.9) / 64}, ${cx - s}, ${cy})`} style={{ strokeDasharray: 300, strokeDashoffset: 300 * (1 - draw) } as React.CSSProperties}>
        {icon}
      </g>
    </svg>
  );
};
const st = { fill: 'none', stroke: IC.softGold, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
export const IICONS: Record<string, React.ReactNode> = {
  drop: (<><path {...st} d="M32 10 C32 10 14 30 14 40 A18 18 0 0 0 50 40 C50 30 32 10 32 10Z" /><path {...st} d="M10 10 L54 54" /></>),
  flask: (<><path {...st} d="M26 10 H38 M28 10 V26 L14 50 A4 4 0 0 0 18 56 H46 A4 4 0 0 0 50 50 L36 26 V10" /><path {...st} d="M10 10 L54 54" /></>),
};
