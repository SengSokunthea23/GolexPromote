/**
 * Royal Silk motion kit — the reusable animation language of the Khmer luxury cut.
 *
 * Motion rules (shared by every element so the spot feels like one system):
 *  - entrances settle with a soft overshoot (backOut) or a long expo tail (expoOut), never linear
 *  - anything that travels fast is blurred along its direction of travel
 *  - everything idles: slow float, slow rotation, never a dead frame
 *  - exits are quick (0.3–0.45 s) and lift + blur, so the next scene owns the beat
 */
import React, { useId } from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { COLORS, GOLD_GRADIENT, rgba } from '../theme/colors';
import { clamp } from '../lib/easing';
import { useTime } from '../lib/useTime';
import { LF } from './fonts';
import { TransitionIn, L_OVERLAP } from './timeline';

/* ───────────────────────── easing ───────────────────────── */
export const expoOut = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)));
export const cubicOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const cubicInOut = (x: number) => {
  const v = clamp(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
export const cubicIn = (x: number) => Math.pow(clamp(x), 3);
export const backOut = (x: number, s = 1.5) => {
  const v = clamp(x) - 1;
  return 1 + (s + 1) * v * v * v + s * v * v;
};
/** 0→1 progress of an animation that starts at `start` and lasts `dur`. */
export const prog = (t: number, start: number, dur: number) => clamp((t - start) / dur);
/** 1 while visible, eases to 0 over `eout` seconds before `end`. */
export const exitK = (t: number, end: number, eout = 0.4) => (t > end - eout ? 1 - cubicInOut((t - (end - eout)) / eout) : 1);

export const img = (n: string) => staticFile(`promo/${n}`);
export const spr = (n: string) => staticFile(`sprites/${n}`);

export const DEEP_GOLD = `linear-gradient(180deg, ${COLORS.champagne} 0%, ${COLORS.gold} 45%, ${COLORS.goldDeep} 100%)`;
export const RUBY_INK = `linear-gradient(180deg, ${COLORS.crimson} 0%, ${COLORS.ruby} 55%, ${COLORS.burgundy} 100%)`;
export const BRONZE_INK = `linear-gradient(180deg, #C8913A 0%, ${COLORS.goldDeep} 50%, #6E4A16 100%)`;

/* ───────────────────────── directional blur (SVG filter) ───────────────────────── */
/** Wraps children in a horizontal / vertical gaussian blur — real motion blur along the travel axis. */
export const DirBlur: React.FC<{ x?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x = 0, y = 0, children, style }) => {
  const id = useId().replace(/:/g, '');
  const on = x > 0.3 || y > 0.3;
  return (
    <>
      {on && (
        <svg width={0} height={0} style={{ position: 'absolute' }}>
          <filter id={`db${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={`${x.toFixed(2)} ${y.toFixed(2)}`} />
          </filter>
        </svg>
      )}
      <div style={{ ...style, filter: on ? `url(#db${id})` : undefined }}>{children}</div>
    </>
  );
};

/* ───────────────────────── backdrops ───────────────────────── */
/** Burgundy silk: slow drifting crimson / gold light pools, a satin sheen band and faint concentric guide circles. */
export const Silk: React.FC<{ t0: number; warm?: number; cy?: number }> = ({ t0, warm = 1, cy = 900 }) => {
  const t = useTime() + t0;
  const b1x = 50 + 18 * Math.sin(t * 0.21);
  const b1y = 40 + 10 * Math.cos(t * 0.17);
  const b2x = 50 - 22 * Math.sin(t * 0.15 + 1);
  const b2y = 72 + 8 * Math.sin(t * 0.23);
  const sheen = ((t * 0.07) % 1.6) * 100 - 30;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 95% 70% at 50% ${(cy / 1920) * 100}%, ${COLORS.ruby} 0%, ${COLORS.burgundy} 58%, ${COLORS.espresso} 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${b1x}% ${b1y}%, ${rgba(COLORS.crimson, 0.55)} 0%, transparent 42%)`, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${b2x}% ${b2y}%, ${rgba(COLORS.gold, 0.16 * warm)} 0%, transparent 38%)`, mixBlendMode: 'screen' }} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(118deg, transparent ${sheen - 14}%, ${rgba(COLORS.champagne, 0.07)} ${sheen - 4}%, ${rgba(COLORS.champagne, 0.13)} ${sheen}%, ${rgba(COLORS.champagne, 0.07)} ${sheen + 4}%, transparent ${sheen + 14}%)`,
          mixBlendMode: 'screen',
        }}
      />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.22 }}>
        {[260, 420, 600, 820].map((r, i) => (
          <circle key={r} cx={540} cy={cy} r={r} fill="none" stroke={COLORS.gold} strokeWidth={i === 1 ? 1.2 : 0.8} strokeDasharray={i % 2 ? '2 10' : undefined} transform={`rotate(${t * (i % 2 ? -4 : 3)} 540 ${cy})`} />
        ))}
      </svg>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba(COLORS.espresso, 0.5)} 0%, transparent 18%, transparent 74%, ${rgba(COLORS.espresso, 0.7)} 100%)` }} />
    </AbsoluteFill>
  );
};

