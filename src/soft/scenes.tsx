/**
 * GOLEX — Soft Luxury Edition · scene choreography (Khmer script edition).
 *
 * ON-SCREEN TEXT RULE: only words from the client's Khmer script appear in this video — no English
 * captions, no extra Khmer copy. The script, in order:
 *   Golexឥឡូវនេះមានចេញមួយរសជាតិថ្មីទៀតហេីយ គឺកាហ្វេGolex 5in1 (កាហ្វេខ្ញី) ដែលរួមផ្សំពី
 *   គ្រាប់ពូជកាហ្វេអារ៉ាប៊ីកា គ្រាប់ពូជកាហ្វេរ៉ូបាស្ដា ខ្ញីបេនតុង ស្ករត្នោតធម្មជាតិ និង គ្រីមធម្មជាតិ
 *   ក្លិនឈ្ងុយ រសជាតិឆ្ងាញ់ ប្រេនកូនខ្មែរ ផលិតនៅប្រទេសម៉ាឡេសុី ញាំមិនឆ្ងាញ់ធានាប្ដូរលុយវិញ។
 *   ឆុងអោយបានឆ្ងាញ់1កញ្ចប់ដាក់ទឹកពី60_70ml
 *
 * Times are local to each scene. Scenes 2–9 start on a beat, so B(k) = k (pace-scaled) beats in.
 * The opening scene starts at 0 s, before the first beat (S_PICKUP), so it uses B0(k).
 */
import React from 'react';
import { Img, staticFile } from 'remotion';
import { useTime } from '../lib/useTime';
import { Steam } from '../promo/parts';
import { Cta, Orbit, OrbitPath, PACK_MASK, Pour, img, spr } from '../lux/kit';
import { Frame, Glass, Ivory, Product, Ring, Ruby, Underline, Words, backOut, cubicInOut, cubicOut, expoOut, exitK, prog } from './kit';
import { SC, SF, rgba } from './theme';
import { S_PICKUP, beats } from './timeline';

export type SceneProps = { L: number; t0: number; pace: number };

/* 01 · OPENING — a GOLEX nameplate in the pack's colours (gold letters on ruby, gold frame), then
 *      "ឥឡូវនេះមានចេញ" above the gold line and "មួយរសជាតិថ្មីទៀតហេីយ" below it ──────────────────────── */
