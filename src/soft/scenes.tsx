/**
 * GOLEX — Soft Luxury Edition · scene choreography (Khmer-first).
 * Times are local to each scene. Scenes 2–9 start on a beat, so B(k) = k (pace-scaled) beats in.
 * The opening scene starts at 0 s, before the first beat (S_PICKUP), so it uses B0(k).
 */
import React from 'react';
import { Img } from 'remotion';
import { useTime } from '../lib/useTime';
import { Steam } from '../promo/parts';
import { Cta, Orbit, OrbitPath, PACK_MASK, Pour, img, spr } from '../lux/kit';
import { Frame, Glass, Ivory, Label, Product, Ring, Ruby, SICONS, Underline, Words, backOut, cubicInOut, cubicOut, expoOut, exitK, prog } from './kit';
import { SC, SF, rgba } from './theme';
import { S_PICKUP, beats } from './timeline';

export type SceneProps = { L: number; t0: number; pace: number };

/* 01 · OPENING — 3.17 s ivory title moment: label → headline → gold hit on the downbeat → underline ─── */
export const OpenScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const B0 = (k: number) => S_PICKUP + B(k); // beats in video time: 0.505, 1.172, 1.839 (downbeat), 2.505
  const t = useTime();
  const E = L + 1;
  const drift = -18 * cubicInOut(prog(t, 0, L)); // slow upward drift while the title holds
  return (
    <>
      <Ivory t0={t0} cy={880} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${330 + drift}px)` }}>
        <Label text="GOLEX  ·  PREMIUM QUALITY" y={250} start={0.12} end={E} size={22} tracking={8} />
        <Words text="បទពិសោធន៍ថ្មី" y={315} start={B0(0)} end={E} size={100} tone="espresso" />
        <Words text="កាហ្វេខ្ញី 5IN1" y={470} start={B0(1)} end={E} size={150} weight={900} tone="gold" mode="scale" depth />
        <Underline x={300} y={770} w={480} start={B0(2)} end={E} dur={0.8} />
        <Words text="The|Golden|Ginger|Experience" y={790} start={B0(2) + 0.15} end={E} font="serif" size={52} weight={500} italic tone="burgundy" stagger={0.09} gap={14} />
      </div>
      <Product src={spr('slice.png')} x={170} y={1500} w={140} start={B0(1) + 0.2} end={E} dx={-120} dy={40} r0={-50} rot={-10} shadow="drop" bob={10} phase={1} z={8} />
      <Product src={spr('bean2.png')} x={920} y={420} w={110} start={B0(2)} end={E} dx={100} dy={-40} r0={60} shadow="drop" bob={8} phase={2} z={8} />
    </>
  );
};

/* 02 · SPLIT — editorial split screen: Khmer headline left, floating pack on a ruby pill right ─── */
export const SplitScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const E = L + 1;
  return (
    <>
      <Ivory t0={t0} lines={false} />
      <Frame x={590} y={250} w={440} h={1420} r={220} start={0} end={E} dy={0} bg={`linear-gradient(180deg, #A41E2A 0%, ${SC.ruby} 50%, ${SC.burgundy} 100%)`}>
        <div />
      </Frame>
      <Product src={img('pack.png')} mask={PACK_MASK} x={770} y={930} w={580} start={0.2} end={E} dur={1.4} dx={260} dy={0} s0={0.9} rotY0={-50} sway={5} sheen={[1.3]} shadow="floor" shadowY={0.42} mb={30} z={5} />
      <Label text="DISCOVER" x={70} width={500} align="left" y={420} start={0.3} end={E} />
      <Words text="ស្វែងរក" x={70} width={520} align="left" y={470} start={B(1)} end={E} size={82} mode="slide" />
      <Words text="ពេលវេលា" x={70} width={520} align="left" y={600} start={B(2)} end={E} size={82} mode="slide" />
      <Words text="ដ៏ពិសេស" x={70} width={520} align="left" y={730} start={B(3)} end={E} size={82} tone="ruby" mode="slide" />
      <Underline x={74} y={900} w={300} start={B(3)} end={E} from="left" dur={1.0} />
      <Words text="Discover|a|richer|moment." x={70} width={520} align="left" y={925} start={B(3) + 0.2} end={E} font="serif" size={42} weight={500} italic tone="burgundy" stagger={0.14} gap={10} />
      <Glass x={70} y={1200} w={440} h={236} start={B(3.5)} end={E} dx={-120} dy={0}>
        <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: SF.sans, fontWeight: 600, fontSize: 15, letterSpacing: 5, color: SC.gold }}>NET WEIGHT 475 g</span>
          <span style={{ fontFamily: SF.khSans, fontWeight: 700, fontSize: 36, color: SC.burgundy, lineHeight: 1.45 }}>២៥ កញ្ចប់ × ១៩ក្រាម</span>
          <span style={{ fontFamily: SF.khSans, fontWeight: 400, fontSize: 28, color: SC.espresso, lineHeight: 1.45 }}>ទម្ងន់សុទ្ធ ៤៧៥ក្រាម</span>
        </div>
      </Glass>
    </>
  );
};

