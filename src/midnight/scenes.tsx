/**
 * GOLEX — Midnight Luxury Edition · scene choreography.
 * Khmer copy follows docs/khmer-text/GolexSoftLux.md (the Soft Luxury wording) scene by scene.
 * Times are local to each scene; B(k) = k beats of "Rising Gold" (0.466 s).
 */
import React from 'react';
import { Img } from 'remotion';
import { LogoSheen } from '../components/LogoSheen';
import { useTime } from '../lib/useTime';
import { Cta, Orbit, OrbitPath, PACK_MASK, Pour, img, spr } from '../lux/kit';
import { Steam } from '../promo/parts';
import { Frame, Product, Underline } from '../soft/kit';
import { Annot, Curve, DarkGlass, Glow, GoldLine, Halo, Label, MICONS, Night, Words, cubicInOut, cubicOut, exitK, expoOut, outlineFilter, prog, rimFilter } from './kit';
import { MC, MF, rgba } from './theme';
import { B } from './timeline';

export type SceneProps = { L: number; t0: number };

/** Wraps children so they emerge from darkness (brightness + blur resolve) starting at `start`. */
const Emerge: React.FC<{ start: number; dur?: number; z?: number; children: React.ReactNode }> = ({ start, dur = 1.0, z = 4, children }) => {
  const t = useTime();
  const e = cubicOut(prog(t, start, dur));
  return <div style={{ position: 'absolute', inset: 0, zIndex: z, filter: e < 1 ? `brightness(${0.05 + 0.95 * e}) blur(${(1 - e) * 10}px)` : undefined }}>{children}</div>;
};

/* 01 · OPENING — black → a thin gold line → the logo traced in gold → headline ────────────────── */
export const OpenScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const logoP = cubicOut(prog(t, 0.75, 1.0));
  const trace = cubicInOut(prog(t, 1.0, 0.9));
  return (
    <>
      <Night t0={t0} cy={38} grid={false} warm={0.8 * logoP} />
      <GoldLine y={985} start={0.15} end={E} w={720} dur={0.9} />
      <Glow cx={540} cy={680} r={520} start={0.75} end={E} strength={0.55} />
      <div style={{ position: 'absolute', left: 540 - 270, top: 680 - 157, width: 540, zIndex: 5, opacity: logoP * exitK(t, E, 0.3), transform: `scale(${0.92 + 0.08 * logoP})`, filter: `brightness(${0.1 + 0.9 * logoP}) blur(${(1 - logoP) * 16}px)` }}>
        <Img src={img('logo-brand.png')} style={{ width: '100%', display: 'block', filter: outlineFilter(trace * (1 - 0.6 * cubicOut(prog(t, 2.2, 0.8))), t) }} />
      </div>
      <LogoSheen start={1.6} dur={0.9} box={{ left: 270, top: 680 - 157, width: 540, height: 314 }} />
      <Words text="បទពិសោធន៍ថ្មី" y={1040} start={1.22} end={E} size={84} tone="ivory" />
      <Words text="កាហ្វេខ្ញី 5IN1" y={1175} start={1.686} end={E} size={128} weight={900} tone="gold" mode="scale" />
      <Label text="THE GOLDEN GINGER EXPERIENCE" y={1430} start={2.4} end={E} size={20} tracking={7} />
    </>
  );
};