const GolexPlate: React.FC<{ cy: number; start: number; end: number }> = ({ cy, start, end }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const e = backOut(prog(t, start, 0.8), 1.3);
  const o = Math.min(1, prog(t, start, 0.25) * 4) * exitK(t, end, 0.35);
  const W = 640;
  const H = 210;
  const sw = (t - start - 1.0) / 0.9;
  const letters = 'GOLEX'.split('');
  return (
    <div style={{ position: 'absolute', left: 540 - W / 2, top: cy - H / 2, width: W, height: H, zIndex: 6, opacity: o, transform: `scale(${0.7 + 0.3 * e})`, filter: `drop-shadow(0 24px 30px ${rgba(SC.burgundy, 0.35)})` }}>
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: 30, overflow: 'hidden',
          background: `linear-gradient(180deg, #A41E2A 0%, ${SC.ruby} 55%, ${SC.burgundy} 100%)`,
          boxShadow: `inset 0 0 0 4px ${SC.gold}, inset 0 0 0 11px ${rgba(SC.burgundy, 0.6)}, inset 0 0 0 12.5px ${rgba(SC.softGold, 0.8)}`,
        }}
      >
        {sw > 0 && sw < 1 && <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(110deg, transparent ${sw * 160 - 50}%, ${rgba('#FFF4D6', 0.55)} ${sw * 160 - 35}%, transparent ${sw * 160 - 20}%)` }} />}
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, clipPath: 'inset(14px 14px 14px 14px round 22px)' }}>
        {letters.map((ch, i) => {
          const p = expoOut(prog(t, start + 0.2 + i * 0.07, 0.7));
          return (
            <span
              key={i}
              style={{
                display: 'inline-block', fontFamily: SF.brand, fontWeight: 700, fontSize: 150, lineHeight: 1, letterSpacing: 6,
                backgroundImage: `linear-gradient(180deg, #FFF3C4 0%, ${SC.softGold} 30%, ${SC.champagne} 55%, ${SC.gold} 80%, #8E6A2A 100%)`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                filter: `drop-shadow(0 4px 2px ${rgba('#1A0508', 0.55)})`,
                transform: `translateY(${110 * (1 - p)}%)`, opacity: Math.min(1, p * 2),
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
export const OpenScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const B0 = (k: number) => S_PICKUP + B(k); // beats in video time: 0.505, 1.172, 1.839 (downbeat), 2.505
  const t = useTime();
  const E = L + 1;
  const drift = -16 * cubicInOut(prog(t, 0, L));
  return (
    <>
      <Ivory t0={t0} cy={860} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${drift}px)` }}>
        <GolexPlate cy={545} start={0.1} end={E} />
        <Words text="ឥឡូវនេះមានចេញ" y={760} start={B0(1)} end={E} size={92} tone="espresso" />
        <Underline x={300} y={950} w={480} start={B0(1.5)} end={E} dur={0.6} />
        <Words text="មួយរសជាតិថ្មីទៀតហេីយ" y={975} start={B0(2)} end={E} size={94} weight={900} tone="gold" mode="scale" depth />
      </div>
      <Product src={spr('slice.png')} x={170} y={1500} w={140} start={B0(1) + 0.2} end={E} dx={-120} dy={40} r0={-50} rot={-10} shadow="drop" bob={10} phase={1} z={8} />
      <Product src={spr('bean2.png')} x={920} y={380} w={110} start={B0(2)} end={E} dx={100} dy={-40} r0={60} shadow="drop" bob={8} phase={2} z={8} />
    </>
  );
};

/* 02 · WHAT IT IS — "គឺកាហ្វេGolex / 5in1 / (កាហ្វេខ្ញី)" beside the pack on a ruby pill ──────────── */
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
      <Words text="គឺកាហ្វេGolex" x={60} width={540} align="left" y={560} start={B(1)} end={E} size={76} mode="slide" />
      <Words text="5in1" x={60} width={540} align="left" y={690} start={B(2)} end={E} size={170} weight={900} tone="ruby" mode="scale" />
      <Underline x={64} y={960} w={300} start={B(3)} end={E} from="left" dur={0.8} />
      <Words text="(កាហ្វេខ្ញី)" x={60} width={540} align="left" y={985} start={B(3)} end={E} size={72} tone="gold" mode="slide" />
    </>
  );
};

/* 03 · "ដែលរួមផ្សំពី" — the packaging up close, slow push and a gold sweep ─────────────────────────── */
export const MacroScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const t = useTime();
  const E = L + 1;
  const push = 1 + 0.07 * cubicOut(t / L);
  const pan = -40 * cubicInOut(t / L);
  const sw = [1.3, B(4) + 0.3].map((s) => (t - s) / 1.2).find((k) => k > 0 && k < 1) ?? -1;
  return (
    <>
      <Ivory t0={t0} />
      <Frame x={90} y={230} w={900} h={1080} r={60} start={0} end={E} dy={0} bg={SC.ruby}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${pan}px) scale(${push})`, transformOrigin: '450px 540px' }}>
          <Img src={img('pack.png')} style={{ position: 'absolute', width: 2060, left: -763, top: -10, translate: '30px -4.3px' }} />
        </div>
        {sw > 0 && sw < 1 && <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(115deg, transparent ${sw * 160 - 45}%, ${rgba('#FFF4D6', 0.55)} ${sw * 160 - 30}%, transparent ${sw * 160 - 15}%)` }} />}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 70%, ${rgba(SC.burgundy, 0.55)} 100%)` }} />
      </Frame>
      <Underline x={340} y={1420} w={400} start={B(1.5)} end={E} dur={0.8} />
      <Words text="ដែលរួមផ្សំពី" y={1450} start={B(2)} end={E} size={104} tone="ruby" mode="scale" />
    </>
  );
};

/* 04 · INGREDIENTS — the five ingredients from the script, one glass card each ──────────────────── */
/**
 * Natural cream — images/Cream2.png (603×566; the glass bowl sits at ≈ (275, 220), Ø ≈ 380 px).
 * The bowl is centred, turns slowly, and catches two soft glints so the white cream reads as rich and glossy.
 */
