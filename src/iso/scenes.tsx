/**
 * GOLEX — The Golden Ginger World · 3D Isometric Storytelling Edition · scene choreography.
 * Khmer copy follows docs/khmer-text/GolexSoftLux.md scene by scene. Times are scene-local; B(k) = k beats.
 */
import React from 'react';
import { Img } from 'remotion';
import { useTime } from '../lib/useTime';
import { Cta, Orbit, OrbitPath, PACK_MASK, Pour, img, spr } from '../lux/kit';
import { Steam } from '../promo/parts';
import { Frame, Label, Product, Underline, Words } from '../soft/kit';
import { SF } from '../soft/theme';
import { Cafe, Card3D, Counter, GOLD_PLATFORM, IC, IICONS, Island, IsoIcon, Pastel, RUBY_PLATFORM, Ribbon, backOut, bez, cubicInOut, cubicOut, exitK, expoOut, prog, rgba } from './kit';
import { B, I_SCENES } from './timeline';

export type SceneProps = { L: number; t0: number; idx: number };
const bgOf = (idx: number) => ({ bg: I_SCENES[idx].bg, prev: idx > 0 ? I_SCENES[idx - 1].bg : undefined });

/* 01 · OPENING — the Golden Ginger World: a floating island with a miniature GOLEX café ─────────────── */
export const OpenScene: React.FC<SceneProps> = ({ L, t0, idx }) => {
  const t = useTime();
  const E = L + 1;
  const build = backOut(prog(t, 0.45, 0.7), 1.4);
  const arc = cubicOut(prog(t, 1.89, 1.0));
  return (
    <>
      <Pastel t0={t0} {...bgOf(idx)} />
      <Ribbon d="M -150 1560 C 250 1300, 700 1760, 1230 1380" start={0.3} dur={1.3} width={46} hold end={E} z={1} opacity={0.85} />
      <Island x={540} y={1180} W={620} start={0.1} end={E} z={3}>
        <Cafe cx={310} cy={190} s={118} build={Math.max(0.01, build)} />
        <Img src={img('pack.png')} style={{ position: 'absolute', left: 95, top: 150, width: 110, opacity: cubicOut(prog(t, 0.9, 0.5)), transform: `translateY(${30 * (1 - cubicOut(prog(t, 0.9, 0.5)))}px)`, filter: `drop-shadow(0 8px 8px ${rgba(IC.burgundy, 0.3)})` }} />
        <Img src={img('cup.png')} style={{ position: 'absolute', left: 405, top: 205, width: 130, opacity: cubicOut(prog(t, 1.05, 0.5)), transform: `translateY(${30 * (1 - cubicOut(prog(t, 1.05, 0.5)))}px)`, filter: `drop-shadow(0 8px 8px ${rgba(IC.burgundy, 0.3)})` }} />
        <Img src={spr('slice.png')} style={{ position: 'absolute', left: 225, top: 255, width: 60, opacity: cubicOut(prog(t, 1.2, 0.4)), transform: `rotate(${-20 + 10 * Math.sin(t * 2)}deg)` }} />
      </Island>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: 4, overflow: 'visible', opacity: arc * exitK(t, E, 0.3) }}>
        <defs><path id="openArc" d="M 140 1130 A 420 420 0 0 1 940 1130" /></defs>
        <text fontFamily="Manrope, sans-serif" fontWeight={600} fontSize={24} letterSpacing={8} fill={IC.ruby}>
          <textPath href="#openArc" startOffset={`${50 - 18 * (1 - arc)}%`} textAnchor="middle">THE GOLDEN GINGER EXPERIENCE</textPath>
        </text>
      </svg>
      <Words text="បទពិសោធន៍ថ្មី" y={250} start={0.74} end={E} size={92} tone="espresso" />
      <Words text="កាហ្វេខ្ញី 5IN1" y={400} start={1.31} end={E} size={140} weight={900} tone="gold" mode="scale" depth />
    </>
  );
};