/* 02 · SPLIT — Khmer headline left; the pack emerges from darkness under a spotlight on the right ─── */
export const SplitScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const E = L + 1;
  return (
    <>
      <Night t0={t0} cx={72} cy={45} />
      <Glow cx={790} cy={900} r={520} start={0.1} end={E} strength={0.65} />
      <Emerge start={0.05} dur={1.1}>
        <Product src={img('pack.png')} mask={PACK_MASK} x={790} y={930} w={560} start={0.05} end={E} dur={1.2} dx={160} dy={0} s0={0.92} rotY0={-45} sway={5} sheen={[1.2]} shadow="none" mb={24} z={5} />
      </Emerge>
      <Label text="DISCOVER" x={70} width={500} align="left" y={470} start={0.2} end={E} />
      <Words text="ស្វែងរក" x={70} width={520} align="left" y={520} start={B(1)} end={E} size={82} mode="slide" />
      <Words text="ពេលវេលា" x={70} width={520} align="left" y={650} start={B(2)} end={E} size={82} mode="slide" />
      <Words text="ដ៏ពិសេស" x={70} width={520} align="left" y={780} start={B(3)} end={E} size={82} tone="ruby" mode="slide" />
      <Underline x={74} y={955} w={300} start={B(3.5)} end={E} from="left" dur={0.7} />
      <Words text="Unlock|the|richness." x={70} width={520} align="left" y={980} start={B(3.5) + 0.1} end={E} font="serif" size={42} weight={500} italic tone="gold" stagger={0.1} gap={10} />
      <DarkGlass x={70} y={1230} w={430} h={236} start={B(4)} end={E} dx={-120} dy={0}>
        <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: MF.sans, fontWeight: 600, fontSize: 15, letterSpacing: 5, color: MC.champagne }}>NET WEIGHT 475 g</span>
          <span style={{ fontFamily: MF.khSans, fontWeight: 700, fontSize: 36, color: MC.ivory, lineHeight: 1.45 }}>២៥ កញ្ចប់ × ១៩ក្រាម</span>
          <span style={{ fontFamily: MF.khSans, fontWeight: 400, fontSize: 28, color: rgba(MC.ivory, 0.75), lineHeight: 1.45 }}>ទម្ងន់សុទ្ធ ៤៧៥ក្រាម</span>
        </div>
      </DarkGlass>
    </>
  );
};