const CREAM_D = 196; // on-screen bowl diameter
const CREAM_K = CREAM_D / 380;
const CreamArt: React.FC<{ t: number }> = ({ t }) => {
  const g1 = Math.max(0, Math.sin(t * 2.2));
  const g2 = Math.max(0, Math.sin(t * 2.2 + 2.6));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0 }}>
      <Img
        src={staticFile('images/Cream2.png')}
        style={{
          position: 'absolute', width: 603 * CREAM_K, left: -275 * CREAM_K, top: -220 * CREAM_K,
          transformOrigin: `${275 * CREAM_K}px ${220 * CREAM_K}px`, transform: `rotate(${t * 9}deg)`,
          filter: `drop-shadow(0 14px 16px ${rgba(SC.burgundy, 0.45)}) saturate(1.05)`,
        }}
      />
      {[[-34, -40, g1], [40, 18, g2]].map(([x, y, a], i) => (
        <div key={i} style={{ position: 'absolute', left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: '50%', opacity: a * 0.9, background: 'radial-gradient(circle, #FFFFFF 0%, rgba(255,255,255,0.5) 30%, transparent 70%)' }} />
      ))}
    </div>
  );
};
const ING: { kh: string; src?: string; iw?: number; beans?: boolean; cream?: boolean; side: number }[] = [
  { kh: 'គ្រាប់ពូជកាហ្វេអារ៉ាប៊ីកា', src: img('beans2.png'), iw: 200, side: -1 },
  { kh: 'គ្រាប់ពូជកាហ្វេរ៉ូបាស្ដា', beans: true, side: 1 },
  { kh: 'ខ្ញីបេនតុង', src: img('ginger2.png'), iw: 210, side: -1 },
  { kh: 'ស្ករត្នោតធម្មជាតិ', src: img('palm1.png'), iw: 190, side: 1 },
  { kh: 'គ្រីមធម្មជាតិ', cream: true, side: -1 },
];
const IngredientRow: React.FC<{ i: number; y: number; start: number; end: number }> = ({ i, y, start, end }) => {
  const t = useTime();
  const it = ING[i];
  const ip = backOut(prog(t, start + 0.15, 0.8), 1.5);
  const life = t - start;
  return (
    <Glass x={70} y={y} w={940} h={250} start={start} end={end} dx={it.side * 320} dy={0} r={40} phase={i * 1.7}>
      <div
        style={{
          position: 'absolute', left: 28, top: 25, width: 200, height: 200, borderRadius: '50%',
          // the white cream needs a warm caramel stage to read; the other ingredients keep the cream stage
          background: it.cream
            ? `radial-gradient(circle at 40% 32%, #F1D3A0 0%, ${SC.champagne} 45%, ${SC.gold} 75%, #8E6A2A 100%)`
            : `radial-gradient(circle at 45% 40%, #FFFFFF 0%, ${SC.cream} 55%, ${SC.beige} 100%)`,
          boxShadow: it.cream
            ? `inset 0 0 0 3px ${SC.softGold}, inset 0 -18px 30px ${rgba('#5A3A10', 0.35)}, 0 0 24px ${rgba(SC.gold, 0.45)}`
            : `inset 0 0 0 1.5px ${rgba(SC.champagne, 0.8)}`,
        }}
      />
      <div style={{ position: 'absolute', left: 128, top: 125, width: 0, height: 0, transform: `scale(${0.5 + 0.5 * ip}) rotate(${3 * Math.sin(life * 1.2 + i)}deg) translateY(${4 * Math.sin(life * 1.6 + i)}px)`, opacity: Math.min(1, ip * 2) }}>
        {it.src && <Img src={it.src} style={{ position: 'absolute', width: it.iw, left: -(it.iw ?? 0) / 2, top: -(it.iw ?? 0) * 0.4, filter: `drop-shadow(0 14px 14px ${rgba(SC.burgundy, 0.3)})` }} />}
        {it.beans && (
          <>
            <Img src={spr('bean3.png')} style={{ position: 'absolute', width: 110, left: -100, top: -70, transform: 'rotate(-20deg)', filter: `drop-shadow(0 10px 10px ${rgba(SC.burgundy, 0.35)})` }} />
            <Img src={spr('bean6.png')} style={{ position: 'absolute', width: 120, left: -15, top: -25, transform: 'rotate(40deg)', filter: `drop-shadow(0 10px 10px ${rgba(SC.burgundy, 0.35)})` }} />
            <Img src={spr('bean9.png')} style={{ position: 'absolute', width: 80, left: -55, top: 25, transform: 'rotate(75deg)', filter: `drop-shadow(0 10px 10px ${rgba(SC.burgundy, 0.35)})` }} />
          </>
        )}
        {it.cream && <CreamArt t={life} />}
      </div>
      <div style={{ position: 'absolute', left: 260, top: 0, bottom: 0, right: 30, display: 'flex', alignItems: 'center', fontFamily: SF.khSerif, fontWeight: 700, fontSize: 50, color: SC.ruby, lineHeight: 1.6, whiteSpace: 'nowrap' }}>{it.kh}</div>
    </Glass>
  );
};
export const IngredientsScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const E = L + 1;
  return (
    <>
      <Ivory t0={t0} lines={false} />
      {ING.map((_, i) => <IngredientRow key={i} i={i} y={250 + i * 300} start={0.35 + i * 0.7} end={E} />)}
    </>
  );
};