/* 03 · MACRO — the packaging up close: GOLEX crest and "5 IN 1", slow push and a gold sweep ──── */
export const MacroScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const t = useTime();
  const E = L + 1;
  const push = 1 + 0.07 * cubicOut(t / L);
  const pan = -40 * cubicInOut(t / L);
  // two golden sweeps across the macro: one as it settles, one on bar 2
  const sw = [1.3, B(4) + 0.3].map((s) => (t - s) / 1.2).find((k) => k > 0 && k < 1) ?? -1;
  return (
    <>
      <Ivory t0={t0} />
      <Label text="PREMIUM QUALITY" y={190} start={0.3} end={E} />
      <Frame x={90} y={270} w={900} h={1080} r={60} start={0} end={E} dy={0} bg={SC.ruby}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${pan}px) scale(${push})`, transformOrigin: '450px 540px' }}>
          <Img src={img('pack.png')} style={{ position: 'absolute', width: 2060, left: -763, top: -10 }} />
        </div>
        {sw > 0 && sw < 1 && <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(115deg, transparent ${sw * 160 - 45}%, ${rgba('#FFF4D6', 0.55)} ${sw * 160 - 30}%, transparent ${sw * 160 - 15}%)` }} />}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 70%, ${rgba(SC.burgundy, 0.55)} 100%)` }} />
      </Frame>
      <Words text="កាហ្វេខ្ញី|៥ ក្នុង ១" y={1420} start={B(2)} end={E} size={84} tone="ruby" stagger={0.25} gap={24} />
      <Words text="ខាប់ និងឈ្ងុយឆ្ងាញ់|·|កក់ក្តៅ និងផ្តល់ថាមពល" y={1580} start={B(4)} end={E} font="khSans" size={32} weight={600} tone="espresso" stagger={0.2} gap={14} />
      <Label text="RICH & CREAMY  +  WARMING & ENERGIZING" y={1680} start={B(5)} end={E} size={17} tracking={4} dash={false} tone="gold" />
    </>
  );
};

/* 04 · CUP — ruby product stage: the coffee pours, the cup floats in 3D, ingredients orbit ─────── */
export const CupScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const E = L + 1;
  return (
    <>
      <Ruby t0={t0} cy={52} />
      <Ring cx={540} cy={1000} r={500} start={0.3} end={E} dur={1.4} opacity={0.6} />
      <OrbitPath cx={540} cy={1120} rx={480} ry={150} start={0.5} end={E} tilt={-7} />
      <Orbit cx={540} cy={1120} rx={480} ry={150} start={0.7} end={E} speed={34} tilt={-7} grow={1.2} bodies={[
        { src: spr('slice.png'), w: 140, a0: 0, spin: 22 },
        { src: spr('bean2.png'), w: 110, a0: 72 },
        { src: img('ginger1.png'), w: 170, a0: 144, spin: 10 },
        { src: spr('bean5.png'), w: 95, a0: 216 },
        { src: spr('slice.png'), w: 110, a0: 288, spin: -25 },
      ]} />
      <Product src={img('cup.png')} x={540} y={1020} w={860} start={0} end={E} dur={1.3} dy={140} s0={0.82} rotY0={-25} sway={4} sheen={[1.6, 3.2]} shadow="floor" shadowY={0.36} z={5} />
      <Pour x={560} surfaceY={968} start={0.4} dur={1.1} />
      <Steam cx={560} baseY={880} start={1.8} end={E} height={380} count={5} />
      <OrbitPath cx={540} cy={1120} rx={480} ry={150} start={0.5} end={E} tilt={-7} front />
      <Words text="ឈ្ងុយឆ្ងាញ់" y={190} start={B(2)} end={E} size={120} weight={900} tone="gold" mode="scale" depth />
      {/* <Words text="គ្រប់|ការក្រេប" y={370} start={B(3)} end={E} size={58} tone="ivory" stagger={0.2} gap={16} /> */}
      <Underline x={340} y={1525} w={400} start={B(4)} end={E} dur={1.0} />
      <Words text="Richness|in|every|sip." y={1545} start={B(4) + 0.3} end={E} font="serif" size={60} weight={500} italic tone="ivory" stagger={0.16} gap={14} />
    </>
  );
};

/* 05 · TEXTURE — macro of the crema in a circular lens, ingredients drift in depth ─────────────── */
export const TextureScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const t = useTime();
  const E = L + 1;
  const open = expoOut(prog(t, 0.05, 1.0));
  const R = 400 * open;
  const z = 1 + 0.08 * (t / L);
  const sw = [1.4, B(5)].map((s) => (t - s) / 1.3).find((k) => k > 0 && k < 1) ?? -1;
  return (
    <>
      <Ivory t0={t0} lines={false} />
      <Label text="ក្លិនក្រអូប  ·  ខាប់  ·  ឆ្ងាញ់" y={215} start={B(1)} end={E} font="khSans" size={30} />
      <Ring cx={540} cy={860} r={430} start={0.3} end={E} dur={1.2} width={2} />
      <Ring cx={540} cy={860} r={470} start={0.5} end={E} dashed opacity={0.7} />
      <div style={{ position: 'absolute', left: 540 - R, top: 860 - R, width: R * 2, height: R * 2, borderRadius: '50%', overflow: 'hidden', zIndex: 3, boxShadow: `0 40px 70px ${rgba(SC.burgundy, 0.35)}`, opacity: exitK(t, E, 0.35) }}>
        <div style={{ position: 'absolute', left: R - 400, top: R - 400, width: 800, height: 800, transform: `scale(${z}) rotate(${t * 2}deg)` }}>
          <div style={{ position: 'absolute', inset: 0, background: SC.ruby }} />
          <Img src={img('cup.png')} style={{ position: 'absolute', width: 3520, left: 400 - 575 * 3.2, top: 400 - 312 * 3.2 }} />
        </div>
        {sw > 0 && sw < 1 && <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(120deg, transparent ${sw * 160 - 45}%, ${rgba('#FFF4D6', 0.5)} ${sw * 160 - 30}%, transparent ${sw * 160 - 15}%)` }} />}
      </div>
      <Product src={spr('slice.png')} x={170} y={560} w={170} start={0.5} end={E} dx={-160} dy={0} r0={-40} rot={-15} shadow="drop" bob={12} phase={0.5} z={6} />
      <Product src={spr('bean8.png')} x={900} y={1150} w={130} start={0.7} end={E} dx={160} dy={0} r0={50} shadow="drop" bob={10} phase={2} z={6} />
      <div style={{ filter: 'blur(5px)' }}>
        <Product src={spr('bean2.png')} x={940} y={470} w={110} start={0.9} end={E} dy={60} shadow="none" bob={14} phase={3} z={2} />
        <Product src={spr('slice.png')} x={130} y={1220} w={120} start={1.0} end={E} dy={60} shadow="none" bob={14} phase={4} z={2} />
      </div>
      <Words text="ខ្ញីស្រស់|·|កាហ្វេល្អ" y={1350} start={B(2)} end={E} size={84} tone="espresso" stagger={0.25} gap={20} />
      <Underline x={340} y={1510} w={400} start={B(4)} end={E} dur={1.0} />
      <Words text="Ginger|infused.|Coffee|inspired." y={1530} start={B(4) + 0.3} end={E} font="serif" size={56} weight={500} italic tone="ruby" stagger={0.16} gap={14} />
    </>
  );
};

