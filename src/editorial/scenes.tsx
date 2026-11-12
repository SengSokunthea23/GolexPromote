/**
 * GOLEX — Editorial Kinetic Typography Edition · scene choreography.
 * Khmer copy follows docs/khmer-text/GolexSoftLux.md scene by scene. Times are scene-local; B(k) = k beats.
 * Typography is the hero: oversized italic English words are the graphic layer; Khmer carries the message.
 */
import React from 'react';
import { Img } from 'remotion';
import { LogoSheen } from '../components/LogoSheen';
import { useTime } from '../lib/useTime';
import { Cta, PACK_MASK, Pour, img, spr } from '../lux/kit';
import { Steam } from '../promo/parts';
import { Product } from '../soft/kit';
import { Blob, Block, Caption, Card, Crop, Draw, EC, EF, Float, Giant, Paper, Ring, Silhouette, Underline, Wave, Words, cubicInOut, cubicOut, prog, rgba } from './kit';
import { B, E_PICKUP } from './timeline';

export type SceneProps = { L: number; t0: number };
const B0 = (k: number) => E_PICKUP + B(k); // opening: beats in video time (0.42, 1.02 downbeat, 1.62, 2.22…)

/* 01 · EDITORIAL BRAND INTRO — ivory grid, oversized italic "Ginger", morphing ruby shape, Khmer title ───── */
export const OpenScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const E = L + 1;
  return (
    <>
      <Paper t0={t0} tone="ivory" dots={[700, 160, 300, 220]} />
      <Blob cx={800} cy={1460} r={330} start={0.1} end={E} color={EC.ruby} seed={1} />
      <Blob cx={210} cy={1640} r={140} start={0.35} end={E} color={EC.softGold} seed={3} opacity={0.9} />
      <Giant text="Ginger" x={60} y={1080} size={330} start={0.2} end={E} color={EC.gold} outline z={2} />
      <Ring cx={800} cy={1460} r={380} start={0.5} end={E} />
      <Float src={spr('slice.png')} x={790} y={1430} w={230} start={B0(1) + 0.2} end={E} dy={-120} rot={-14} edge z={4} />
      <Float src={spr('bean2.png')} x={220} y={1620} w={120} start={B0(2)} end={E} dy={-80} rot={30} z={4} phase={2} />
      <Caption text="GOLEX  ·  PREMIUM QUALITY" y={230} start={0.1} end={E} />
      <Words text="បទពិសោធន៍ថ្មី" y={310} start={B0(0)} end={E} size={96} tone="espresso" />
      <Words text="កាហ្វេខ្ញី 5IN1" y={460} start={B0(1)} end={E} size={150} weight={900} tone="ruby" mode="scale" />
      <Underline x={300} y={770} w={480} start={B0(2)} end={E} />
      <Words text="The|Golden|Ginger|Experience" y={792} start={B0(2) + 0.1} end={E} font="serif" size={54} weight={500} italic tone="burgundy" stagger={0.08} gap={14} />
    </>
  );
};