/* 05 · "ក្លិនឈ្ងុយ" — ruby stage: the coffee pours, steam rises, ingredients orbit the cup ──────────── */
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
      <Steam cx={560} baseY={880} start={1.2} end={E} height={420} count={6} />
      <OrbitPath cx={540} cy={1120} rx={480} ry={150} start={0.5} end={E} tilt={-7} front />
      <Words text="ក្លិនឈ្ងុយ" y={190} start={B(2)} end={E} size={130} weight={900} tone="gold" mode="scale" depth />
    </>
  );
};

/* 06 · "រសជាតិឆ្ងាញ់" — macro of the crema in a circular lens, ingredients drift in depth ────────── */
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
      <Ring cx={540} cy={820} r={430} start={0.3} end={E} dur={1.2} width={2} />
      <Ring cx={540} cy={820} r={470} start={0.5} end={E} dashed opacity={0.7} />
      <div style={{ position: 'absolute', left: 540 - R, top: 820 - R, width: R * 2, height: R * 2, borderRadius: '50%', overflow: 'hidden', zIndex: 3, boxShadow: `0 40px 70px ${rgba(SC.burgundy, 0.35)}`, opacity: exitK(t, E, 0.35) }}>
        <div style={{ position: 'absolute', left: R - 400, top: R - 400, width: 800, height: 800, transform: `scale(${z}) rotate(${t * 2}deg)` }}>
          <div style={{ position: 'absolute', inset: 0, background: SC.ruby }} />
          <Img src={img('cup.png')} style={{ position: 'absolute', width: 3520, left: 400 - 575 * 3.2, top: 400 - 312 * 3.2 }} />
        </div>
        {sw > 0 && sw < 1 && <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(120deg, transparent ${sw * 160 - 45}%, ${rgba('#FFF4D6', 0.5)} ${sw * 160 - 30}%, transparent ${sw * 160 - 15}%)` }} />}
      </div>
      <Product src={spr('slice.png')} x={170} y={520} w={170} start={0.5} end={E} dx={-160} dy={0} r0={-40} rot={-15} shadow="drop" bob={12} phase={0.5} z={6} />
      <Product src={spr('bean8.png')} x={900} y={1110} w={130} start={0.7} end={E} dx={160} dy={0} r0={50} shadow="drop" bob={10} phase={2} z={6} />
      <div style={{ filter: 'blur(5px)' }}>
        <Product src={spr('bean2.png')} x={940} y={430} w={110} start={0.9} end={E} dy={60} shadow="none" bob={14} phase={3} z={2} />
        <Product src={spr('slice.png')} x={130} y={1180} w={120} start={1.0} end={E} dy={60} shadow="none" bob={14} phase={4} z={2} />
      </div>
      <Underline x={340} y={1330} w={400} start={B(1.5)} end={E} dur={0.8} />
      <Words text="រសជាតិឆ្ងាញ់" y={1360} start={B(2)} end={E} size={110} tone="ruby" mode="scale" />
    </>
  );
};

/* 07 · "ប្រេនកូនខ្មែរ" + "ផលិតនៅប្រទេសម៉ាឡេសុី" — Cambodia flag above the brand line, Malaysia flag beside the
 *      origin line, model in a tall rounded frame ─────────────────────────────────────────────────────── */
/** Flag images supplied in public/images (the files are SVG and WebP saved with a .png name; copies with the
 *  correct extension are used so the browser decodes them): Cambodia 1000×640, Malaysia 2:1. */
const FlagImg: React.FC<{ src: string }> = ({ src }) => <Img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />;
/** A flag that pops in and waves gently: subtle skew + a travelling light/shadow fold, gold hairline frame. */
const Flag: React.FC<{ x: number; y: number; w: number; h: number; start: number; end: number; phase?: number; children: React.ReactNode }> = ({ x, y, w, h, start, end, phase = 0, children }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const e = backOut(prog(t, start, 0.7), 1.5);
  const o = Math.min(1, prog(t, start, 0.25) * 4) * exitK(t, end, 0.35);
  const life = t - start;
  const fold = ((life * 0.45 + phase) % 1) * 160 - 30;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, zIndex: 6, opacity: o, transformOrigin: 'left center', transform: `scale(${0.4 + 0.6 * e}) perspective(800px) rotateY(${-8 * Math.sin(life * 1.6 + phase)}deg) skewY(${1.5 * Math.sin(life * 2.2 + phase)}deg)`, filter: `drop-shadow(0 10px 14px ${rgba(SC.burgundy, 0.3)})` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden', boxShadow: `inset 0 0 0 2px ${rgba(SC.gold, 0.9)}` }}>
        {children}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(100deg, transparent ${fold - 30}%, rgba(255,255,255,0.28) ${fold - 12}%, rgba(0,0,0,0.12) ${fold + 6}%, transparent ${fold + 24}%)` }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 8, boxShadow: `inset 0 0 0 2px ${rgba(SC.gold, 0.9)}` }} />
      </div>
    </div>
  );
};
export const Model1Scene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const t = useTime();
  const E = L + 1;
  const push = 1 + 0.06 * cubicOut(t / L);
  return (
    <>
      <Ivory t0={t0} lines={false} />
      <Flag x={74} y={110} w={156} h={100} start={0.15} end={E}><FlagImg src="images/Flag_of_Cambodia.svg" /></Flag>
      <Words text="ប្រេនកូនខ្មែរ" x={70} width={960} align="left" y={235} start={B(1)} end={E} size={110} mode="slide" />
      <Underline x={74} y={440} w={260} start={B(2)} end={E} from="left" dur={0.8} />
      <Flag x={74} y={492} w={110} h={55} start={B(2)} end={E} phase={0.4}><FlagImg src="images/Flag_of_Malaysia.webp" /></Flag>
      <Words text="ផលិតនៅប្រទេសម៉ាឡេសុី" x={204} width={860} align="left" y={470} start={B(2) + 0.1} end={E} size={56} tone="ruby" mode="slide" />
      <Frame x={340} y={680} w={680} h={1190} r={340} start={0.15} end={E} bg={`radial-gradient(ellipse 80% 60% at 50% 35%, #B0242F 0%, ${SC.ruby} 50%, ${SC.burgundy} 100%)`}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '340px 420px' }}>
          <Img src={img('model1.png')} style={{ position: 'absolute', width: 1080, left: -255, top: 150 }} />
        </div>
      </Frame>
      <Product src={spr('slice.png')} x={180} y={1300} w={150} start={B(2.5)} end={E} dx={-120} dy={0} r0={-30} shadow="drop" bob={10} phase={1} z={7} />
    </>
  );
};