/* 02 · PRODUCT INTRODUCTION — the package floats down onto a ruby pedestal; a 3D card counts up ─────── */
export const SplitScene: React.FC<SceneProps> = ({ L, t0, idx }) => {
  const E = L + 1;
  return (
    <>
      <Pastel t0={t0} {...bgOf(idx)} />
      <Island x={790} y={1290} W={440} start={0.05} end={E} faces={RUBY_PLATFORM} z={3} />
      <Product src={img('pack.png')} mask={PACK_MASK} x={790} y={1000} w={460} start={0.2} end={E} dur={1.1} dy={-260} s0={0.85} rotY0={-35} sway={6} sheen={[1.4]} shadow="none" bob={9} z={5} />
      <Label text="DISCOVER" x={70} width={500} align="left" y={430} start={0.2} end={E} />
      <Words text="ស្វែងរក" x={70} width={520} align="left" y={480} start={B(1)} end={E} size={82} mode="slide" />
      <Words text="ពេលវេលា" x={70} width={520} align="left" y={610} start={B(2)} end={E} size={82} mode="slide" />
      <Words text="ដ៏ពិសេស" x={70} width={520} align="left" y={740} start={B(3)} end={E} size={82} tone="ruby" mode="slide" />
      <Underline x={74} y={912} w={300} start={B(3.5)} end={E} from="left" dur={0.7} />
      <Words text="Discover|a|world|of|richness." x={70} width={520} align="left" y={935} start={B(3.5) + 0.1} end={E} font="serif" size={40} weight={500} italic tone="burgundy" stagger={0.08} gap={9} />
      <Card3D x={60} y={1180} w={450} h={240} start={B(3.5)} end={E} from="left">
        <div style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: SF.sans, fontWeight: 600, fontSize: 15, letterSpacing: 5, color: IC.gold }}>NET WEIGHT 475 g</span>
          <span style={{ fontFamily: SF.khSans, fontWeight: 700, fontSize: 38, color: IC.ruby, lineHeight: 1.5 }}>
            <Counter to={25} start={B(3.7)} dur={0.9} /> កញ្ចប់ × ១៩ក្រាម
          </span>
          <span style={{ fontFamily: SF.khSans, fontWeight: 400, fontSize: 28, color: IC.burgundy, lineHeight: 1.5 }}>ទម្ងន់សុទ្ធ ៤៧៥ក្រាម</span>
        </div>
      </Card3D>
    </>
  );
};