/* 03 · MACRO (on the drop) — the pack up close in a glowing frame, two metallic light sweeps ──────── */
export const MacroScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const push = 1 + 0.08 * cubicOut(t / L);
  const pan = -40 * cubicInOut(t / L);
  const sw = [0.35, B(4)].map((s) => (t - s) / 1.0).find((k) => k > 0 && k < 1) ?? -1;
  return (
    <>
      <Night t0={t0} cy={40} />
      <Label text="PREMIUM QUALITY" y={190} start={0.15} end={E} />
      <Frame x={90} y={270} w={900} h={1080} r={56} start={0} end={E} dy={0} bg={MC.black}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${pan}px) scale(${push})`, transformOrigin: '450px 540px' }}>
          <Img src={img('pack.png')} style={{ position: 'absolute', width: 2060, left: -763, top: -10 }} />
        </div>
        {sw > 0 && sw < 1 && <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(112deg, transparent ${sw * 160 - 45}%, ${rgba('#FFF4D6', 0.6)} ${sw * 160 - 30}%, transparent ${sw * 160 - 15}%)` }} />}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${rgba(MC.black, 0.25)} 0%, transparent 25%, transparent 65%, ${rgba(MC.black, 0.8)} 100%)` }} />
      </Frame>
      <Words text="កាហ្វេខ្ញី|៥ ក្នុង ១" y={1415} start={B(1)} end={E} size={84} tone="gold" stagger={0.2} gap={24} />
      <Words text="ខាប់ និងឈ្ងុយឆ្ងាញ់|·|កក់ក្តៅ និងផ្តល់ថាមពល" y={1575} start={B(2.5)} end={E} font="khSans" size={32} weight={600} tone="ivory" stagger={0.15} gap={14} />
      <Label text="RICH & CREAMY  +  WARMING & ENERGIZING" y={1680} start={B(3.5)} end={E} size={17} tracking={4} dash={false} />
    </>
  );
};

/* 04 · CUP — rim-lit cup, the pour, golden-backlit steam, ingredients orbiting in 3D ─────────────── */
export const CupScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const rim = cubicOut(prog(t, 0.4, 1.0));
  return (
    <>
      <Night t0={t0} cy={52} />
      <Glow cx={540} cy={980} r={640} start={0.1} end={E} strength={0.7} />
      <Glow cx={560} cy={760} r={260} start={1.2} end={E} strength={0.6} />
      <Halo cx={540} cy={1000} r={480} start={0.3} end={E} opacity={0.7} />
      <OrbitPath cx={540} cy={1120} rx={480} ry={150} start={0.5} end={E} tilt={-7} />
      <Orbit cx={540} cy={1120} rx={480} ry={150} start={0.7} end={E} speed={34} tilt={-7} grow={1.2} bodies={[
        { src: spr('slice.png'), w: 140, a0: 0, spin: 22 },
        { src: spr('bean2.png'), w: 110, a0: 72 },
        { src: img('ginger1.png'), w: 170, a0: 144, spin: 10 },
        { src: spr('bean5.png'), w: 95, a0: 216 },
        { src: spr('slice.png'), w: 110, a0: 288, spin: -25 },
      ]} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, filter: rimFilter(rim * 0.6) }}>
        <Product src={img('cup.png')} x={540} y={1020} w={860} start={0} end={E} dur={1.2} dy={120} s0={1.15} blur0={20} rotY0={-20} sway={4} push={0.012} sheen={[1.4, 3.0]} shadow="none" z={5} />
      </div>
      <Pour x={560} surfaceY={968} start={0.35} dur={1.0} />
      <Steam cx={560} baseY={880} start={1.5} end={E} height={400} count={6} />
      <OrbitPath cx={540} cy={1120} rx={480} ry={150} start={0.5} end={E} tilt={-7} front />
      <Words text="ឈ្ងុយឆ្ងាញ់" y={170} start={B(2)} end={E} size={120} weight={900} tone="gold" mode="scale" />
      <Underline x={340} y={1530} w={400} start={B(4)} end={E} dur={0.8} />
      <Words text="Richness|in|every|sip." y={1555} start={B(4) + 0.2} end={E} font="serif" size={56} weight={500} italic tone="ivory" stagger={0.12} gap={14} />
    </>
  );
};

/* 05 · TEXTURE — the crema in a glowing circular lens, ingredients drifting in depth ────────────── */
export const TextureScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const open = expoOut(prog(t, 0.05, 0.9));
  const R = 400 * open;
  const z = 1 + 0.08 * (t / L);
  const sw = [1.0, B(4.5)].map((s) => (t - s) / 1.1).find((k) => k > 0 && k < 1) ?? -1;
  return (
    <>
      <Night t0={t0} cy={45} />
      <Glow cx={540} cy={860} r={600} start={0.1} end={E} strength={0.5} color="ruby" />
      <Label text="ក្លិនក្រអូប  ·  ខាប់  ·  ឆ្ងាញ់" y={215} start={B(1)} end={E} font="khSans" size={34} />
      <Halo cx={540} cy={860} r={432} start={0.3} end={E} />
      <div style={{ position: 'absolute', left: 540 - R, top: 860 - R, width: R * 2, height: R * 2, borderRadius: '50%', overflow: 'hidden', zIndex: 3, boxShadow: `0 0 60px ${rgba(MC.gold, 0.35)}, 0 0 120px ${rgba(MC.crimson, 0.3)}`, opacity: exitK(t, E, 0.3) }}>
        <div style={{ position: 'absolute', left: R - 400, top: R - 400, width: 800, height: 800, transform: `scale(${z}) rotate(${t * 2}deg)` }}>
          <div style={{ position: 'absolute', inset: 0, background: MC.ruby }} />
          <Img src={img('cup.png')} style={{ position: 'absolute', width: 3520, left: 400 - 575 * 3.2, top: 400 - 312 * 3.2 }} />
        </div>
        {sw > 0 && sw < 1 && <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(120deg, transparent ${sw * 160 - 45}%, ${rgba('#FFF4D6', 0.5)} ${sw * 160 - 30}%, transparent ${sw * 160 - 15}%)` }} />}
      </div>
      <Product src={spr('slice.png')} x={170} y={560} w={170} start={0.4} end={E} dx={-160} dy={0} r0={-40} rot={-15} shadow="none" bob={12} phase={0.5} z={6} />
      <Product src={spr('bean8.png')} x={900} y={1150} w={130} start={0.6} end={E} dx={160} dy={0} r0={50} shadow="none" bob={10} phase={2} z={6} />
      <div style={{ filter: 'blur(6px) brightness(0.7)' }}>
        <Product src={spr('bean2.png')} x={940} y={470} w={110} start={0.8} end={E} dy={60} shadow="none" bob={14} phase={3} z={2} />
        <Product src={spr('slice.png')} x={130} y={1220} w={120} start={0.9} end={E} dy={60} shadow="none" bob={14} phase={4} z={2} />
      </div>
      <Words text="ខ្ញីស្រស់|·|កាហ្វេល្អ" y={1355} start={B(2)} end={E} size={84} tone="ivory" stagger={0.2} gap={20} />
      <Underline x={340} y={1515} w={400} start={B(3)} end={E} dur={0.7} />
      <Words text="Ginger|infused.|Coffee|inspired." y={1540} start={B(3) + 0.1} end={E} font="serif" size={50} weight={500} italic tone="gold" stagger={0.12} gap={14} />
    </>
  );
};