/** Warm cream showcase stage (used selectively, for the clean typographic moments). */
export const Cream: React.FC<{ t0: number }> = ({ t0 }) => {
  const t = useTime() + t0;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 45%, #FFF8E8 0%, ${COLORS.cream} 45%, #F1DDB4 100%)` }} />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {[300, 380, 470].map((r, i) => (
          <circle key={r} cx={540} cy={900} r={r} fill="none" stroke={i === 1 ? COLORS.gold : COLORS.ruby} strokeOpacity={i === 1 ? 0.5 : 0.18} strokeWidth={i === 1 ? 1.5 : 1} strokeDasharray={i === 2 ? '3 12' : undefined} transform={`rotate(${t * (i % 2 ? -6 : 5)} 540 900)`} />
        ))}
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, ${rgba('#C99A55', 0.35)} 100%)` }} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── scene shell: transitions in & out ───────────────────────── */
type ShellProps = { L: number; t0: number; enter: TransitionIn; exit?: TransitionIn; bg?: 'silk' | 'cream' | 'none'; cy?: number; warm?: number; origin?: [number, number]; children: React.ReactNode };

/**
 * Every scene lives in a shell. The incoming scene performs `enter`; the outgoing one performs the
 * matching exit of the *next* scene's transition, during the last L_OVERLAP seconds. Because the
 * incoming scene is stacked above, the pair reads as one continuous move.
 */
export const Shell: React.FC<ShellProps> = ({ L, t0, enter, exit, bg = 'silk', cy, warm, origin = [540, 900], children }) => {
  const t = useTime();
  const OV = L_OVERLAP;
  // ── enter
  const pi = t / (enter === 'circle' ? 0.62 : enter === 'focus' ? 1.1 : 0.5);
  let tf = '';
  let filter = '';
  let clip: string | undefined;
  let opacity = 1;
  let dx = 0;
  let ring: number | null = null;
  if (pi < 1) {
    if (enter === 'focus') {
      const e = cubicOut(pi);
      tf += `scale(${1.08 - 0.08 * e})`;
      filter += `blur(${28 * (1 - e)}px) brightness(${0.4 + 0.6 * e})`;
    } else if (enter === 'circle') {
      const e = expoOut(pi);
      const R = 2200 * e;
      clip = `circle(${R}px at ${origin[0]}px ${origin[1]}px)`;
      tf += `scale(${1.12 - 0.12 * cubicOut(pi)})`;
      ring = R;
    } else if (enter === 'zoom') {
      const e = cubicOut(pi);
      tf += `scale(${1.55 - 0.55 * e})`;
      filter += `blur(${22 * (1 - e)}px)`;
      opacity = Math.min(1, pi * 2.2);
    } else if (enter === 'whipL' || enter === 'whipR') {
      const e = cubicOut(pi);
      const sgn = enter === 'whipL' ? 1 : -1;
      tf += `translateX(${sgn * 1080 * (1 - e)}px)`;
      dx = 60 * (1 - e) * (1 - e) * 2;
    } else if (enter === 'lift') {
      const e = cubicOut(pi);
      tf += `translateY(${420 * (1 - e)}px) scale(${1.04 - 0.04 * e})`;
      filter += `blur(${16 * (1 - e)}px)`;
      opacity = Math.min(1, pi * 2);
    }
  }
  // ── exit (driven by the next scene's entrance)
  const po = exit ? clamp((t - (L - OV)) / OV) : 0;
  if (po > 0 && exit) {
    const e = cubicIn(po);
    if (exit === 'zoom') {
      tf += ` scale(${1 + 0.45 * e})`;
      filter += ` blur(${16 * e}px)`;
      opacity *= 1 - po;
    } else if (exit === 'whipL' || exit === 'whipR') {
      const sgn = exit === 'whipL' ? -1 : 1;
      tf += ` translateX(${sgn * 1080 * e}px)`;
      dx = Math.max(dx, 60 * e);
    } else if (exit === 'circle') {
      tf += ` scale(${1 - 0.08 * e})`;
      filter += ` brightness(${1 - 0.5 * e})`;
    } else if (exit === 'lift') {
      tf += ` translateY(${-300 * e}px)`;
      filter += ` blur(${10 * e}px)`;
    }
  }
  return (
    <AbsoluteFill style={{ clipPath: clip, opacity, isolation: 'isolate' }}>
      <DirBlur x={dx} style={{ position: 'absolute', inset: 0, transform: tf || undefined, filter: filter || undefined, transformOrigin: `${origin[0]}px ${origin[1]}px` }}>
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          {bg === 'silk' && <Silk t0={t0} cy={cy} warm={warm} />}
          {bg === 'cream' && <Cream t0={t0} />}
          {children}
        </AbsoluteFill>
      </DirBlur>
      {ring !== null && ring > 0 && (
        <div
          style={{
            position: 'absolute',
            left: origin[0] - ring,
            top: origin[1] - ring,
            width: ring * 2,
            height: ring * 2,
            borderRadius: '50%',
            border: `5px solid ${COLORS.champagne}`,
            boxShadow: `0 0 26px ${COLORS.gold}, inset 0 0 26px ${COLORS.gold}`,
            opacity: 1 - pi,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/* ───────────────────────── the workhorse: an animated element ───────────────────────── */
type ItemProps = {
  x: number;
  y: number;
  w: number;
  start: number;
  end: number;
  src?: string;
  children?: React.ReactNode;
  dur?: number;
  /** entrance offsets */
  dx?: number;
  dy?: number;
  s0?: number;
  r0?: number;
  rotY0?: number;
  blur0?: number;
  ease?: 'back' | 'expo' | 'cubic';
  /** idle motion */
  bob?: number;
  spin?: number;
  sway?: number;
  push?: number;
  rot?: number;
  blur?: number;
  opacity?: number;
  z?: number;
  shadow?: boolean;
  eout?: number;
  /** motion blur while travelling (px of directional blur at peak speed) */
  mb?: number;
  phase?: number;
  /** CSS mask for the image (e.g. to fade a baked-in studio floor) */
  mask?: string;
};
/** pack.png carries a white studio-floor reflection under the bag; fade it out on dark stages. */
export const PACK_MASK = 'linear-gradient(180deg, #000 0%, #000 84%, transparent 91%)';
export const Item: React.FC<ItemProps> = ({
  x, y, w, start, end, src, children, dur = 0.9, dx = 0, dy = 120, s0 = 0.85, r0 = 0, rotY0 = 0, blur0 = 18, ease = 'back',
  bob = 8, spin = 0, sway = 0, push = 0, rot = 0, blur = 0, opacity = 1, z = 2, shadow = true, eout = 0.4, mb = 0, phase = 0, mask,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, dur);
  const e = ease === 'back' ? backOut(p, 1.2) : ease === 'expo' ? expoOut(p) : cubicOut(p);
  const ce = cubicOut(p);
  const o = Math.min(1, p * 2.2) * exitK(t, end, eout) * opacity;
  const life = t - start;
  const fl = bob * Math.sin(life * 1.5 + phase + x * 0.01);
  const s = (s0 + (1 - s0) * e) * (1 + push * life);
  const bl = blur + blur0 * (1 - ce);
  const speed = mb * Math.pow(1 - p, 2.2);
  const rY = rotY0 * (1 - ce) + sway * Math.sin(life * 0.9 + phase);
  const rz = r0 * (1 - e) + rot + spin * life;
  const content = src ? (
    <div style={{ filter: shadow ? 'drop-shadow(0 34px 40px rgba(23,11,13,0.55))' : undefined }}>
      <Img src={src} style={{ width: '100%', display: 'block', WebkitMaskImage: mask, maskImage: mask }} />
    </div>
  ) : (
    children
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        zIndex: z,
        opacity: o,
        transform: `translate(-50%, -50%) translate(${dx * (1 - e)}px, ${dy * (1 - e) + fl}px) perspective(1700px) rotateY(${rY}deg) rotateZ(${rz}deg) scale(${s})`,
        filter: bl > 0.3 ? `blur(${bl.toFixed(2)}px)` : undefined,
      }}
    >
      {speed > 0.3 ? <DirBlur x={Math.abs(dx) > Math.abs(dy) ? speed : 0} y={Math.abs(dy) >= Math.abs(dx) ? speed : 0}>{content}</DirBlur> : content}
    </div>
  );
};

/* ───────────────────────── orbit system ───────────────────────── */
export type OrbitBody = { src: string; w: number; a0: number; spin?: number };
/**
 * Ingredients orbiting a hero on a tilted ellipse. Depth follows sin(angle): far bodies shrink,
 * blur and pass *behind* the hero (z 1), near bodies grow and pass in front (z 9).
 */
export const Orbit: React.FC<{ cx: number; cy: number; rx: number; ry: number; start: number; end: number; speed?: number; bodies: OrbitBody[]; tilt?: number; grow?: number }> = ({ cx, cy, rx, ry, start, end, speed = 28, bodies, tilt = -8, grow = 1.0 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const life = t - start;
  const g = expoOut(life / grow);
  const o = Math.min(1, life * 2.5) * exitK(t, end, 0.4);
  const tr = (tilt * Math.PI) / 180;
  return (
    <>
      {bodies.map((b, i) => {
        const a = ((b.a0 + speed * life + 140 * (1 - g)) * Math.PI) / 180;
        const ex = rx * g * Math.cos(a);
        const ey = ry * g * Math.sin(a);
        const X = cx + ex * Math.cos(tr) - ey * Math.sin(tr);
        const Y = cy + ex * Math.sin(tr) + ey * Math.cos(tr);
        const depth = Math.sin(a); // -1 far … +1 near
        const sc = 0.78 + 0.32 * (depth + 1) / 2;
        const bl = depth < 0 ? -depth * 5 : 0;
        return (
          <Img
            key={i}
            src={b.src}
            style={{
              position: 'absolute',
              left: X,
              top: Y,
              width: b.w,
              zIndex: depth < 0 ? 1 : 9,
              opacity: o * (0.75 + 0.25 * (depth + 1) / 2),
              transform: `translate(-50%, -50%) rotate(${(b.spin ?? 40) * life + i * 50}deg) scale(${sc})`,
              filter: `${bl > 0.3 ? `blur(${bl.toFixed(1)}px) ` : ''}drop-shadow(0 14px 16px rgba(23,11,13,0.45))`,
            }}
          />
        );
      })}
    </>
  );
};

/** The orbit's guide path: a tilted gold ellipse drawn on, with a comet bead running along it. */
export const OrbitPath: React.FC<{ cx: number; cy: number; rx: number; ry: number; start: number; end: number; tilt?: number; dur?: number; front?: boolean }> = ({ cx, cy, rx, ry, start, end, tilt = -8, dur = 1.2, front = false }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, dur));
  const o = exitK(t, end, 0.4);
  const id = `op${start}${cx}${front ? 'f' : 'b'}`;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: front ? 8 : 1, opacity: o, overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor={COLORS.goldDeep} />
          <stop offset="0.5" stopColor={COLORS.champagne} />
          <stop offset="1" stopColor={COLORS.gold} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <rect x={0} y={front ? cy : 0} width={1080} height={front ? 1920 - cy : cy} transform={`rotate(${tilt} ${cx} ${cy})`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`} transform={`rotate(${tilt} ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={`url(#${id})`} strokeWidth={2.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
        <ellipse cx={cx} cy={cy} rx={rx + 26} ry={ry + 10} fill="none" stroke={COLORS.gold} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 10" />
      </g>
    </svg>
  );
};