/* 03 · SACHET → PACKAGE — the sachet grows and transforms into the package; "5 IN 1" builds in 3D ────── */
const Extruded: React.FC<{ text: string; size: number; p: number; style?: React.CSSProperties }> = ({ text, size, p, style }) => {
  const layers = Array.from({ length: 10 }, (_, i) => `${i + 1}px ${i + 1}px 0 ${i < 9 ? IC.ruby : IC.burgundy}`).join(', ');
  return (
    <span style={{ display: 'inline-block', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, fontSize: size, lineHeight: 1, color: IC.softGold, textShadow: `${layers}, 14px 22px 26px ${rgba(IC.burgundy, 0.3)}`, opacity: Math.min(1, p * 2), ...style }}>
      {text}
    </span>
  );
};
export const MacroScene: React.FC<SceneProps> = ({ L, t0, idx }) => {
  const t = useTime();
  const E = L + 1;
  const sIn = backOut(prog(t, 0.05, 0.8), 1.2);
  const tr = cubicInOut(prog(t, B(2), 0.8)); // the transformation
  const five = backOut(prog(t, B(3), 0.7), 1.6);
  const in1 = expoOut(prog(t, B(3.5), 0.8));
  const life = t;
  const o = exitK(t, E, 0.3);
  const R = 30 + 700 * tr;
  return (
    <>
      <Pastel t0={t0} {...bgOf(idx)} />
      <Island x={540} y={1210} W={540} start={B(2)} end={E} faces={GOLD_PLATFORM} z={2} />
      {/* sachet: floats in, then grows and dissolves into the package */}
      <div style={{ position: 'absolute', left: 540 - 130, top: 900 - 385, width: 260, zIndex: 4, opacity: Math.min(1, sIn * 2) * (1 - tr) * o, transform: `translateY(${180 * (1 - sIn) + 8 * Math.sin(life * 1.5)}px) rotate(${-6 * (1 - sIn) + 3 * Math.sin(life)}deg) scale(${1 + 0.9 * tr})`, filter: `blur(${tr * 10}px) drop-shadow(0 24px 24px ${rgba(IC.burgundy, 0.3)})` }}>
        <Img src={img('sachet.png')} style={{ width: '100%', display: 'block' }} />
      </div>
      {/* package: revealed by an expanding rounded mask from the sachet's centre */}
      {tr > 0 && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, opacity: o, clipPath: `circle(${R}px at 540px 900px)`, WebkitClipPath: `circle(${R}px at 540px 900px)` }}>
          <div style={{ position: 'absolute', left: 540 - 280, top: 900 - 291, width: 560, transform: `scale(${0.6 + 0.4 * tr}) translateY(${8 * Math.sin(life * 1.5)}px) perspective(1600px) rotateY(${-25 * (1 - tr) + 4 * Math.sin(life * 0.9)}deg)`, filter: `drop-shadow(0 30px 30px ${rgba(IC.burgundy, 0.3)})` }}>
            <Img src={img('pack.png')} style={{ width: '100%', display: 'block', WebkitMaskImage: PACK_MASK, maskImage: PACK_MASK }} />
          </div>
        </div>
      )}
      {/* 5 IN 1 — dimensional typography */}
      <div style={{ position: 'absolute', left: 0, width: 1080, top: 230, zIndex: 6, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 26, opacity: o }}>
        {five > 0 && <Extruded text="5" size={300} p={five} style={{ transform: `scale(${0.3 + 0.7 * five}) rotate(${-12 * (1 - five)}deg) translateY(${10 * Math.sin(life * 1.3)}px)` }} />}
        {in1 > 0 && <Extruded text="IN 1" size={130} p={in1} style={{ transform: `translateX(${160 * (1 - in1)}px)`, marginBottom: 34, filter: in1 < 1 ? `blur(${(1 - in1) * 8}px)` : undefined }} />}
      </div>
      <Words text="កាហ្វេខ្ញី|៥ ក្នុង ១" y={1320} start={B(2.5)} end={E} size={84} tone="ruby" stagger={0.2} gap={24} />
      <Words text="ខាប់ និងឈ្ងុយឆ្ងាញ់|·|កក់ក្តៅ និងផ្តល់ថាមពល" y={1480} start={B(4)} end={E} font="khSans" size={32} weight={600} tone="espresso" stagger={0.12} gap={14} />
      <Label text="5 IN 1. ONE DELIGHTFUL EXPERIENCE." y={1585} start={B(4.5)} end={E} size={18} tracking={5} tone="gold" />
    </>
  );
};

/* 04 · COFFEE EXPERIENCE — the cup turns in on a floating island; ginger, beans and sugar orbit it ──────── */
export const CupScene: React.FC<SceneProps> = ({ L, t0, idx }) => {
  const E = L + 1;
  return (
    <>
      <Pastel t0={t0} {...bgOf(idx)} />
      <Island x={540} y={1250} W={700} start={0} end={E} z={2} />
      <OrbitPath cx={540} cy={1060} rx={440} ry={130} start={0.4} end={E} tilt={-6} />
      <Orbit cx={540} cy={1060} rx={440} ry={130} start={0.55} end={E} speed={36} tilt={-6} grow={1.1} bodies={[
        { src: spr('slice.png'), w: 120, a0: 0, spin: 20 },
        { src: spr('bean2.png'), w: 100, a0: 72 },
        { src: img('palm1.png'), w: 140, a0: 144, spin: 0 },
        { src: spr('bean5.png'), w: 90, a0: 216 },
        { src: img('ginger1.png'), w: 150, a0: 288, spin: 8 },
      ]} />
      <Product src={img('cup.png')} x={540} y={1010} w={760} start={0.1} end={E} dur={1.1} dy={-200} s0={0.8} rotY0={-50} sway={5} sheen={[1.5]} shadow="none" bob={7} z={5} />
      <Pour x={558} surfaceY={964} start={0.4} dur={0.9} />
      <Steam cx={558} baseY={880} start={1.3} end={E} height={380} count={6} />
      <OrbitPath cx={540} cy={1060} rx={440} ry={130} start={0.4} end={E} tilt={-6} front />
      <Words text="ឈ្ងុយឆ្ងាញ់" y={170} start={B(1)} end={E} size={120} weight={900} tone="gold" mode="scale" depth />
      <Underline x={340} y={1540} w={400} start={B(3)} end={E} dur={0.7} />
      <Words text="Richness|in|every|sip." y={1560} start={B(3) + 0.1} end={E} font="serif" size={56} weight={500} italic tone="burgundy" stagger={0.1} gap={14} />
    </>
  );
};