/* 06 · INGREDIENTS — three glass ingredient cards land on the beats, then each takes focus ───── */
const ING = [
  { n: '01', kh: 'ខ្ញីបេនតុង', en: 'BENTONG GINGER', d: 'កក់ក្តៅ និងផ្តល់ថាមពល', src: img('ginger2.png'), iw: 290, side: -1 },
  { n: '02', kh: 'គ្រាប់កាហ្វេ', en: 'COFFEE BEANS', d: 'ឈ្ងុយ និងខាប់', src: '', iw: 0, side: 1 },
  { n: '03', kh: 'ស្ករត្នោត', en: 'BROWN SUGAR', d: 'ផ្អែមឈ្ងុយ', src: img('palm1.png'), iw: 270, side: -1 },
];
const IngredientRow: React.FC<{ i: number; y: number; start: number; focus: number; end: number }> = ({ i, y, start, focus, end }) => {
  const t = useTime();
  const it = ING[i];
  const f = Math.exp(-(((t - focus - 0.3) / 0.45) ** 2));
  const ip = backOut(prog(t, start + 0.2, 0.9), 1.5);
  const life = t - start;
  return (
    <Glass x={70} y={y} w={940} h={300} start={start} end={end} dx={it.side * 320} dy={0} r={44} phase={i * 1.7}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 + 0.025 * f})`, boxShadow: `inset 0 0 0 ${2 + 2 * f}px ${rgba(SC.gold, 0.5 + 0.5 * f)}`, borderRadius: 44 }} />
      <div style={{ position: 'absolute', left: 34, top: 35, width: 230, height: 230, borderRadius: '50%', background: `radial-gradient(circle at 45% 40%, #FFFFFF 0%, ${SC.cream} 55%, ${SC.beige} 100%)`, boxShadow: `inset 0 0 0 1.5px ${rgba(SC.champagne, 0.8)}` }} />
      <div style={{ position: 'absolute', left: 149, top: 150, width: 0, height: 0, transform: `scale(${(0.5 + 0.5 * ip) * (1 + 0.06 * f)}) rotate(${3 * Math.sin(life * 1.2 + i)}deg) translateY(${4 * Math.sin(life * 1.6 + i)}px)`, opacity: Math.min(1, ip * 2) }}>
        {it.src ? (
          <Img src={it.src} style={{ position: 'absolute', width: it.iw, left: -it.iw / 2, top: -it.iw * 0.4, filter: `drop-shadow(0 16px 16px ${rgba(SC.burgundy, 0.3)})` }} />
        ) : (
          <>
            <Img src={spr('bean1.png')} style={{ position: 'absolute', width: 130, left: -120, top: -80, transform: 'rotate(-25deg)', filter: `drop-shadow(0 12px 12px ${rgba(SC.burgundy, 0.35)})` }} />
            <Img src={spr('bean2.png')} style={{ position: 'absolute', width: 140, left: -20, top: -30, transform: 'rotate(30deg)', filter: `drop-shadow(0 12px 12px ${rgba(SC.burgundy, 0.35)})` }} />
            <Img src={spr('bean8.png')} style={{ position: 'absolute', width: 90, left: -60, top: 30, transform: 'rotate(80deg)', filter: `drop-shadow(0 12px 12px ${rgba(SC.burgundy, 0.35)})` }} />
          </>
        )}
      </div>
      <div style={{ position: 'absolute', left: 300, top: 34, fontFamily: SF.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 46, color: SC.gold, lineHeight: 1 }}>{it.n}</div>
      <div style={{ position: 'absolute', left: 300, top: 82, fontFamily: SF.khSerif, fontWeight: 700, fontSize: 56, color: SC.ruby, lineHeight: 1.55 }}>{it.kh}</div>
      <div style={{ position: 'absolute', left: 302, top: 180, fontFamily: SF.sans, fontWeight: 600, fontSize: 17, letterSpacing: 5, color: SC.gold }}>{it.en}</div>
      <div style={{ position: 'absolute', left: 300, top: 210, fontFamily: SF.khSans, fontWeight: 400, fontSize: 28, color: SC.espresso, lineHeight: 1.5 }}>{it.d}</div>
    </Glass>
  );
};
export const IngredientsScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const E = L + 1;
  return (
    <>
      <Ivory t0={t0} lines={false} />
      <Label text="INGREDIENTS" y={160} start={0.4} end={E} />
      <Words text="ផលិតពីខ្ញីបេនតុង" y={200} start={B(1)} end={E} size={70} tone="espresso" />
      <Words text="គុណភាពខ្ពស់" y={325} start={B(2)} end={E} size={70} tone="ruby" />
      <Words text="Made|with|premium|Bentong|ginger." y={470} start={B(3)} end={E} font="serif" size={40} weight={500} italic tone="burgundy" stagger={0.12} gap={10} />
      <IngredientRow i={0} y={600} start={B(4)} focus={B(8)} end={E} />
      <IngredientRow i={1} y={940} start={B(5.5)} focus={B(9)} end={E} />
      <IngredientRow i={2} y={1280} start={B(7)} focus={B(10)} end={E} />
      <Product src={spr('slice.png')} x={1010} y={560} w={120} start={B(4) + 0.4} end={E} dx={120} dy={0} r0={40} shadow="drop" bob={12} phase={1} z={9} />
      <Product src={spr('bean5.png')} x={70} y={1640} w={110} start={B(7) + 0.4} end={E} dx={-120} dy={0} r0={-40} shadow="drop" bob={12} phase={2} z={9} />
      <Label text="ខ្ញី · កាហ្វេ · ស្ករត្នោត" y={1660} start={B(10.5)} end={E} font="khSans" size={30} />
    </>
  );
};