/* ───────────────────────── line drawing ───────────────────────── */
/** Gold circle drawn on with a glowing comet head, plus a counter-rotating dotted halo. */
export const CircleDraw: React.FC<{ cx: number; cy: number; r: number; start: number; end: number; dur?: number; width?: number; halo?: boolean; from?: number; z?: number; color?: string }> = ({ cx, cy, r, start, end, dur = 1.3, width = 2.5, halo = true, from = -90, z = 1, color }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, dur));
  const o = exitK(t, end, 0.45);
  const ang = ((from + 360 * p) * Math.PI) / 180;
  const id = `cd${start}${cx}${r}`;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, opacity: o, overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={COLORS.champagne} />
          <stop offset="0.5" stopColor={color ?? COLORS.gold} />
          <stop offset="1" stopColor={COLORS.champagne} />
        </linearGradient>
        <radialGradient id={`${id}h`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.4" stopColor={COLORS.champagne} />
          <stop offset="1" stopColor={COLORS.champagne} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={width} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} transform={`rotate(${from} ${cx} ${cy})`} />
      {halo && <circle cx={cx} cy={cy} r={r + 22} fill="none" stroke={color ?? COLORS.gold} strokeOpacity={0.55 * p} strokeWidth={1.2} strokeDasharray="2 12" transform={`rotate(${-t * 12} ${cx} ${cy})`} />}
      {p > 0 && p < 1 && <circle cx={cx + r * Math.cos(ang)} cy={cy + r * Math.sin(ang)} r={22} fill={`url(#${id}h)`} />}
    </svg>
  );
};