/* 02 · PRODUCT INTRODUCTION — split screen: Khmer headline left, the pack resolves from silhouette on a ruby panel ─ */
export const SplitScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const E = L + 1;
  return (
    <>
      <Paper t0={t0} tone="cream" />
      <Block x={560} y={0} w={520} h={1920} start={0} end={E} color={EC.ruby} from="top" z={1}>
        <svg width={520} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
          {Array.from({ length: 36 }, (_, i) => <line key={i} x1={0} y1={i * 54} x2={520} y2={i * 54} stroke={EC.champagne} strokeWidth={1} />)}
        </svg>
      </Block>
      <Giant text="Discover" x={1040} y={150} size={170} start={0.15} end={E} color={EC.softGold} outline rotate={90} z={2} drift={0} />
      <Silhouette start={0.35} dur={0.9}>
        <Product src={img('pack.png')} mask={PACK_MASK} x={800} y={960} w={480} start={0.1} end={E} dur={1.0} dx={200} dy={0} s0={0.92} sheen={[1.4]} shadow="none" bob={6} z={4} />
      </Silhouette>
      <Caption text="DISCOVER" x={70} width={480} align="left" y={440} start={0.15} end={E} />
      <Words text="ស្វែងរក" x={70} width={480} align="left" y={500} start={B(1)} end={E} size={82} mode="slide" />
      <Words text="ពេលវេលា" x={70} width={480} align="left" y={630} start={B(1.5)} end={E} size={82} mode="slide" />
      <Words text="ដ៏ពិសេស" x={70} width={480} align="left" y={760} start={B(2)} end={E} size={82} tone="ruby" mode="slide" />
      <Underline x={74} y={935} w={280} start={B(2.5)} end={E} from="left" />
      <Words text="Discover|the|art" x={70} width={480} align="left" y={955} start={B(2.5) + 0.05} end={E} font="serif" size={44} weight={500} italic tone="burgundy" stagger={0.06} gap={10} />
      <Words text="of|richness." x={70} width={480} align="left" y={1008} start={B(2.5) + 0.2} end={E} font="serif" size={44} weight={600} italic tone="ruby" stagger={0.06} gap={10} />
      <Card x={70} y={1230} w={440} h={236} start={B(2)} end={E} from="left">
        <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: EF.sans, fontWeight: 700, fontSize: 15, letterSpacing: 5, color: EC.gold }}>NET WEIGHT 475 g</span>
          <span style={{ fontFamily: EF.khSans, fontWeight: 700, fontSize: 36, color: EC.ruby, lineHeight: 1.45 }}>២៥ កញ្ចប់ × ១៩ក្រាម</span>
          <span style={{ fontFamily: EF.khSans, fontWeight: 400, fontSize: 28, color: EC.espresso, lineHeight: 1.45 }}>ទម្ងន់សុទ្ធ ៤៧៥ក្រាម</span>
        </div>
      </Card>
    </>
  );
};