/* 06 · INGREDIENTS — three ingredients emerge with a gold outline; annotation lines draw to their labels ─ */
const ING = [
  { n: '01', kh: 'ខ្ញីបេនតុង', en: 'BENTONG GINGER', d: 'កក់ក្តៅ និងផ្តល់ថាមពល', src: img('ginger2.png'), w: 320, y: 700 },
  { n: '02', kh: 'គ្រាប់កាហ្វេ', en: 'COFFEE BEANS', d: 'ឈ្ងុយ និងខាប់', src: img('beans2.png'), w: 300, y: 1060 },
  { n: '03', kh: 'ស្ករត្នោត', en: 'BROWN SUGAR', d: 'ផ្អែមឈ្ងុយ', src: img('palm1.png'), w: 290, y: 1420 },
];
const Ingredient: React.FC<{ i: number; start: number; end: number }> = ({ i, start, end }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const it = ING[i];
  const p = cubicOut(prog(t, start, 0.8));
  const ol = cubicInOut(prog(t, start + 0.35, 0.7));
  const life = t - start;
  const o = Math.min(1, p * 2) * exitK(t, end, 0.3);
  return (
    <div
      style={{
        position: 'absolute', left: 290 - it.w / 2, top: it.y - it.w * 0.42, width: it.w, zIndex: 5, opacity: o,
        transform: `translateY(${60 * (1 - p) + 7 * Math.sin(life * 1.4 + i)}px) rotate(${2.5 * Math.sin(life * 1.1 + i)}deg) scale(${0.9 + 0.1 * p})`,
        filter: `brightness(${0.1 + 0.9 * p}) ${outlineFilter(ol, t + i)}`,
      }}
    >
      <Img src={it.src} style={{ width: '100%', display: 'block' }} />
    </div>
  );
};
export const IngredientsScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const E = L + 1;
  const starts = [B(2.5), B(3.5), B(4.5)];
  return (
    <>
      <Night t0={t0} cx={30} cy={60} />
      <Glow cx={290} cy={1060} r={560} start={0.2} end={E} strength={0.45} color="ruby" />
      <Label text="INGREDIENTS" y={150} start={0.15} end={E} />
      <Words text="ផលិតពីខ្ញីបេនតុង" y={190} start={B(0.5)} end={E} size={70} tone="ivory" />
      <Words text="គុណភាពខ្ពស់" y={305} start={B(1.5)} end={E} size={70} tone="gold" />
      {ING.map((it, i) => (
        <React.Fragment key={it.n}>
          <Ingredient i={i} start={starts[i]} end={E} />
          <Annot x={290 + it.w * 0.32 + 90} y={it.y - 20} tx={560} ty={it.y - 20} len={340} start={starts[i] + 0.25} end={E} num={it.n} kh={it.kh} en={it.en} d={it.d} />
        </React.Fragment>
      ))}
      <Label text="ខ្ញី · កាហ្វេ · ស្ករត្នោត" y={1720} start={B(6.5)} end={E} font="khSans" size={34} tone="ivory" />
    </>
  );
};