/** Rounded-rect / arch outline traced around a product or label. */
export const OutlineDraw: React.FC<{ x: number; y: number; w: number; h: number; r?: number; arch?: boolean; start: number; end: number; dur?: number; width?: number; z?: number; double?: boolean }> = ({ x, y, w, h, r = 36, arch = false, start, end, dur = 1.1, width = 2.5, z = 3, double = true }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, dur));
  const o = exitK(t, end, 0.4);
  const path = (i: number) => {
    const X = x - i, Y = y - i, W = w + 2 * i, H = h + 2 * i;
    if (arch) {
      const R = W / 2;
      return `M ${X} ${Y + H} L ${X} ${Y + R} A ${R} ${R} 0 0 1 ${X + W} ${Y + R} L ${X + W} ${Y + H} Z`;
    }
    const rr = r + i;
    return `M ${X + rr} ${Y} H ${X + W - rr} A ${rr} ${rr} 0 0 1 ${X + W} ${Y + rr} V ${Y + H - rr} A ${rr} ${rr} 0 0 1 ${X + W - rr} ${Y + H} H ${X + rr} A ${rr} ${rr} 0 0 1 ${X} ${Y + H - rr} V ${Y + rr} A ${rr} ${rr} 0 0 1 ${X + rr} ${Y} Z`;
  };
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: z, opacity: o, overflow: 'visible', filter: `drop-shadow(0 0 8px ${rgba(COLORS.gold, 0.6)})` }}>
      <path d={path(0)} fill="none" stroke={COLORS.champagne} strokeWidth={width} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      {double && <path d={path(14)} fill="none" stroke={COLORS.gold} strokeOpacity={0.7} strokeWidth={1.2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={-(1 - p)} />}
    </svg>
  );
};