/* 03 · 5 IN 1 — burgundy, oversized "5 in 1" behind a cropped pack close-up, gold light sweep ──────────── */
export const MacroScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const push = 1 + 0.07 * cubicOut(t / L);
  const sw = (t - 0.9) / 0.9;
  return (
    <>
      <Paper t0={t0} tone="burgundy" dots={[60, 1300, 340, 200]} />
      <Giant text="5 in 1" x={0} y={40} size={260} start={0.05} end={E} color={EC.softGold} outline z={1} align="center" drift={0} stagger={0.06} />
      <Crop x={140} y={330} w={800} h={960} start={0.1} end={E} bg={EC.ruby} from="bottom" z={3}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '400px 480px' }}>
          <Img src={img('pack.png')} style={{ position: 'absolute', width: 1830, left: -680, top: -10 }} />
        </div>
        {sw > 0 && sw < 1 && <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(112deg, transparent ${sw * 160 - 45}%, ${rgba('#FFF4D6', 0.6)} ${sw * 160 - 30}%, transparent ${sw * 160 - 15}%)` }} />}
      </Crop>
      <Words text="កាហ្វេខ្ញី|៥ ក្នុង ១" y={1400} start={B(1)} end={E} size={84} tone="softGold" stagger={0.15} gap={24} />
      <Words text="ខាប់ និងឈ្ងុយឆ្ងាញ់|·|កក់ក្តៅ និងផ្តល់ថាមពល" y={1560} start={B(2)} end={E} font="khSans" size={32} weight={600} tone="ivory" stagger={0.1} gap={14} />
      <Caption text="5 IN 1 — ONE PERFECT EXPERIENCE." y={1670} start={B(2.5)} end={E} color={EC.champagne} size={18} tracking={5} />
    </>
  );
};

/* 04 · COFFEE EXPERIENCE — the cup in front of an oversized italic "Richness"; curved gold lines, steam ─── */
export const CupScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const E = L + 1;
  return (
    <>
      <Paper t0={t0} tone="ivory" />
      <Blob cx={540} cy={1060} r={430} start={0} end={E} color={EC.cream} seed={2} />
      <Giant text="Richness" x={0} y={640} size={250} start={0.05} end={E} color={EC.ruby} z={2} align="center" drift={12} />
      <Draw d={['M 80 1500 C 260 1300, 380 1640, 560 1460 S 900 1320, 1010 1480', 'M 120 600 C 300 480, 520 660, 700 520']} start={0.3} end={E} dur={1.2} z={3} />
      <Product src={img('cup.png')} x={540} y={1060} w={800} start={0} end={E} dur={1.0} dy={120} s0={0.85} sway={3} sheen={[1.3]} shadow="floor" shadowY={0.36} z={5} />
      <Pour x={558} surfaceY={1012} start={0.35} dur={0.8} />
      <Steam cx={558} baseY={930} start={1.0} end={E} height={360} count={5} />
      <Words text="ឈ្ងុយឆ្ងាញ់" y={190} start={B(1)} end={E} size={120} weight={900} tone="gold" mode="scale" />
      <Underline x={340} y={1560} w={400} start={B(2.5)} end={E} />
      <Words text="Richness|in|every|sip." y={1582} start={B(2.5) + 0.05} end={E} font="serif" size={58} weight={500} italic tone="espresso" stagger={0.07} gap={14} />
    </>
  );
};

/* 05 · TEXTURE (the music lifts) — ruby stage, crema in a circle, gold waveforms, ingredient photography ─── */
export const TextureScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const R = 360 * cubicOut(prog(t, 0.05, 0.8));
  return (
    <>
      <Paper t0={t0} tone="ruby" />
      <Blob cx={540} cy={860} r={470} start={0} end={E} color={EC.crimson} seed={4} opacity={0.55} />
      <Wave x={60} y={1230} w={960} amp={46} start={0.2} end={E} color={EC.champagne} lines={3} />
      <Ring cx={540} cy={860} r={392} start={0.25} end={E} color={EC.softGold} />
      <div style={{ position: 'absolute', left: 540 - R, top: 860 - R, width: R * 2, height: R * 2, borderRadius: '50%', overflow: 'hidden', zIndex: 3 }}>
        <div style={{ position: 'absolute', left: R - 400, top: R - 400, width: 800, height: 800, transform: `scale(${1 + 0.06 * (t / L)}) rotate(${t * 3}deg)` }}>
          <div style={{ position: 'absolute', inset: 0, background: EC.ruby }} />
          <Img src={img('cup.png')} style={{ position: 'absolute', width: 3520, left: 400 - 575 * 3.2, top: 400 - 312 * 3.2 }} />
        </div>
      </div>
      <Float src={spr('slice.png')} x={170} y={560} w={170} start={0.4} end={E} dx={-140} dy={0} rot={-15} edge z={5} />
      <Float src={spr('bean8.png')} x={910} y={1110} w={130} start={0.55} end={E} dx={140} dy={0} rot={40} z={5} phase={2} />
      <Caption text="ក្លិនក្រអូប  ·  ខាប់  ·  ឆ្ងាញ់" y={200} start={B(0.5)} end={E} font="khSans" color={EC.softGold} size={30} />
      <Words text="ខ្ញីស្រស់|·|កាហ្វេល្អ" y={1350} start={B(1)} end={E} size={84} tone="ivory" stagger={0.15} gap={20} />
      <Underline x={340} y={1510} w={400} start={B(2)} end={E} color={EC.softGold} />
      <Words text="Ginger|infused.|Coffee|inspired." y={1530} start={B(2) + 0.05} end={E} font="serif" size={50} weight={500} italic tone="softGold" stagger={0.06} gap={14} />
    </>
  );
};

/* 06 · INGREDIENT STORY — an editorial grid: cropped ingredient photos, numbered labels, thin gold connectors ─ */
const ING = [
  { n: '01', kh: 'ខ្ញីបេនតុង', en: 'BENTONG GINGER', d: 'កក់ក្តៅ និងផ្តល់ថាមពល', src: img('ginger2.png'), iw: 300 },
  { n: '02', kh: 'គ្រាប់កាហ្វេ', en: 'COFFEE BEANS', d: 'ឈ្ងុយ និងខាប់', src: img('beans2.png'), iw: 300 },
  { n: '03', kh: 'ស្ករត្នោត', en: 'BROWN SUGAR', d: 'ផ្អែមឈ្ងុយ', src: img('palm1.png'), iw: 290 },
];
const IngRow: React.FC<{ i: number; y: number; start: number; end: number }> = ({ i, y, start, end }) => {
  const t = useTime();
  const it = ING[i];
  const right = i === 1; // asymmetric: the middle photo sits on the right
  const px = right ? 610 : 70;
  const tx = right ? 70 : 530;
  const tp = cubicOut(prog(t, start + 0.35, 0.6));
  const lp = cubicInOut(prog(t, start + 0.25, 0.6));
  const life = t - start;
  if (t < start) return null;
  return (
    <>
      <Crop x={px} y={y} w={400} h={300} start={start} end={end} bg={i === 1 ? EC.ruby : EC.cream} from={right ? 'right' : 'left'} z={3}>
        <Img src={it.src} style={{ position: 'absolute', left: 200 - it.iw / 2, top: 150 - it.iw * 0.42, width: it.iw, transform: `translateY(${6 * Math.sin(life * 1.6 + i)}px) rotate(${2 * Math.sin(life + i)}deg)`, filter: `drop-shadow(0 14px 14px ${rgba(EC.burgundy, 0.3)})` }} />
      </Crop>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: 4, overflow: 'visible', opacity: tp }}>
        <line x1={right ? 590 : 490} y1={y + 150} x2={right ? 590 - 40 * lp : 490 + 30 * lp} y2={y + 150} stroke={EC.gold} strokeWidth={2} />
        <circle cx={right ? 594 : 486} cy={y + 150} r={4} fill={EC.gold} />
      </svg>
      <div style={{ position: 'absolute', left: tx, top: y + 10, width: 470, zIndex: 5, opacity: tp * (t > end - 0.3 ? 0 : 1), transform: `translateX(${(right ? -30 : 30) * (1 - tp)}px)`, textAlign: right ? 'right' : 'left' }}>
        <div style={{ fontFamily: EF.display, fontStyle: 'italic', fontWeight: 500, fontSize: 52, color: EC.gold, lineHeight: 1 }}>{it.n}</div>
        <div style={{ fontFamily: EF.khSerif, fontWeight: 700, fontSize: 56, color: EC.ruby, lineHeight: 1.6 }}>{it.kh}</div>
        <div style={{ fontFamily: EF.sans, fontWeight: 700, fontSize: 16, letterSpacing: 5, color: EC.gold }}>{it.en}</div>
        <div style={{ fontFamily: EF.khSans, fontWeight: 400, fontSize: 28, color: EC.espresso, lineHeight: 1.6 }}>{it.d}</div>
      </div>
    </>
  );
};
export const IngredientsScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const E = L + 1;
  return (
    <>
      <Paper t0={t0} tone="cream" dots={[780, 1600, 260, 200]} />
      <Caption text="INGREDIENTS" y={140} start={0.15} end={E} />
      <Words text="ផលិតពីខ្ញីបេនតុង" y={180} start={B(0.5)} end={E} size={70} tone="espresso" />
      <Words text="គុណភាពខ្ពស់" y={295} start={B(1.5)} end={E} size={70} tone="ruby" />
      <Words text="Premium|Bentong|ginger." y={425} start={B(2)} end={E} font="serif" size={44} weight={500} italic tone="burgundy" stagger={0.07} gap={10} />
      <IngRow i={0} y={540} start={B(2.5)} end={E} />
      <IngRow i={1} y={900} start={B(3.5)} end={E} />
      <IngRow i={2} y={1260} start={B(4.5)} end={E} />
      <Caption text="ខ្ញី · កាហ្វេ · ស្ករត្នោត" y={1680} start={B(6)} end={E} font="khSans" size={30} />
    </>
  );
};

/* 07 · LIFESTYLE — editorial split: the model on a ruby panel, oversized "Warmth" crossing in front ──────── */
export const Model1Scene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const push = 1 + 0.05 * cubicOut(t / L);
  return (
    <>
      <Paper t0={t0} tone="ivory" />
      <Crop x={400} y={620} w={680} h={1300} start={0} end={E} bg={EC.ruby} from="right" border={false} z={2}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '340px 300px' }}>
          <Img src={img('model1.png')} style={{ position: 'absolute', width: 1080, left: -255, top: 170 }} />
        </div>
      </Crop>
      <Giant text="Warmth" x={40} y={500} size={230} start={0.3} end={E} color={EC.softGold} z={4} drift={14} />
      <Wave x={60} y={1640} w={300} amp={18} start={0.6} end={E} lines={2} freq={2} />
      <Caption text="YOUR MOMENT" x={70} width={600} align="left" y={170} start={0.15} end={E} />
      <Words text="ពេលវេលា" x={70} width={960} align="left" y={210} start={B(0.5)} end={E} size={100} mode="slide" />
      <Words text="ដ៏កក់ក្តៅ" x={70} width={960} align="left" y={370} start={B(1.5)} end={E} size={100} tone="ruby" mode="slide" />
      <Words text="ប្រចាំថ្ងៃរបស់អ្នក" x={60} width={330} align="left" y={1200} start={B(2.5)} end={E} font="khSans" size={32} weight={600} tone="espresso" />
      <Underline x={64} y={1280} w={200} start={B(3)} end={E} from="left" />
      <Words text="Your|moment" x={60} width={330} align="left" y={1305} start={B(3) + 0.05} end={E} font="serif" size={48} weight={500} italic tone="burgundy" stagger={0.08} gap={10} />
      <Words text="of|warmth." x={60} width={330} align="left" y={1365} start={B(3) + 0.25} end={E} font="serif" size={48} weight={600} italic tone="ruby" stagger={0.08} gap={10} />
    </>
  );
};

/* 08 · PRODUCT HIGHLIGHTS — clean grid, model 2 on a ruby circle, minimal line-icon feature rows ─────────── */
const FEATURES: [string[], string, string][] = [
  [['M 22 8 C 22 8 8 24 8 32 A 14 14 0 0 0 36 32 C 36 24 22 8 22 8 Z', 'M 6 6 L 38 38'], 'គ្មានជាតិខ្លាញ់', 'TRANS FAT-FREE'],
  [['M 17 6 H 27 M 19 6 V 18 L 8 36 A 3 3 0 0 0 11 40 H 33 A 3 3 0 0 0 36 36 L 25 18 V 6', 'M 6 6 L 38 38'], 'គ្មានសារធាតុបន្ថែម', 'NO ADDED ARTIFICIAL FLAVOURING'],
];
const Feature: React.FC<{ i: number; start: number; end: number }> = ({ i, start, end }) => {
  const t = useTime();
  const [paths, kh, en] = FEATURES[i];
  const p = cubicInOut(prog(t, start + 0.15, 0.7));
  const y = 680 + i * 200;
  return (
    <Card x={50} y={y} w={520} h={160} start={start} end={end} from="left">
      <div style={{ position: 'absolute', left: 24, top: 24, width: 112, height: 112, borderRadius: '50%', background: EC.ruby }} />
      <svg width={112} height={112} viewBox="-12 -12 68 68" style={{ position: 'absolute', left: 24, top: 24 }}>
        {paths.map((d, j) => <path key={j} d={d} fill="none" stroke={EC.softGold} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />)}
      </svg>
      <div style={{ position: 'absolute', left: 160, top: 32, fontFamily: EF.khSans, fontWeight: 700, fontSize: 32, color: EC.ruby, lineHeight: 1.45, whiteSpace: 'nowrap' }}>{kh}</div>
      <div style={{ position: 'absolute', left: 162, top: 92, fontFamily: EF.sans, fontWeight: 700, fontSize: 14, letterSpacing: 2, color: EC.gold, whiteSpace: 'nowrap' }}>{en}</div>
    </Card>
  );
};
export const HighlightsScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const t = useTime();
  const E = L + 1;
  const d = cubicOut(prog(t, 0.05, 0.9));
  return (
    <>
      <Paper t0={t0} tone="ivory" dots={[60, 1560, 360, 240]} />
      <div style={{ position: 'absolute', left: 760 - 430 * d, top: 1150 - 430 * d, width: 860 * d, height: 860 * d, borderRadius: '50%', background: EC.ruby, zIndex: 1 }} />
      <Ring cx={760} cy={1150} r={470} start={0.3} end={E} />
      <Product src={img('model2.png')} x={770} y={1310} w={1150} start={0.05} end={E} dx={140} dy={0} s0={0.97} blur0={10} bob={3} push={0.012} shadow="none" z={3} />
      <Caption text="PRODUCT HIGHLIGHTS" y={160} start={0.15} end={E} />
      <Words text="ជម្រើសល្អ" y={200} start={B(0.5)} end={E} size={88} tone="espresso" />
      <Words text="សម្រាប់រាល់ថ្ងៃ" y={325} start={B(1)} end={E} size={65} tone="ruby" />
      <Giant text="Pure" x={60} y={440} size={160} start={0.4} end={E} color={EC.gold} outline z={2} drift={8} />
      {FEATURES.map((_, i) => <Feature key={i} i={i} start={B(1.5) + i * 0.3} end={E} />)}
    </>
  );
};

/* 09 · FINAL COMPOSITION — ivory over a rising burgundy band, oversized "Golden", products, logo sweep, CTA ── */
export const FinalScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const E = L + 2;
  return (
    <>
      <Paper t0={t0} tone="ivory" />
      <Block x={0} y={1200} w={1080} h={720} start={0.05} end={E} color={EC.burgundy} from="bottom" z={1}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 3, background: EC.champagne }} />
      </Block>
      <Giant text="Golden" x={0} y={640} size={290} start={0.1} end={E} color={EC.gold} outline z={2} align="center" drift={10} />
      <Ring cx={540} cy={1020} r={400} start={0.3} end={E} />
      <Product src={img('pack.png')} mask={PACK_MASK} x={540} y={1030} w={580} start={0.1} end={E} dur={1.0} dy={200} s0={0.8} sheen={[1.6, 3.4]} shadow="none" bob={5} z={4} />
      <Product src={img('sachet.png')} x={850} y={1120} w={200} start={0.35} end={E} dur={1.0} dx={220} dy={30} r0={25} rot={7} sheen={[1.9]} shadow="none" bob={7} phase={1} mb={24} z={3} />
      <Product src={img('cup.png')} x={290} y={1320} w={460} start={0.55} end={E} dur={1.0} dx={-220} dy={30} sheen={[2.2]} shadow="none" bob={5} phase={2} mb={24} z={6} />
      <Float src={img('ginger2.png')} x={860} y={1430} w={240} start={0.8} end={E} dy={140} rot={-6} edge z={7} phase={3} />
      <Float src={spr('bean2.png')} x={140} y={890} w={100} start={1.0} end={E} dy={100} rot={40} z={2} phase={4} />
      <Product src={img('logo-brand.png')} x={540} y={240} w={420} start={B(2)} end={E} dur={1.0} dy={-40} s0={0.85} blur0={14} sheen={[1.0, 2.6]} shadow="drop" bob={3} z={8} />
      <LogoSheen start={B(2) + 0.9} dur={0.9} box={{ left: 330, top: 118, width: 420, height: 244 }} />
      <Words text="បទពិសោធន៍ថ្មី|កាហ្វេខ្ញី 5IN1" y={405} start={B(3)} end={E} size={76} tone="ruby" stagger={0.2} gap={20} />
      <Caption text="GOLEX — THE GOLDEN GINGER EXPERIENCE" y={1600} start={B(5)} end={E} color={EC.cream} size={21} tracking={5} />
      <Cta text="បញ្ជាទិញឥឡូវនេះ" y={1680} start={B(6)} end={E} w={560} h={96} />
      <Caption text="HALAL  ·  MeSTI  ·  ISO 9001  ·  ISO 22000" y={1830} start={B(7)} end={E} color={EC.cream} size={14} tracking={4} dash={false} />
    </>
  );
};