/* 07 · LIFESTYLE — the model emerges from darkness with a warm rim light; editorial type ──────────── */
export const Model1Scene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const e = cubicOut(prog(t, 0.05, 1.1));
  const rim = cubicOut(prog(t, 0.4, 1.0));
  const push = 1 + 0.045 * cubicOut(t / L);
  return (
    <>
      <Night t0={t0} cx={62} cy={58} />
      <Glow cx={660} cy={1180} r={640} start={0.1} end={E} strength={0.8} color="ruby" />
      <div style={{ position: 'absolute', left: 110, top: 760, width: 1100, zIndex: 4, opacity: Math.min(1, e * 1.6) * exitK(t, E, 0.3), transform: `scale(${push})`, transformOrigin: '540px 400px', filter: `brightness(${0.08 + 0.92 * e}) ${rimFilter(rim)}` }}>
        <Img src={img('model1.png')} style={{ width: '100%', display: 'block' }} />
      </div>
      <Label text="YOUR MOMENT" x={70} width={600} align="left" y={175} start={0.2} end={E} />
      <Words text="ពេលវេលា" x={70} width={960} align="left" y={215} start={B(1)} end={E} size={100} mode="slide" />
      <Words text="ដ៏កក់ក្តៅ" x={70} width={960} align="left" y={375} start={B(2)} end={E} size={100} tone="ruby" mode="slide" />
      <Words text="Crafted|for|a|warmer|moment." x={70} width={960} align="left" y={555} start={B(3)} end={E} font="serif" size={42} weight={500} italic tone="gold" stagger={0.08} gap={10} />
      <Words text="ប្រចាំថ្ងៃរបស់អ្នក" x={70} width={960} align="left" y={625} start={B(4)} end={E} font="khSans" size={34} weight={600} tone="ivory" />
    </>
  );
};