/* ───────────────────────── Khmer ornament ───────────────────────── */
/**
 * Khmer lotus divider: a stylised lotus bud (ផ្កាឈូក) with kbach-style curls, flanked by gold hairlines.
 * Strokes draw on from the centre outwards.
 */
export const Lotus: React.FC<{ y: number; start: number; end: number; width?: number; color?: string; x?: number; scale?: number }> = ({ y, start, end, width = 520, color = COLORS.gold, x = 540, scale = 1 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, 1.0));
  const o = exitK(t, end, 0.4);
  const half = width / 2;
  const line = (half - 70) * p;
  const st = { fill: 'none', stroke: color, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - p };
  return (
    <svg width={width} height={90} viewBox={`${-half} -45 ${width} 90`} style={{ position: 'absolute', left: x - half * scale, top: y - 45 * scale, width: width * scale, height: 90 * scale, opacity: o, overflow: 'visible' }}>
      {/* centre lotus */}
      <path {...st} d="M0 26 C-14 10 -14 -14 0 -34 C14 -14 14 10 0 26 Z" />
      <path {...st} d="M0 26 C-20 18 -34 4 -36 -16 C-22 -12 -8 -2 0 12" />
      <path {...st} d="M0 26 C20 18 34 4 36 -16 C22 -12 8 -2 0 12" />
      <path {...st} d="M-44 30 C-26 34 26 34 44 30" />
      {/* kbach curls */}
      <path {...st} d="M-50 8 C-62 -6 -78 2 -72 14 C-68 22 -58 18 -60 12" />
      <path {...st} d="M50 8 C62 -6 78 2 72 14 C68 22 58 18 60 12" />
      {/* hairlines + diamonds */}
      <line x1={-74} y1={10} x2={-74 - line} y2={10} stroke={color} strokeWidth={1.6} />
      <line x1={74} y1={10} x2={74 + line} y2={10} stroke={color} strokeWidth={1.6} />
      {p > 0.6 && (
        <>
          <rect x={-74 - line - 6} y={4} width={12} height={12} transform={`rotate(45 ${-74 - line} 10)`} fill={color} opacity={(p - 0.6) / 0.4} />
          <rect x={74 + line - 6} y={4} width={12} height={12} transform={`rotate(45 ${74 + line} 10)`} fill={color} opacity={(p - 0.6) / 0.4} />
        </>
      )}
    </svg>
  );
};

/* ───────────────────────── typography ───────────────────────── */
type Ink = 'gold' | 'ruby' | 'cream' | 'bronze';
const inkStyle = (ink: Ink, size: number): React.CSSProperties =>
  ink === 'cream'
    ? { color: COLORS.cream, textShadow: `0 ${Math.round(size * 0.04) + 1}px ${Math.round(size * 0.12)}px ${rgba(COLORS.espresso, 0.75)}` }
    : {
        backgroundImage: ink === 'gold' ? DEEP_GOLD : ink === 'ruby' ? RUBY_INK : BRONZE_INK,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        filter: ink === 'gold' ? `drop-shadow(0 ${Math.round(size * 0.04) + 1}px ${Math.round(size * 0.08)}px ${rgba(COLORS.espresso, 0.7)})` : undefined,
      };

/**
 * Khmer kinetic headline. Words are passed pre-split with "|" so each Khmer cluster stays intact
 * (splitting by letter would break subscript consonants). Each word rises out of its own mask,
 * de-blurs and settles; the line can optionally scale-in as a whole.
 */