/* 05 · COFFEE-BEAN PATHWAY — beans flow along a curved path into a close-up of the crema ───────────────── */
const P0: [number, number] = [-80, 1800];
const P1: [number, number] = [420, 1720];
const P2: [number, number] = [60, 1060];
const P3: [number, number] = [600, 820];
export const TextureScene: React.FC<SceneProps> = ({ L, t0, idx }) => {
  const t = useTime();
  const E = L + 1;
  const open = expoOut(prog(t, 0.1, 0.8));
  const R = 330 * open;
  const draw = cubicInOut(prog(t, 0.05, 0.9));
  const o = exitK(t, E, 0.3);
  const beans = ['bean1.png', 'bean2.png', 'bean5.png', 'bean8.png', 'bean3.png', 'bean6.png'];
  return (
    <>
      <Pastel t0={t0} {...bgOf(idx)} />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: o, overflow: 'visible' }}>
        <path d={`M ${P0} C ${P1} ${P2} ${P3}`} fill="none" stroke={IC.champagne} strokeWidth={70} strokeLinecap="round" opacity={0.28} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
        <path d={`M ${P0} C ${P1} ${P2} ${P3}`} fill="none" stroke={IC.gold} strokeWidth={3} strokeDasharray="4 16" opacity={0.9 * draw} />
      </svg>
      {Array.from({ length: 14 }, (_, i) => {
        const k = (((t * 0.32 + i / 14) % 1) + 1) % 1;
        const vis = Math.min(1, (t - i * 0.04) * 3) * draw;
        if (k > draw || vis <= 0) return null;
        const [x, y] = bez(P0, P1, P2, P3, k);
        const sc = 1 - 0.55 * k;
        return <Img key={i} src={spr(beans[i % beans.length])} style={{ position: 'absolute', left: x - 45, top: y - 35, width: 90, zIndex: 3, opacity: vis * o * (k > 0.88 ? (1 - k) / 0.12 : 1), transform: `scale(${sc}) rotate(${k * 400 + i * 40}deg)`, filter: `drop-shadow(0 8px 6px ${rgba(IC.burgundy, 0.3)})` }} />;
      })}
      <Label text="ក្លិនក្រអូប  ·  ខាប់  ·  ឆ្ងាញ់" y={215} start={B(0.5)} end={E} font="khSans" size={30} />
      <div style={{ position: 'absolute', left: 600 - R - 22, top: 820 - R - 22, width: (R + 22) * 2, height: (R + 22) * 2, borderRadius: '50%', zIndex: 4, opacity: o, background: `linear-gradient(135deg, ${IC.softGold}, ${IC.gold})`, boxShadow: `0 30px 50px ${rgba(IC.burgundy, 0.25)}` }} />
      <div style={{ position: 'absolute', left: 600 - R, top: 820 - R, width: R * 2, height: R * 2, borderRadius: '50%', overflow: 'hidden', zIndex: 5, opacity: o }}>
        <div style={{ position: 'absolute', left: R - 400, top: R - 400, width: 800, height: 800, transform: `scale(${1 + 0.06 * (t / L)}) rotate(${t * 3}deg)` }}>
          <div style={{ position: 'absolute', inset: 0, background: IC.ruby }} />
          <Img src={img('cup.png')} style={{ position: 'absolute', width: 3520, left: 400 - 575 * 3.2, top: 400 - 312 * 3.2 }} />
        </div>
      </div>
      <Words text="ខ្ញីស្រស់|·|កាហ្វេល្អ" y={1290} start={B(1.5)} end={E} size={84} tone="espresso" stagger={0.2} gap={20} z={7} />
      <Underline x={340} y={1445} w={400} start={B(1.9)} end={E} dur={0.5} />
      <Words text="Ginger|infused.|Coffee|inspired." y={1465} start={B(1.9) + 0.05} end={E} font="serif" size={50} weight={500} italic tone="ruby" stagger={0.06} gap={14} z={7} />
    </>
  );
};