/* 08 · "ញាំមិនឆ្ងាញ់ / ធានាប្ដូរលុយវិញ" — model 2 on a ruby disc, a gold guarantee seal (graphic only) ── */
const Seal: React.FC<{ cx: number; cy: number; start: number; end: number }> = ({ cx, cy, start, end }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const e = backOut(prog(t, start, 0.8), 1.6);
  const d = cubicInOut(prog(t, start + 0.3, 0.7));
  const o = Math.min(1, prog(t, start, 0.3) * 3) * exitK(t, end, 0.35);
  const teeth = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 ? 120 : 135;
    return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  });
  return (
    <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ position: 'absolute', left: cx - 150, top: cy - 150, zIndex: 6, opacity: o, transform: `scale(${e}) rotate(${-12 * (1 - e) + 3 * Math.sin(t * 1.2)}deg)`, filter: `drop-shadow(0 18px 24px ${rgba(SC.burgundy, 0.35)})` }}>
      <polygon points={teeth.join(' ')} fill={SC.gold} />
      <circle r={104} fill={SC.ruby} stroke={SC.softGold} strokeWidth={3} />
      <circle r={88} fill="none" stroke={SC.softGold} strokeWidth={1.5} strokeDasharray="3 8" transform={`rotate(${t * 15})`} />
      <path d="M -42 2 L -12 32 L 46 -30" fill="none" stroke={SC.softGold} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} />
    </svg>
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
      <Words text="ញាំមិនឆ្ងាញ់" y={190} start={B(1)} end={E} size={100} tone="espresso" />
      <Words text="ធានាប្ដូរលុយវិញ" y={350} start={B(2)} end={E} size={100} weight={900} tone="gold" mode="scale" depth />
      <Seal cx={220} cy={820} start={B(2.5)} end={E} />
    </>
  );
};