export const KhWords: React.FC<{
  text: string;
  y: number;
  start: number;
  end: number;
  size?: number;
  family?: 'display' | 'khmer';
  weight?: number;
  ink?: Ink;
  stagger?: number;
  gap?: number;
  x?: number;
  align?: 'center' | 'left' | 'right';
  width?: number;
  from?: 'below' | 'above' | 'scale';
  z?: number;
}> = ({ text, y, start, end, size = 90, family = 'display', weight = 400, ink = 'gold', stagger = 0.12, gap, x = 0, align = 'center', width = 1080, from = 'below', z = 6 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const o = exitK(t, end, 0.4);
  const lift = -30 * (1 - o);
  const words = text.split('|');
  const lh = family === 'display' ? 1.75 : 1.55;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        zIndex: z,
        display: 'flex',
        justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
        flexWrap: 'nowrap',
        gap: gap ?? size * 0.28,
        opacity: o,
        transform: `translateY(${lift}px)`,
        filter: o < 1 ? `blur(${(1 - o) * 10}px)` : undefined,
      }}
    >
      {words.map((wd, i) => {
        const p = prog(t, start + i * stagger, 0.75);
        const e = backOut(p, 1.1);
        const ty = from === 'below' ? 105 * (1 - e) : from === 'above' ? -105 * (1 - e) : 0;
        const sc = from === 'scale' ? 0.4 + 0.6 * e : 1;
        return (
          <span key={i} style={{ display: 'inline-block', overflow: from === 'scale' ? 'visible' : 'hidden', padding: `${size * 0.1}px ${size * 0.06}px`, margin: `${-size * 0.1}px ${-size * 0.06}px` }}>
            <span
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                fontFamily: LF[family],
                fontWeight: weight,
                fontSize: size,
                lineHeight: lh,
                transform: `translateY(${ty}%) scale(${sc})`,
                opacity: Math.min(1, p * 1.8),
                filter: p < 1 ? `blur(${(1 - cubicOut(p)) * 12}px)` : undefined,
                ...inkStyle(ink, size),
              }}
            >
              {wd}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** English accent line: letters fade in on a stagger while tracking collapses from wide to final. */
export const EnTrack: React.FC<{ text: string; y: number; start: number; end: number; size?: number; family?: 'lux' | 'micro' | 'serif'; weight?: number; tracking?: number; ink?: Ink; italic?: boolean; stagger?: number; z?: number }> = ({
  text, y, start, end, size = 34, family = 'lux', weight = 400, tracking = 8, ink = 'cream', italic = false, stagger = 0.022, z = 6,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const o = exitK(t, end, 0.4);
  const p = expoOut(prog(t, start, 1.4));
  const tr = tracking + 26 * (1 - p);
  return (
    <div style={{ position: 'absolute', left: 0, width: 1080, top: y, zIndex: z, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${-20 * (1 - o)}px)` }}>
      <div style={{ display: 'flex', whiteSpace: 'pre', paddingLeft: tr }}>
        {text.split('').map((ch, i) => {
          const q = cubicOut(prog(t, start + i * stagger, 0.5));
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                fontFamily: LF[family],
                fontWeight: weight,
                fontStyle: italic ? 'italic' : 'normal',
                fontSize: size,
                letterSpacing: tr,
                lineHeight: 1.3,
                opacity: q,
                transform: `translateY(${14 * (1 - q)}px)`,
                filter: q < 1 ? `blur(${(1 - q) * 6}px)` : undefined,
                ...inkStyle(ink, size),
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ───────────────────────── cards, chips, labels ───────────────────────── */
/**
 * Temple-arch ingredient card (the arch echoes Angkorian window frames): cream satin face,
 * gold double outline, floating ingredient that pops slightly out of the frame.
 */
export const ArchCard: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; src: string; imgW: number; imgY?: number; kh: string; en: string; num: string; phase?: number; tiltIn?: number }> = ({
  x, y, w, h, start, end, src, imgW, imgY = 0.38, kh, en, num, phase = 0, tiltIn = 0,
}) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 0.95);
  const e = backOut(p, 1.25);
  const o = Math.min(1, p * 2.5) * exitK(t, end, 0.4);
  const life = t - start;
  const fl = 10 * Math.sin(life * 1.4 + phase);
  const ip = backOut(prog(t, start + 0.18, 0.9), 1.6);
  const tp = cubicOut(prog(t, start + 0.4, 0.6));
  const R = w / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        opacity: o,
        transform: `translateY(${260 * (1 - e) + fl}px) perspective(1400px) rotateX(${22 * (1 - cubicOut(p))}deg) rotateZ(${tiltIn * (1 - e) + 1.2 * Math.sin(life * 0.8 + phase)}deg) scale(${0.8 + 0.2 * e})`,
        filter: p < 1 ? `blur(${14 * (1 - cubicOut(p))}px)` : undefined,
        zIndex: 4,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: `${R}px ${R}px 26px 26px`,
          background: `radial-gradient(ellipse 80% 55% at 50% 38%, #FFF9EC 0%, ${COLORS.cream} 50%, #EBCF9A 100%)`,
          boxShadow: `0 40px 60px ${rgba(COLORS.espresso, 0.55)}, inset 0 0 0 3px ${COLORS.gold}, inset 0 0 0 11px ${COLORS.cream}, inset 0 0 0 12.5px ${rgba(COLORS.gold, 0.7)}`,
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center', fontFamily: LF.lux, fontSize: 30, color: COLORS.goldDeep, letterSpacing: 4, opacity: tp }}>{num}</div>
      <Img
        src={src}
        style={{
          position: 'absolute',
          left: (w - imgW) / 2,
          top: h * imgY - imgW * 0.35,
          width: imgW,
          transform: `translateY(${80 * (1 - ip) + 6 * Math.sin(life * 1.9 + phase)}px) scale(${0.6 + 0.4 * ip}) rotate(${3 * Math.sin(life * 1.1 + phase)}deg)`,
          opacity: Math.min(1, ip * 2),
          filter: 'drop-shadow(0 22px 22px rgba(59,16,22,0.45))',
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 96, textAlign: 'center', opacity: tp, transform: `translateY(${16 * (1 - tp)}px)` }}>
        <span style={{ fontFamily: LF.khmer, fontWeight: 700, fontSize: 36, lineHeight: 1.5, ...inkStyle('ruby', 36) }}>{kh}</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, textAlign: 'center', fontFamily: LF.micro, fontWeight: 500, fontSize: 15, letterSpacing: 4, color: COLORS.goldDeep, opacity: tp }}>{en}</div>
    </div>
  );
};

/** Benefit chip: icon medallion + Khmer claim on a glass pill, slides in with directional blur. */
export const Chip: React.FC<{ x: number; y: number; w: number; start: number; end: number; icon: React.ReactNode; text: string }> = ({ x, y, w, start, end, icon, text }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 0.6);
  const e = backOut(p, 1.1);
  const o = Math.min(1, p * 2.5) * exitK(t, end, 0.35);
  const ring = cubicOut(prog(t, start + 0.1, 0.7));
  const C = 2 * Math.PI * 44;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: 112, opacity: o, transform: `translateX(${340 * (1 - e)}px)`, zIndex: 5 }}>
      <DirBlur x={40 * Math.pow(1 - p, 2)}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: w,
            height: 112,
            borderRadius: 56,
            background: `linear-gradient(90deg, ${rgba(COLORS.espresso, 0.62)} 0%, ${rgba(COLORS.burgundy, 0.4)} 100%)`,
            boxShadow: `inset 0 0 0 1.5px ${rgba(COLORS.gold, 0.55)}, 0 18px 30px ${rgba(COLORS.espresso, 0.4)}`,
          }}
        />
        <svg width={112} height={112} style={{ position: 'absolute', left: 0, top: 0 }}>
          <circle cx={56} cy={56} r={44} fill={rgba(COLORS.ruby, 0.85)} />
          <circle cx={56} cy={56} r={44} fill="none" stroke={COLORS.gold} strokeWidth={2.5} strokeDasharray={C} strokeDashoffset={C * (1 - ring)} transform="rotate(-90 56 56)" />
          <g transform="translate(30 30) scale(0.8125)">{icon}</g>
        </svg>
        <div style={{ position: 'absolute', left: 132, top: 0, height: 112, display: 'flex', alignItems: 'center', fontFamily: LF.khmer, fontWeight: 600, fontSize: 31, lineHeight: 1.35, color: COLORS.cream, whiteSpace: 'nowrap' }}>{text}</div>
      </DirBlur>
    </div>
  );
};