/* 06 · INGREDIENT WORLD — three miniature islands linked by a golden path, each with a 3D info card ────── */
const ING = [
  { n: '01', kh: 'ខ្ញីបេនតុង', en: 'BENTONG GINGER', d: 'កក់ក្តៅ និងផ្តល់ថាមពល', src: img('ginger2.png'), iw: 250, x: 300, y: 700, side: 'right' as const },
  { n: '02', kh: 'គ្រាប់កាហ្វេ', en: 'COFFEE BEANS', d: 'ឈ្ងុយ និងខាប់', src: img('beans2.png'), iw: 240, x: 780, y: 1060, side: 'left' as const },
  { n: '03', kh: 'ស្ករត្នោត', en: 'BROWN SUGAR', d: 'ផ្អែមឈ្ងុយ', src: img('palm1.png'), iw: 230, x: 300, y: 1420, side: 'right' as const },
];
export const IngredientsScene: React.FC<SceneProps> = ({ L, t0, idx }) => {
  const t = useTime();
  const E = L + 1;
  const path = cubicInOut(prog(t, B(2), 1.6));
  const starts = [B(2), B(3), B(4)];
  return (
    <>
      <Pastel t0={t0} {...bgOf(idx)} />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'visible', opacity: exitK(t, E, 0.3) }}>
        <path d="M 300 820 C 560 860, 860 900, 780 1180 S 300 1300, 300 1540" fill="none" stroke={IC.gold} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - path} />
      </svg>
      <Label text="INGREDIENTS" y={150} start={0.15} end={E} />
      <Words text="ផលិតពីខ្ញីបេនតុង" y={190} start={B(0.5)} end={E} size={70} tone="espresso" />
      <Words text="គុណភាពខ្ពស់" y={305} start={B(1.5)} end={E} size={70} tone="ruby" />
      {ING.map((it, i) => (
        <React.Fragment key={it.n}>
          <Island x={it.x} y={it.y} W={400} start={starts[i]} end={E} phase={i * 1.4} z={3}>
            <Img src={it.src} style={{ position: 'absolute', left: 200 - it.iw / 2, top: 120 - it.iw * 0.45, width: it.iw, transform: `translateY(${-6 * Math.sin(t * 2 + i)}px)`, filter: `drop-shadow(0 12px 10px ${rgba(IC.burgundy, 0.3)})` }} />
          </Island>
          <Card3D x={it.side === 'right' ? 540 : 60} y={it.y - 110} w={470} h={210} start={starts[i] + 0.35} end={E} from={it.side === 'right' ? 'right' : 'left'} phase={i}>
            <div style={{ position: 'absolute', left: 30, top: 20, fontFamily: SF.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 32, color: IC.gold, lineHeight: 1 }}>{it.n}</div>
            <div style={{ position: 'absolute', left: 30, top: 50, fontFamily: SF.khSerif, fontWeight: 700, fontSize: 50, color: IC.ruby, lineHeight: 1.5 }}>{it.kh}</div>
            <div style={{ position: 'absolute', left: 32, top: 128, fontFamily: SF.sans, fontWeight: 600, fontSize: 15, letterSpacing: 4, color: IC.gold }}>{it.en}</div>
            <div style={{ position: 'absolute', left: 30, top: 150, fontFamily: SF.khSans, fontWeight: 400, fontSize: 26, color: IC.burgundy, lineHeight: 1.5 }}>{it.d}</div>
          </Card3D>
        </React.Fragment>
      ))}
      <Label text="ខ្ញី · កាហ្វេ · ស្ករត្នោត" y={1730} start={B(6.5)} end={E} font="khSans" size={30} />
    </>
  );
};