/** Rising burgundy horizon with a champagne edge — the product stage of the last two scenes. */
const Horizon: React.FC<{ top: number }> = ({ top }) => (
  <div style={{ position: 'absolute', left: -300, top, width: 1680, height: 1500, borderRadius: '50%', zIndex: 1, background: `radial-gradient(ellipse 60% 40% at 50% 10%, #A41E2A 0%, ${SC.ruby} 35%, ${SC.burgundy} 80%)`, boxShadow: `0 -2px 0 ${SC.champagne}, 0 -20px 60px ${rgba(SC.gold, 0.25)}` }} />
);

/* 09 · HOW TO BREW — "ឆុងអោយបានឆ្ងាញ់": the sachet pours into the cup, water pours in while a measuring
 *      glass fills to the gold 60–70 band; pill "1កញ្ចប់ដាក់ទឹកពី60_70ml" ─────────────────────────────── */
const CUP = { x: 470, y: 1180, w: 620 }; // cup.png 1100×733 → coffee surface ≈ (484, 1150)
const SURF = { x: 484, y: 1150 };
const BEAKER = { x: 790, top: 700, w: 170, bottom: 1300 }; // 0 → 100 ml over 500 px
const mlY = (ml: number) => BEAKER.bottom - 20 - (ml / 100) * 500;
const POUR = { powder: [1.15, 2.0], water: [2.05, 3.25] } as const;