/** Feature callout: dot on the product, leader line draws out, label slides along. */
export const Callout: React.FC<{ x: number; y: number; tx: number; ty: number; start: number; end: number; kh: string; en: string; side?: 'left' | 'right' }> = ({ x, y, tx, ty, start, end, kh, en, side = 'right' }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = cubicInOut(prog(t, start, 0.7));
  const lp = cubicOut(prog(t, start + 0.5, 0.6));
  const o = exitK(t, end, 0.35);
  const ex = x + (tx - x) * p;
  const ey = y + (ty - y) * p;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, zIndex: 9 }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={x} cy={y} r={9 + 18 * (1 - p)} fill="none" stroke={COLORS.champagne} strokeWidth={2} opacity={p} />
        <circle cx={x} cy={y} r={6} fill={COLORS.champagne} />
        <polyline points={`${x},${y} ${ex},${ey}`} fill="none" stroke={COLORS.champagne} strokeWidth={2} />
        {p >= 1 && <line x1={tx} y1={ty} x2={tx + (side === 'right' ? 1 : -1) * 260 * lp} y2={ty} stroke={COLORS.gold} strokeWidth={2} />}
      </svg>
      <div style={{ position: 'absolute', top: ty - 64, left: side === 'right' ? tx + 8 : tx - 268, width: 260, textAlign: side === 'right' ? 'left' : 'right', opacity: lp, transform: `translateX(${(side === 'right' ? -20 : 20) * (1 - lp)}px)` }}>
        <div style={{ fontFamily: LF.khmer, fontWeight: 700, fontSize: 34, lineHeight: 1.45, color: COLORS.cream, textShadow: `0 3px 10px ${rgba(COLORS.espresso, 0.8)}` }}>{kh}</div>
      </div>
      <div style={{ position: 'absolute', top: ty + 10, left: side === 'right' ? tx + 8 : tx - 268, width: 260, textAlign: side === 'right' ? 'left' : 'right', opacity: lp, fontFamily: LF.micro, fontWeight: 500, fontSize: 16, letterSpacing: 4, color: COLORS.champagne }}>{en}</div>
    </div>
  );
};