/* 07 · LIFESTYLE — negative space, editorial headline, model inside a tall rounded frame ───────── */
export const Model1Scene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const t = useTime();
  const E = L + 1;
  const push = 1 + 0.06 * cubicOut(t / L);
  return (
    <>
      <Ivory t0={t0} lines={false} />
      <Label text="YOUR MOMENT" x={70} width={600} align="left" y={175} start={0.4} end={E} />
      <Words text="ពេលវេលា" x={70} width={960} align="left" y={215} start={B(1)} end={E} size={100} mode="slide" />
      <Words text="ដ៏កក់ក្តៅ" x={70} width={960} align="left" y={375} start={B(2)} end={E} size={100} tone="ruby" mode="slide" />
      <Frame x={340} y={640} w={680} h={1190} r={340} start={0.15} end={E} bg={`radial-gradient(ellipse 80% 60% at 50% 35%, #B0242F 0%, ${SC.ruby} 50%, ${SC.burgundy} 100%)`}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '340px 420px' }}>
          <Img src={img('model1.png')} style={{ position: 'absolute', width: 1080, left: -255, top: 150 }} />
        </div>
      </Frame>
      <Words text="Your|daily" x={60} width={280} align="left" y={1250} start={B(4)} end={E} font="serif" size={48} weight={500} italic tone="burgundy" stagger={0.14} gap={10} />
      <Words text="moment|of" x={60} width={280} align="left" y={1310} start={B(4) + 0.35} end={E} font="serif" size={48} weight={500} italic tone="burgundy" stagger={0.14} gap={10} />
      <Words text="warmth." x={60} width={280} align="left" y={1370} start={B(4) + 0.7} end={E} font="serif" size={48} weight={600} italic tone="ruby" />
      <Underline x={64} y={1450} w={200} start={B(5)} end={E} from="left" dur={1.0} />
      <Words text="ប្រចាំថ្ងៃរបស់អ្នក" x={60} width={280} align="left" y={1470} start={B(5) + 0.2} end={E} font="khSans" size={30} weight={600} tone="espresso" stagger={0.2} gap={8} />
    </>
  );
};