/** Sachet floats in, tilts over the cup, shakes its powder out, then lifts away. */
const PouringSachet: React.FC<{ end: number }> = ({ end }) => {
  const t = useTime();
  if (t > end) return null;
  const pin = backOut(prog(t, 0.15, 0.7), 1.2);
  const tilt = cubicInOut(prog(t, 0.8, 0.35)) * (1 - cubicInOut(prog(t, 2.0, 0.35)));
  const away = cubicInOut(prog(t, 2.05, 0.45));
  const shake = t > POUR.powder[0] && t < POUR.powder[1] ? 3 * Math.sin(t * 40) : 0;
  return (
    <Img
      src={img('sachet.png')}
      style={{
        position: 'absolute', left: 650 - 75, top: 640 - 222, width: 150, zIndex: 6,
        opacity: Math.min(1, pin * 2) * (1 - away),
        transform: `translate(${60 * away}px, ${-200 * (1 - pin) - 140 * away}px) rotate(${-120 * tilt + shake}deg)`,
        filter: `drop-shadow(0 18px 18px ${rgba(SC.burgundy, 0.3)})`,
      }}
    />
  );
};
/** Coffee powder: a stream of brown grains falling from the sachet mouth into the cup. */
const Powder: React.FC = () => {
  const t = useTime();
  const [a, b] = POUR.powder;
  if (t < a || t > b + 0.6) return null;
  const mouth = { x: 458, y: 750 };
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
      {Array.from({ length: 60 }, (_, i) => {
        const born = a + (i / 60) * (b - a);
        const age = t - born;
        if (age < 0) return null;
        const y = mouth.y + 0.5 * 2600 * age * age + 120 * age;
        if (y > SURF.y) return null;
        const x = mouth.x + 14 * Math.sin(i * 7.3) + 10 * age * Math.sin(i);
        return <circle key={i} cx={x} cy={y} r={2.5 + (i % 3)} fill={i % 2 ? '#6B3A1E' : '#8A5530'} />;
      })}
    </svg>
  );
};
/** Clear water stream from above into the cup, with a ripple on the surface. */
const Water: React.FC = () => {
  const t = useTime();
  const [a, b] = POUR.water;
  const life = t - a;
  if (life < 0 || t > b + 0.6) return null;
  const top = -40;
  const head = Math.min(SURF.y, top + (SURF.y - top) * cubicOut(Math.min(1, life / 0.35)));
  const tail = t > b ? top + (SURF.y - top) * cubicOut(Math.min(1, (t - b) / 0.45)) : top;
  const pts: string[] = [];
  const wob = (yy: number) => 3 * Math.sin(yy * 0.03 + life * 16);
  for (let i = 0; i <= 20; i++) { const yy = tail + ((head - tail) * i) / 20; pts.push(`${SURF.x + wob(yy) - 7},${yy}`); }
  for (let i = 20; i >= 0; i--) { const yy = tail + ((head - tail) * i) / 20; pts.push(`${SURF.x + wob(yy) + 7},${yy}`); }
  const rip = ((life % 0.5) + 0.5) % 0.5 / 0.5;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
      <defs>
        <linearGradient id="waterG" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(150,195,225,0.55)" />
          <stop offset="0.5" stopColor="rgba(245,252,255,0.95)" />
          <stop offset="1" stopColor="rgba(150,195,225,0.55)" />
        </linearGradient>
      </defs>
      {head > tail + 2 && <polygon points={pts.join(' ')} fill="url(#waterG)" />}
      {life > 0.35 && t < b + 0.2 && <ellipse cx={SURF.x} cy={SURF.y} rx={20 + 110 * rip} ry={6 + 20 * rip} fill="none" stroke="#FFF6E8" strokeWidth={3} opacity={(1 - rip) * 0.8} />}
    </svg>
  );
};
/** Measuring glass: ticks every 10 ml, labels 60 and 70, a gold 60–70 band; fills while the water pours. */
const Beaker: React.FC<{ end: number }> = ({ end }) => {
  const t = useTime();
  if (t > end) return null;
  const pin = backOut(prog(t, 1.4, 0.7), 1.2);
  const fill = 65 * cubicInOut(prog(t, POUR.water[0], POUR.water[1] - POUR.water[0]));
  const band = cubicOut(prog(t, POUR.water[1] - 0.2, 0.5));
  const { x, top, w, bottom } = BEAKER;
  const lvl = mlY(fill);
  const o = Math.min(1, pin * 2) * exitK(t, end, 0.35);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 4, opacity: o, transform: `translateX(${120 * (1 - pin)}px)` }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id="beakerIn"><rect x={x + 6} y={top} width={w - 12} height={bottom - top - 6} rx={18} /></clipPath>
          <linearGradient id="beakerWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(205,232,248,0.85)" />
            <stop offset="1" stopColor="rgba(150,195,225,0.75)" />
          </linearGradient>
        </defs>
        <linearGradient id="beakerGold" x1="0" x2="1">
          <stop offset="0" stopColor="#8E6A2A" /><stop offset="0.3" stopColor={SC.softGold} /><stop offset="0.6" stopColor={SC.champagne} /><stop offset="1" stopColor="#8E6A2A" />
        </linearGradient>
        {/* soft gold glow behind the glass */}
        <ellipse cx={x + w / 2} cy={(top + bottom) / 2} rx={w * 0.95} ry={(bottom - top) * 0.55} fill={rgba(SC.softGold, 0.25)} filter="blur(30px)" />
        {/* gold 60–70 band across the glass */}
        <rect x={x} y={mlY(70)} width={w} height={mlY(60) - mlY(70)} fill={rgba(SC.softGold, 0.6 * band)} />
        {/* water */}
        <g clipPath="url(#beakerIn)">
          <rect x={x} y={lvl} width={w} height={bottom - lvl} fill="url(#beakerWater)" />
          <path d={`M ${x} ${lvl} Q ${x + w / 4} ${lvl - 5 * Math.sin(t * 6)} ${x + w / 2} ${lvl} T ${x + w} ${lvl}`} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={fill > 1 ? 0.9 : 0} />
        </g>
        {/* glass */}
        <rect x={x} y={top} width={w} height={bottom - top} rx={22} fill={rgba('#FFFFFF', 0.28)} stroke={rgba(SC.gold, 0.85)} strokeWidth={3} />
        <rect x={x + 14} y={top + 26} width={10} height={bottom - top - 70} rx={5} fill={rgba('#FFFFFF', 0.7)} />
        <rect x={x - 10} y={top - 12} width={w + 20} height={22} rx={11} fill="url(#beakerGold)" />
        <rect x={x - 22} y={bottom - 4} width={w + 44} height={26} rx={13} fill="url(#beakerGold)" />
        {/* ticks */}
        {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((ml) => (
          <line key={ml} x1={x + w} y1={mlY(ml)} x2={x + w - (ml % 50 === 0 ? 46 : 28)} y2={mlY(ml)} stroke={rgba(SC.gold, 0.9)} strokeWidth={2.5} />
        ))}
        {/* gold bracket + 60 / 70 tags on the left */}
        <path d={`M ${x - 26} ${mlY(70)} H ${x - 44} V ${mlY(60)} H ${x - 26}`} fill="none" stroke={SC.gold} strokeWidth={4} strokeLinejoin="round" opacity={band} />
        {[60, 70].map((ml) => (
          <g key={ml} opacity={0.35 + 0.65 * band}>
            <line x1={x} y1={mlY(ml)} x2={x + w} y2={mlY(ml)} stroke={SC.gold} strokeWidth={3} opacity={band} />
            <rect x={x - 146} y={mlY(ml) - 21 + (ml === 70 ? -12 : 12)} width={84} height={42} rx={21} fill={SC.ruby} stroke={SC.softGold} strokeWidth={2} />
            <text x={x - 104} y={mlY(ml) + 10 + (ml === 70 ? -12 : 12)} textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight={700} fontSize={28} fill={SC.softGold}>{ml}</text>
          </g>
        ))}
        {band > 0 && band < 1 && <circle cx={x + w / 2} cy={(mlY(60) + mlY(70)) / 2} r={30 + 60 * band} fill="none" stroke={SC.softGold} strokeWidth={3} opacity={1 - band} />}
      </svg>
    </div>
  );
};
export const BrewScene: React.FC<SceneProps> = ({ L, t0 }) => {
  const E = L + 1;
  return (
    <>
      <Ivory t0={t0} cy={1100} />
      <Horizon top={1330} />
      <div style={{ position: 'absolute', left: CUP.x - 360, top: 820, width: 720, height: 720, borderRadius: '50%', zIndex: 1, background: `radial-gradient(circle, ${rgba(SC.softGold, 0.55)} 0%, ${rgba(SC.champagne, 0.2)} 40%, transparent 70%)` }} />
      <Ring cx={CUP.x} cy={1120} r={330} start={0.2} end={E} dur={1.1} opacity={0.8} />
      <Ring cx={CUP.x} cy={1120} r={372} start={0.4} end={E} dashed opacity={0.55} />
      <Product src={img('cup.png')} x={CUP.x} y={CUP.y} w={CUP.w} start={0} end={E} dur={1.0} dy={120} s0={0.85} shadow="floor" shadowY={0.36} bob={0} z={3} />
      <PouringSachet end={E} />
      <Powder />
      <Water />
      <Beaker end={E} />
      <Steam cx={SURF.x} baseY={1060} start={3.0} end={E} height={360} count={6} />
      <Words text="ឆុងអោយបានឆ្ងាញ់" y={170} start={0.3} end={E} size={100} tone="ruby" mode="scale" depth z={8} />
      <Cta text="1កញ្ចប់ដាក់ទឹកពី60_70ml" y={1640} start={2.7} end={E} w={700} h={112} />
    </>
  );
};