/** Gold pill CTA with breathing glow and a periodic sheen. */
export const Cta: React.FC<{ text: string; y: number; start: number; end: number; w?: number; h?: number }> = ({ text, y, start, end, w = 600, h = 100 }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = prog(t, start, 0.7);
  const e = backOut(p, 1.6);
  const sheen = ((t - start - 0.6) % 1.8) / 0.9;
  return (
    <div style={{ position: 'absolute', left: (1080 - w) / 2, top: y, width: w, height: h, opacity: Math.min(1, p * 2) * exitK(t, end, 0.3), transform: `scale(${(0.6 + 0.4 * e) * (1 + 0.015 * Math.sin(t * 5))})`, zIndex: 10 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: h / 2, background: GOLD_GRADIENT, overflow: 'hidden', boxShadow: `0 0 ${36 + 16 * Math.sin(t * 5)}px ${rgba(COLORS.gold, 0.6)}, inset 0 2px 0 rgba(255,255,255,0.55)` }}>
        {sheen > 0 && sheen < 1 && <div style={{ position: 'absolute', top: 0, bottom: 0, width: 100, left: -140 + sheen * (w + 280), transform: 'skewX(-22deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }} />}
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LF.khmer, fontWeight: 700, fontSize: 40, color: COLORS.burgundy, lineHeight: 1.4 }}>{text}</div>
    </div>
  );
};

/* ───────────────────────── coffee pour ───────────────────────── */
/** Caramel coffee ribbon falling into the cup, with a splash ring on the surface. */
export const Pour: React.FC<{ x: number; surfaceY: number; start: number; dur?: number }> = ({ x, surfaceY, start, dur = 1.6 }) => {
  const t = useTime();
  const life = t - start;
  if (life < 0 || life > dur + 0.9) return null;
  const head = Math.min(surfaceY, -40 + (surfaceY + 40) * cubicIn(prog(life, 0, 0.45)) * 1);
  const tail = life > dur ? -40 + (surfaceY + 40) * cubicIn(prog(life, dur, 0.5)) : -40;
  const wob = (yy: number) => 5 * Math.sin(yy * 0.025 + life * 14);
  const pts: string[] = [];
  const segs = 24;
  for (let i = 0; i <= segs; i++) {
    const yy = tail + ((head - tail) * i) / segs;
    const wd = 11 + 5 * (1 - i / segs);
    pts.push(`${x + wob(yy) - wd},${yy}`);
  }
  for (let i = segs; i >= 0; i--) {
    const yy = tail + ((head - tail) * i) / segs;
    const wd = 11 + 5 * (1 - i / segs);
    pts.push(`${x + wob(yy) + wd},${yy}`);
  }
  const hit = life > 0.45 && life < dur + 0.5;
  const ripple = ((life - 0.45) % 0.5) / 0.5;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: 6 }}>
      <defs>
        <linearGradient id="pourG" x1="0" x2="1">
          <stop offset="0" stopColor="#5A2A12" />
          <stop offset="0.35" stopColor="#B86B2E" />
          <stop offset="0.5" stopColor="#F2C28A" />
          <stop offset="0.65" stopColor="#B86B2E" />
          <stop offset="1" stopColor="#4A200E" />
        </linearGradient>
      </defs>
      {head > tail + 2 && <polygon points={pts.join(' ')} fill="url(#pourG)" opacity={0.96} />}
      {hit && (
        <>
          <ellipse cx={x} cy={surfaceY} rx={30 + 120 * ripple} ry={8 + 26 * ripple} fill="none" stroke="#F6D7A8" strokeWidth={3} opacity={(1 - ripple) * 0.8} />
          <ellipse cx={x} cy={surfaceY} rx={26} ry={9} fill="#E9B27A" opacity={0.85} />
        </>
      )}
    </svg>
  );
};