/* 08 · HIGHLIGHTS — model 2 over a ruby disc, three floating glass feature cards ─────────────── */
const FEATURES: [string, string, string][] = [
  ['drop', 'គ្មានជាតិខ្លាញ់', 'TRANS FAT-FREE'],
  ['flask', 'មិនបន្ថែមរសជាតិសិប្បនិម្មិត', 'NO ADDED ARTIFICIAL FLAVOURING'],
];
const FeatureCard: React.FC<{ i: number; start: number; end: number }> = ({ i, start, end }) => {
  const t = useTime();
  const [icon, kh, en] = FEATURES[i];
  const draw = cubicInOut(prog(t, start + 0.2, 0.9));
  return (
    <Glass x={50} y={660 + i * 210} w={505} h={170} start={start} end={end} dx={-260} dy={0} r={40} phase={i * 1.3}>
      <div style={{ position: 'absolute', left: 24, top: 25, width: 120, height: 120, borderRadius: '50%', background: SC.ruby, boxShadow: `inset 0 0 0 2px ${SC.champagne}` }} />
      <svg width={120} height={120} viewBox="-28 -28 120 120" style={{ position: 'absolute', left: 24, top: 25 }}>
        <g style={{ strokeDasharray: 300, strokeDashoffset: 300 * (1 - draw) } as React.CSSProperties}>{SICONS[icon]}</g>
      </svg>
      <div style={{ position: 'absolute', left: 160, top: 40, fontFamily: SF.khSans, fontWeight: 700, fontSize: 32, color: SC.burgundy, lineHeight: 1.45, whiteSpace: 'nowrap' }}>{kh}</div>
      <div style={{ position: 'absolute', left: 160, top: 95, fontFamily: SF.sans, fontWeight: 600, fontSize: 16, letterSpacing: 2, color: SC.gold, whiteSpace: 'nowrap' }}>{en}</div>
    </Glass>
  );
};
export const HighlightsScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const t = useTime();
  const E = L + 1;
  const d = expoOut(prog(t, 0.05, 1.1));
  return (
    <>
      <Ivory t0={t0} lines={false} />
      <div style={{ position: 'absolute', left: 740 - 440 * d, top: 1120 - 440 * d, width: 880 * d, height: 880 * d, borderRadius: '50%', background: `radial-gradient(circle at 45% 40%, #B0242F 0%, ${SC.ruby} 50%, ${SC.burgundy} 100%)`, zIndex: 1 }} />
      <Ring cx={740} cy={1120} r={470} start={0.4} end={E} dashed opacity={0.8} />
      <Product src={img('model2.png')} x={770} y={1300} w={1150} start={0.1} end={E} dx={160} dy={0} s0={0.96} blur0={12} bob={3} push={0.015} shadow="none" z={3} />
      <Label text="PRODUCT HIGHLIGHTS" y={170} start={0.4} end={E} />
      <Words text="ជម្រើសល្អ" y={210} start={B(1)} end={E} size={88} tone="espresso" />
      <Words text="សម្រាប់រាល់ថ្ងៃ" y={325} start={B(2)} end={E} size={65} tone="ruby" stagger={0.2} gap={16} />
      {FEATURES.map((_, i) => <FeatureCard key={i} i={i} start={B(2.5) + i * 0.33} end={E} />)}
    </>
  );
};