/* 10 · FINAL — logo, the full product line-up on a burgundy horizon, gold "បញ្ជាទិញឥឡូវនេះ" pill ─────── */
export const FinalScene: React.FC<SceneProps> = ({ L, t0, pace }) => {
  const B = beats(pace);
  const t = useTime();
  const E = L + 2;
  const h = expoOut(prog(t, 0.1, 1.2));
  return (
    <>
      <Ivory t0={t0} lines={false} />
      <Horizon top={1260 + 700 * (1 - h)} />
      <Ring cx={540} cy={1040} r={420} start={0.3} end={E} dur={1.3} width={2} />
      <Product src={img('pack.png')} mask={PACK_MASK} x={540} y={1040} w={600} start={0.1} end={E} dur={1.3} dy={240} s0={0.75} sheen={[1.8, 3.4]} shadow="none" bob={6} z={4} />
      <Product src={img('sachet.png')} x={850} y={1130} w={210} start={0.5} end={E} dur={1.3} dx={240} dy={40} r0={30} rot={7} sheen={[2.2]} shadow="none" bob={8} phase={1} mb={30} z={3} />
      <Product src={img('cup.png')} x={290} y={1330} w={480} start={0.8} end={E} dur={1.3} dx={-240} dy={40} sheen={[2.5]} shadow="none" bob={6} phase={2} mb={30} z={6} />
      <Steam cx={300} baseY={1200} start={1.4} end={E} height={260} count={5} />
      <Product src={img('ginger2.png')} x={850} y={1440} w={260} start={1.1} end={E} dy={160} r0={20} rot={-6} shadow="drop" bob={7} phase={3} z={7} />
      <Product src={spr('bean2.png')} x={120} y={900} w={100} start={1.3} end={E} dy={100} r0={40} shadow="drop" bob={10} phase={4} z={2} />
      <Product src={img('logo-brand.png')} x={540} y={300} w={520} start={B(1)} end={E} dur={1.2} dy={-50} s0={0.8} blur0={18} sheen={[1.1, 2.7]} shadow="drop" bob={3} z={8} />
      <Cta text="បញ្ជាទិញឥឡូវនេះ" y={1660} start={B(3)} end={E} w={620} h={116} />
    </>
  );
};