/* 08 · HIGHLIGHTS — model 2 over a ruby glow, dark glass feature cards with self-drawing gold icons ─── */
const FEATURES: [string, string, string][] = [
  ['drop', 'គ្មានជាតិខ្លាញ់', 'TRANS FAT-FREE'],
  ['flask', 'គ្មានសារធាតុបន្ថែម', 'NO ADDED ARTIFICIAL FLAVOURING'],
];
const FeatureCard: React.FC<{ i: number; start: number; end: number }> = ({ i, start, end }) => {
  const t = useTime();
  const [icon, kh, en] = FEATURES[i];
  const draw = cubicInOut(prog(t, start + 0.2, 0.8));
  return (
    <DarkGlass x={50} y={700 + i * 210} w={520} h={170} start={start} end={end} dx={-240} dy={0} r={34} phase={i * 1.3}>
      <div style={{ position: 'absolute', left: 24, top: 25, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle at 40% 35%, ${MC.crimson}, ${MC.burgundy})`, boxShadow: `inset 0 0 0 1.5px ${MC.champagne}, 0 0 18px ${rgba(MC.crimson, 0.5)}` }} />
      <svg width={120} height={120} viewBox="-28 -28 120 120" style={{ position: 'absolute', left: 24, top: 25 }}>
        <g style={{ strokeDasharray: 300, strokeDashoffset: 300 * (1 - draw) } as React.CSSProperties}>{MICONS[icon]}</g>
      </svg>
      <div style={{ position: 'absolute', left: 164, top: 38, fontFamily: MF.khSans, fontWeight: 700, fontSize: 32, color: MC.ivory, lineHeight: 1.45, whiteSpace: 'nowrap' }}>{kh}</div>
      <div style={{ position: 'absolute', left: 166, top: 96, fontFamily: MF.sans, fontWeight: 600, fontSize: 14, letterSpacing: 2, color: MC.champagne, whiteSpace: 'nowrap' }}>{en}</div>
    </DarkGlass>
  );
};
export const HighlightsScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const e = cubicOut(prog(t, 0.05, 1.0));
  const rim = cubicOut(prog(t, 0.3, 0.9));
  return (
    <>
      <Night t0={t0} cx={70} cy={60} />
      <Glow cx={760} cy={1120} r={560} start={0.05} end={E} strength={0.85} color="ruby" />
      <Halo cx={760} cy={1120} r={460} start={0.3} end={E} opacity={0.75} />
      <div style={{ position: 'absolute', left: 770 - 575, top: 1300 - 575, width: 1150, zIndex: 3, opacity: Math.min(1, e * 1.6) * exitK(t, E, 0.3), transform: `translateX(${120 * (1 - e)}px)`, filter: `brightness(${0.1 + 0.9 * e}) ${rimFilter(rim * 0.8)}` }}>
        <Img src={img('model2.png')} style={{ width: '100%', display: 'block' }} />
      </div>
      <Label text="PRODUCT HIGHLIGHTS" y={170} start={0.2} end={E} />
      <Words text="ជម្រើសល្អ" y={210} start={B(1)} end={E} size={88} tone="ivory" />
      <Words text="សម្រាប់រាល់ថ្ងៃ" y={335} start={B(2)} end={E} size={65} tone="gold" />
      <Curve x={620} y={500} w={380} h={130} start={B(2)} end={E} />
      {FEATURES.map((_, i) => <FeatureCard key={i} i={i} start={B(2.5) + i * 0.35} end={E} />)}
    </>
  );
};

/* 09 · FINAL — spotlight hero composition on a dark reflective stage; logo traced in light; CTA ─────── */
export const FinalScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 2;
  const h = expoOut(prog(t, 0.1, 1.2));
  const logoP = cubicOut(prog(t, B(2), 1.0));
  const trace = cubicInOut(prog(t, B(2) + 0.2, 0.9));
  return (
    <>
      <Night t0={t0} cy={58} spot />
      <div style={{ position: 'absolute', left: -300, top: 1290 + 700 * (1 - h), width: 1680, height: 1500, borderRadius: '50%', zIndex: 1, background: `radial-gradient(ellipse 55% 35% at 50% 6%, ${rgba(MC.crimson, 0.55)} 0%, ${MC.burgundy} 40%, ${MC.black} 85%)`, boxShadow: `0 -1.5px 0 ${rgba(MC.champagne, 0.9)}, 0 -24px 70px ${rgba(MC.gold, 0.22)}` }} />
      <Glow cx={540} cy={1000} r={560} start={0.2} end={E} strength={0.7} />
      <Halo cx={540} cy={1040} r={420} start={0.3} end={E} opacity={0.8} />
      <Product src={img('pack.png')} mask={PACK_MASK} x={540} y={1040} w={600} start={0.1} end={E} dur={1.2} dy={220} s0={0.78} sheen={[1.6, 3.6]} shadow="none" bob={6} z={4} />
      <Product src={img('sachet.png')} x={850} y={1130} w={210} start={0.45} end={E} dur={1.2} dx={240} dy={40} r0={30} rot={7} sheen={[2.0]} shadow="none" bob={8} phase={1} mb={30} z={3} />
      <Product src={img('cup.png')} x={290} y={1330} w={480} start={0.7} end={E} dur={1.2} dx={-240} dy={40} sheen={[2.3]} shadow="none" bob={6} phase={2} mb={30} z={6} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 7, filter: outlineFilter(cubicInOut(prog(t, 1.4, 0.8)) * 0.8, t) }}>
        <Product src={img('ginger2.png')} x={850} y={1440} w={260} start={0.95} end={E} dy={160} r0={20} rot={-6} shadow="none" bob={7} phase={3} z={7} />
      </div>
      <Product src={spr('bean2.png')} x={120} y={900} w={100} start={1.2} end={E} dy={100} r0={40} shadow="none" bob={10} phase={4} z={2} />
      <div style={{ position: 'absolute', left: 540 - 215, top: 240 - 125, width: 430, zIndex: 8, opacity: logoP, transform: `translateY(${-40 * (1 - logoP)}px) scale(${0.85 + 0.15 * logoP})`, filter: `brightness(${0.1 + 0.9 * logoP}) blur(${(1 - logoP) * 14}px)` }}>
        <Img src={img('logo-brand.png')} style={{ width: '100%', display: 'block', filter: outlineFilter(trace * (1 - 0.6 * cubicOut(prog(t, B(2) + 1.4, 0.8))), t) }} />
      </div>
      <LogoSheen start={B(2) + 1.1} dur={0.9} box={{ left: 325, top: 115, width: 430, height: 250 }} />
      <Words text="បទពិសោធន៍ថ្មី|កាហ្វេខ្ញី 5IN1" y={400} start={B(3) + 0.2} end={E} size={76} tone="gold" stagger={0.25} gap={20} />
      <Label text="GOLEX — THE GOLDEN GINGER EXPERIENCE" y={1600} start={B(5)} end={E} tone="ivory" size={22} tracking={5} />
      <Cta text="បញ្ជាទិញឥឡូវនេះ" y={1680} start={B(6)} end={E} w={560} h={96} />
      <Label text="HALAL  ·  MeSTI  ·  ISO 9001  ·  ISO 22000" y={1830} start={B(7)} end={E} tone="ivory" size={14} tracking={4} dash={false} />
    </>
  );
};