/* 07 · LIFESTYLE — the model in a tall arch, a floating cup island and ingredients drifting in parallax ──── */
export const Model1Scene: React.FC<SceneProps> = ({ L, t0, idx }) => {
  const t = useTime();
  const E = L + 1;
  const push = 1 + 0.05 * cubicOut(t / L);
  return (
    <>
      <Pastel t0={t0} {...bgOf(idx)} />
      <Frame x={340} y={640} w={680} h={1190} r={340} start={0.1} end={E} bg={`radial-gradient(ellipse 80% 60% at 50% 35%, ${IC.crimson} 0%, ${IC.ruby} 55%, ${IC.burgundy} 100%)`}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '340px 420px' }}>
          <Img src={img('model1.png')} style={{ position: 'absolute', width: 1080, left: -255, top: 150 }} />
        </div>
      </Frame>
      <Island x={190} y={1560} W={300} start={B(1)} end={E} faces={RUBY_PLATFORM} z={6}>
        <Img src={img('cup.png')} style={{ position: 'absolute', left: 60, top: 18, width: 180, filter: `drop-shadow(0 8px 8px ${rgba(IC.burgundy, 0.3)})` }} />
      </Island>
      <Product src={spr('slice.png')} x={990} y={720} w={110} start={B(1.5)} end={E} dx={80} dy={0} r0={40} shadow="drop" bob={12} phase={1} z={7} />
      <Product src={spr('bean2.png')} x={300} y={1180} w={90} start={B(2)} end={E} dx={-80} dy={0} r0={-40} shadow="drop" bob={10} phase={2} z={7} />
      <Label text="YOUR MOMENT" x={70} width={600} align="left" y={175} start={0.2} end={E} />
      <Words text="ពេលវេលា" x={70} width={960} align="left" y={215} start={B(0.5)} end={E} size={100} mode="slide" />
      <Words text="ដ៏កក់ក្តៅ" x={70} width={960} align="left" y={375} start={B(1.5)} end={E} size={100} tone="ruby" mode="slide" />
      <Words text="Your|daily|moment|of|warmth." x={70} width={960} align="left" y={520} start={B(1.8)} end={E} font="serif" size={42} weight={500} italic tone="burgundy" stagger={0.05} gap={10} />
      <Words text="ប្រចាំថ្ងៃរបស់អ្នក" x={70} width={960} align="left" y={580} start={B(2.2)} end={E} font="khSans" size={32} weight={600} tone="espresso" />
    </>
  );
};

/* 08 · HIGHLIGHTS — model 2 over a ruby disc; info cards flip in with isometric feature icons ──────────── */
const FEATURES: [string, string, string][] = [
  ['drop', 'គ្មានជាតិខ្លាញ់', 'TRANS FAT-FREE'],
  ['flask', 'គ្មានសារធាតុបន្ថែម', 'NO ADDED ARTIFICIAL FLAVOURING'],
];
const FeatureCard: React.FC<{ i: number; start: number; end: number }> = ({ i, start, end }) => {
  const t = useTime();
  const [icon, kh, en] = FEATURES[i];
  const draw = cubicInOut(prog(t, start + 0.25, 0.8));
  return (
    <Card3D x={50} y={700 + i * 210} w={530} h={170} start={start} end={end} from="left" phase={i}>
      <div style={{ position: 'absolute', left: 14, top: 14 }}><IsoIcon size={130} draw={draw} icon={IICONS[icon]} /></div>
      <div style={{ position: 'absolute', left: 160, top: 36, fontFamily: SF.khSans, fontWeight: 700, fontSize: 32, color: IC.ruby, lineHeight: 1.45, whiteSpace: 'nowrap' }}>{kh}</div>
      <div style={{ position: 'absolute', left: 162, top: 96, fontFamily: SF.sans, fontWeight: 600, fontSize: 14, letterSpacing: 2, color: IC.gold, whiteSpace: 'nowrap' }}>{en}</div>
    </Card3D>
  );
};
export const HighlightsScene: React.FC<SceneProps> = ({ L, t0, idx }) => {
  const t = useTime();
  const E = L + 1;
  const d = expoOut(prog(t, 0.05, 0.9));
  return (
    <>
      <Pastel t0={t0} {...bgOf(idx)} />
      <div style={{ position: 'absolute', left: 760 - 440 * d, top: 1120 - 440 * d, width: 880 * d, height: 880 * d, borderRadius: '50%', zIndex: 1, background: `radial-gradient(circle at 42% 38%, ${IC.crimson} 0%, ${IC.ruby} 55%, ${IC.burgundy} 100%)`, boxShadow: `0 30px 60px ${rgba(IC.burgundy, 0.25)}, inset 0 0 0 6px ${rgba(IC.softGold, 0.6)}` }} />
      <Product src={img('model2.png')} x={770} y={1300} w={1150} start={0.1} end={E} dx={140} dy={0} s0={0.97} blur0={10} bob={3} push={0.012} shadow="none" z={3} />
      <Label text="PRODUCT HIGHLIGHTS" y={170} start={0.15} end={E} />
      <Words text="ជម្រើសល្អ" y={210} start={B(0.5)} end={E} size={88} tone="espresso" />
      <Words text="សម្រាប់រាល់ថ្ងៃ" y={335} start={B(1)} end={E} size={65} tone="ruby" />
      {FEATURES.map((_, i) => <FeatureCard key={i} i={i} start={B(1.5) + i * 0.3} end={E} />)}
    </>
  );
};