/* 09 · FINAL — ivory over a rising burgundy horizon: logo, pack, cup, sachet, ginger, CTA ─────── */
export const FinalScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const t = useTime();
  const E = L + 2;
  const h = expoOut(prog(t, 0.1, 1.2));
  return (
    <>
      <Ivory t0={t0} lines={false} />
      <div style={{ position: 'absolute', left: -300, top: 1260 + 700 * (1 - h), width: 1680, height: 1500, borderRadius: '50%', background: `radial-gradient(ellipse 60% 40% at 50% 10%, #A41E2A 0%, ${SC.ruby} 35%, ${SC.burgundy} 80%)`, zIndex: 1, boxShadow: `0 -2px 0 ${SC.champagne}, 0 -20px 60px ${rgba(SC.gold, 0.25)}` }} />
      <Ring cx={540} cy={1040} r={420} start={0.3} end={E} dur={1.3} width={2} />
      <Product src={img('pack.png')} mask={PACK_MASK} x={540} y={1040} w={600} start={0.1} end={E} dur={1.3} dy={240} s0={0.75} sheen={[1.8, 3.8]} shadow="none" bob={6} z={4} />
      <Product src={img('sachet.png')} x={850} y={1130} w={210} start={0.5} end={E} dur={1.3} dx={240} dy={40} r0={30} rot={7} sheen={[2.2]} shadow="none" bob={8} phase={1} mb={30} z={3} />
      <Product src={img('cup.png')} x={290} y={1330} w={480} start={0.8} end={E} dur={1.3} dx={-240} dy={40} sheen={[2.5]} shadow="none" bob={6} phase={2} mb={30} z={6} />
      <Product src={img('ginger2.png')} x={850} y={1440} w={260} start={1.1} end={E} dy={160} r0={20} rot={-6} shadow="drop" bob={7} phase={3} z={7} />
      <Product src={spr('bean2.png')} x={120} y={900} w={100} start={1.3} end={E} dy={100} r0={40} shadow="drop" bob={10} phase={4} z={2} />
      <Product src={img('logo-brand.png')} x={540} y={240} w={430} start={B(2)} end={E} dur={1.3} dy={-50} s0={0.8} blur0={18} sheen={[1.2, 2.8]} shadow="drop" bob={3} z={8} />
      <Words text="បទពិសោធន៍ថ្មី|កាហ្វេខ្ញី 5IN1" y={410} start={B(3) + 0.3} end={E} size={80} tone="ruby" stagger={0.3} gap={20} depth />
      <Label text="GOLEX — THE GOLDEN GINGER EXPERIENCE" y={1600} start={B(5)} end={E} tone="ivory" size={23} tracking={5} />
      <Cta text="បញ្ជាទិញឥឡូវនេះ" y={1680} start={B(6)} end={E} w={560} h={96} />
      <Label text="HALAL  ·  MeSTI  ·  ISO 9001  ·  ISO 22000" y={1830} start={B(7)} end={E} tone="ivory" size={15} tracking={4} dash={false} />
    </>
  );
};