/* 09 · FINAL HERO — the whole world on one ruby island: package, cup, sachet, ginger, beans; logo; CTA ──── */
export const FinalScene: React.FC<SceneProps> = ({ L, t0, idx }) => {
  const E = L + 2;
  return (
    <>
      <Pastel t0={t0} {...bgOf(idx)} />
      <Ribbon d="M -220 1520 C 200 1100, 820 1800, 1300 1240" start={0.25} dur={1.3} width={130} hold end={E} z={1} opacity={0.9} />
      <Island x={540} y={1250} W={900} start={0} end={E} faces={RUBY_PLATFORM} depth={0.12} z={2} />
      <Product src={img('pack.png')} mask={PACK_MASK} x={540} y={930} w={500} start={0.2} end={E} dur={1.1} dy={-240} s0={0.8} sheen={[1.8, 3.6]} shadow="none" bob={6} z={5} />
      <Product src={img('sachet.png')} x={840} y={1010} w={180} start={0.45} end={E} dur={1.1} dy={-220} r0={20} rot={7} sheen={[2.1]} shadow="none" bob={8} phase={1} z={4} />
      <Product src={img('cup.png')} x={290} y={1150} w={400} start={0.65} end={E} dur={1.1} dy={-220} sheen={[2.4]} shadow="none" bob={6} phase={2} z={6} />
      <Product src={img('ginger2.png')} x={830} y={1215} w={220} start={0.85} end={E} dy={-200} r0={20} rot={-6} shadow="drop" bob={7} phase={3} z={7} />
      <Product src={spr('bean2.png')} x={140} y={860} w={95} start={1.0} end={E} dy={-150} r0={40} shadow="drop" bob={10} phase={4} z={3} />
      <Product src={spr('slice.png')} x={960} y={780} w={100} start={1.1} end={E} dy={-150} r0={-40} shadow="drop" bob={10} phase={5} z={3} />
      <Product src={img('logo-brand.png')} x={540} y={240} w={420} start={B(2)} end={E} dur={1.0} dy={-50} s0={0.8} blur0={16} sheen={[1.1, 2.7]} shadow="drop" bob={3} z={8} />
      <Words text="បទពិសោធន៍ថ្មី|កាហ្វេខ្ញី 5IN1" y={400} start={B(3)} end={E} size={76} tone="ruby" stagger={0.25} gap={20} depth />
      <Label text="GOLEX — THE GOLDEN GINGER EXPERIENCE" y={1600} start={B(5)} end={E} tone="burgundy" size={22} tracking={5} />
      <Cta text="បញ្ជាទិញឥឡូវនេះ" y={1680} start={B(6)} end={E} w={560} h={96} />
      <Label text="HALAL  ·  MeSTI  ·  ISO 9001  ·  ISO 22000" y={1830} start={B(7)} end={E} tone="burgundy" size={14} tracking={4} dash={false} />
    </>
  );
};
