/**
 * Royal Silk · សូត្រមាស — scene choreography.
 * All times are local to the scene (0 = the scene's downbeat). B(k) = k-th beat of the scene.
 * `E` = "until the scene ends" (the Shell handles the exit transition).
 */
import React from 'react';
import { Glow, ICONS, Steam } from '../promo/parts';
import { LogoSheen } from '../components/LogoSheen';
import { Sparkle } from '../components/Sparkle';
import { COLORS, rgba } from '../theme/colors';
import { useTime } from '../lib/useTime';
import { ArchCard, Callout, Chip, CircleDraw, Cta, EnTrack, Item, KhWords, Lotus, Orbit, OrbitPath, OutlineDraw, PACK_MASK, Pour, cubicOut, img, prog, spr } from './kit';
import { BEAT } from './timeline';
import { LF } from './fonts';

export type SceneProps = { L: number };
const B = (k: number) => +(k * BEAT).toFixed(3);

/* 01 · INTRO — the golden circle draws, the logo pulls from blur into focus ───────────── */
export const IntroScene: React.FC<SceneProps> = ({ L }) => {
  const E = L + 1;
  return (
    <>
      <Glow cx={540} cy={860} r={620} start={0.4} end={E} strength={0.75} />
      <CircleDraw cx={540} cy={860} r={330} start={0.15} dur={1.5} end={E} width={3} />
      <CircleDraw cx={540} cy={860} r={390} start={0.45} dur={1.6} end={E} width={1.2} halo={false} from={90} />
      <Item src={img('logo.png')} x={540} y={860} w={600} start={0.3} end={E} dur={1.3} dy={0} s0={1.35} blur0={40} ease="expo" bob={4} />
      <LogoSheen start={1.55} dur={0.9} box={{ left: 240, top: 860 - 179, width: 600, height: 358 }} />
      <Sparkle x={830} y={700} at={1.6} size={120} />
      <Sparkle x={250} y={1000} at={B(3)} size={80} />
      <Lotus y={1185} start={1.0} end={E} />
      <EnTrack text="THE GOLDEN GINGER EXPERIENCE" y={1250} start={1.15} end={E} size={36} tracking={7} ink="gold" />
      <KhWords text="កាហ្វេខ្ញី|ពិសេស" y={1320} start={1.55} end={E} size={40} family="khmer" weight={600} ink="cream" stagger={0.16} />
    </>
  );
};

/* 02 · TITLE — clean cream stage, Khmer kinetic headline on the beats ───────────────────── */
export const TitleScene: React.FC<SceneProps> = ({ L }) => {
  const E = L + 1;
  return (
    <>
      <Item src={spr('slice.png')} x={880} y={420} w={190} start={0.1} end={E} dur={1} dx={200} dy={-60} blur={6} r0={-60} spin={10} shadow={false} mb={30} />
      <Item src={spr('bean2.png')} x={170} y={1460} w={170} start={0.2} end={E} dur={1} dx={-200} dy={60} blur={8} r0={70} spin={-12} shadow={false} mb={30} />
      <Item src={spr('bean6.png')} x={900} y={1520} w={90} start={0.35} end={E} dur={1} dy={120} spin={20} />
      <KhWords text="បទពិសោធន៍" y={590} start={0.05} end={E} size={112} ink="ruby" />
      <KhWords text="ខ្ញី|មាស" y={790} start={B(1)} end={E} size={176} ink="bronze" stagger={0.2} gap={30} from="scale" />
      <Lotus y={1150} start={B(2)} end={E} color={COLORS.goldDeep} width={600} />
      <EnTrack text="THE GOLDEN GINGER EXPERIENCE" y={1215} start={B(2) + 0.1} end={E} size={26} family="micro" weight={500} tracking={10} ink="ruby" />
      <KhWords text="ខ្ញីបេនតុង|·|កាហ្វេពិសេស|·|ស្ករត្នោត" y={1290} start={B(3)} end={E} size={32} family="khmer" weight={600} ink="bronze" stagger={0.08} gap={14} />
    </>
  );
};

/* 03 · PACK — masked reveal, 2.5D turn, gold line traces the label; music lift at bar 2 swaps the copy ── */
export const PackScene: React.FC<SceneProps> = ({ L }) => {
  const t = useTime();
  const E = L + 1;
  const lift = 4 * BEAT; // 7.35 s global: the music opens up
  // masked product reveal: an arch window opens upward from the bottom of the pack
  const m = cubicOut(prog(t, 0.1, 1.0));
  const archTop = 1460 - 1240 * m;
  const punch = 1 + 0.045 * Math.exp(-(((t - lift) / 0.12) ** 2));
  return (
    <>
      <Glow cx={540} cy={900} r={760} start={0.1} end={E} />
      <CircleDraw cx={540} cy={900} r={500} start={0.3} dur={1.6} end={E} width={2} />
      <Orbit cx={540} cy={920} rx={470} ry={110} start={0.9} end={E} speed={32} tilt={-10} bodies={[
        { src: spr('bean1.png'), w: 90, a0: 0 },
        { src: spr('slice.png'), w: 110, a0: 120 },
        { src: spr('bean4.png'), w: 80, a0: 240 },
      ]} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, transform: `scale(${punch})`, transformOrigin: '540px 900px', WebkitClipPath: `inset(${Math.max(0, archTop)}px 0 0 0 round 400px 400px 0 0)`, clipPath: `inset(${Math.max(0, archTop)}px 0 0 0 round 400px 400px 0 0)` }}>
        <Item src={img('pack.png')} mask={PACK_MASK} x={540} y={900} w={760} start={0} end={E} dur={1.5} dy={180} s0={0.9} rotY0={-70} blur0={24} ease="expo" sway={5} bob={8} push={0.012} z={5} />
      </div>
      <OutlineDraw x={150} y={470} w={780} h={900} r={50} start={1.2} dur={1.2} end={lift + 0.2} />
      <Sparkle x={760} y={560} at={1.9} size={130} />
      <Sparkle x={300} y={1180} at={lift} size={120} />
      {/* bar 1: product identity */}
      <KhWords text="កាហ្វេខ្ញី|ឆុងរហ័ស" y={150} start={0.4} end={lift} size={50} family="khmer" weight={700} ink="cream" />
      <KhWords text="៥|ក្នុង|១" y={1430} start={0.8} end={lift} size={118} ink="gold" stagger={0.14} gap={36} />
      <EnTrack text="GINGER INSTANT COFFEE  5 IN 1" y={1650} start={1.2} end={lift} size={24} family="micro" weight={500} tracking={8} />
      {/* bar 2: emotional line on the lift */}
      <KhWords text="ឈ្ងុយឆ្ងាញ់|គ្រប់ការក្រេប" y={140} start={lift + 0.05} end={E} size={66} ink="gold" stagger={0.16} />
      <EnTrack text="Richness in every sip" y={1450} start={lift + 0.25} end={E} size={64} family="serif" italic tracking={1} ink="gold" stagger={0.03} />
      <Lotus y={1580} start={lift + 0.5} end={E} />
      <KhWords text="២៥|កញ្ចប់|·|១៩ក្រាម × ២៥|·|ទម្ងន់សុទ្ធ ៤៧៥ក្រាម" y={1630} start={lift + 0.8} end={E} size={28} family="khmer" weight={400} ink="cream" stagger={0.06} gap={12} />
    </>
  );
};

/* 04 · CUP — coffee pours, ingredients orbit the cup in 3D, steam rises ─────────────────── */
export const CupScene: React.FC<SceneProps> = ({ L }) => {
  const E = L + 1;
  const half = 4 * BEAT;
  const orbit = [
    { src: spr('bean2.png'), w: 120, a0: 0 },
    { src: spr('slice.png'), w: 140, a0: 60, spin: 25 },
    { src: spr('bean5.png'), w: 100, a0: 120 },
    { src: img('ginger1.png'), w: 170, a0: 180, spin: 12 },
    { src: spr('bean8.png'), w: 90, a0: 240 },
    { src: spr('slice.png'), w: 110, a0: 300, spin: -30 },
  ];
  return (
    <>
      <Glow cx={540} cy={1010} r={780} start={0.1} end={E} strength={0.85} />
      <OrbitPath cx={540} cy={1090} rx={470} ry={150} start={0.6} end={E} tilt={-8} />
      <Orbit cx={540} cy={1090} rx={470} ry={150} start={0.9} end={E} speed={36} tilt={-8} bodies={orbit} grow={1.2} />
      <Item src={img('cup.png')} x={540} y={1040} w={900} start={0} end={E} dur={1.2} dy={60} s0={1.3} blur0={26} ease="expo" bob={6} push={0.01} z={5} />
      <Pour x={560} surfaceY={985} start={0.25} dur={1.5} />
      <Steam cx={560} baseY={900} start={1.6} end={E} height={420} count={6} />
      <OrbitPath cx={540} cy={1090} rx={470} ry={150} start={0.6} end={E} tilt={-8} front />
      <Sparkle x={330} y={940} at={B(4)} size={110} />
      {/* beat-by-beat sensory words */}
      <KhWords text="ឈ្ងុយ|·|ខាប់|·|ឆ្ងាញ់" y={170} start={B(1)} end={half} size={92} ink="gold" stagger={BEAT / 2} gap={22} />
      <EnTrack text="AROMATIC  ·  RICH  ·  CREAMY" y={385} start={B(2) + 0.2} end={half} size={24} family="micro" weight={500} tracking={8} />
      {/* second bar: warmth */}
      <KhWords text="កក់ក្តៅ|និង|ផ្តល់ថាមពល" y={160} start={half + 0.05} end={E} size={70} ink="gold" stagger={0.14} gap={20} />
      <EnTrack text="Ginger infused. Coffee inspired." y={360} start={half + 0.35} end={E} size={46} family="serif" italic tracking={1} stagger={0.02} />
      <Lotus y={1450} start={half + 0.6} end={E} />
      <EnTrack text="DISCOVER THE PERFECT BLEND" y={1500} start={half + 0.8} end={E} size={26} family="micro" weight={500} tracking={9} ink="gold" />
    </>
  );
};

/* 05 · INGREDIENTS — three temple-arch cards float in on the beats ──────────────────────── */
export const IngredientsScene: React.FC<SceneProps> = ({ L }) => {
  const t = useTime();
  const E = L + 1;
  const bar2 = 4 * BEAT;
  // bar 2: the row drifts as one layered group (parallax push)
  const drift = cubicOut(prog(t, bar2, 2.2));
  return (
    <>
      <Glow cx={540} cy={1000} r={820} start={0.1} end={E} strength={0.5} />
      <Item src={spr('slice.png')} x={120} y={560} w={130} start={0.3} end={E} dur={1} dx={-150} blur={5} spin={14} shadow={false} />
      <Item src={spr('bean9.png')} x={980} y={1440} w={120} start={0.5} end={E} dur={1} dx={150} blur={7} spin={-16} shadow={false} />
      <KhWords text="គ្រឿងផ្សំ|ពិសេស" y={150} start={0.05} end={E} size={40} family="khmer" weight={600} ink="cream" stagger={0.12} />
      <KhWords text="ការលាយ|ដ៏ល្អ|ឥតខ្ចោះ" y={230} start={0.25} end={E} size={74} ink="gold" stagger={0.14} gap={18} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-30 * drift}px) scale(${1 + 0.03 * drift})`, transformOrigin: '540px 1000px' }}>
        <ArchCard x={200} y={1010} w={320} h={520} start={B(1)} end={E} src={img('ginger2.png')} imgW={330} kh="ខ្ញីបេនតុង" en="BENTONG GINGER" num="01" phase={0} tiltIn={-8} />
        <ArchCard x={540} y={950} w={320} h={520} start={B(2)} end={E} src={img('beans2.png')} imgW={300} kh="គ្រាប់កាហ្វេ" en="FINE COFFEE" num="02" phase={1.7} />
        <ArchCard x={880} y={1010} w={320} h={520} start={B(3)} end={E} src={img('palm1.png')} imgW={300} imgY={0.42} kh="ស្ករត្នោត" en="BROWN SUGAR" num="03" phase={3.1} tiltIn={8} />
      </div>
      <Lotus y={1395} start={bar2} end={E} />
      <KhWords text="ផលិតពីខ្ញីបេនតុង|គុណភាពខ្ពស់" y={1440} start={bar2 + 0.15} end={E} size={44} family="khmer" weight={700} ink="cream" stagger={0.15} gap={14} />
      <EnTrack text="PREMIUM BENTONG GINGER" y={1540} start={bar2 + 0.45} end={E} size={26} family="micro" weight={500} tracking={10} ink="gold" />
      <Sparkle x={250} y={760} at={B(2) + 0.2} size={90} />
      <Sparkle x={830} y={760} at={B(4)} size={90} />
      <Sparkle x={540} y={690} at={B(6)} size={110} />
    </>
  );
};

/* 06 · BENEFITS — sachet turns in, five claims (copied from the pack) on half-beats ────────── */
const stroke = { fill: 'none', stroke: COLORS.champagne, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const CLAIMS: [React.ReactNode, string][] = [
  [ICONS.heart, 'គ្មានកូឡេស្តេរ៉ុល'],
  [ICONS.drop, 'គ្មានជាតិខ្លាញ់បំប្លែង'],
  [ICONS.flask, 'គ្មានរសជាតិសិប្បនិម្មិត'],
  [ICONS.leaf, 'ខ្ញីបេនតុងគុណភាពខ្ពស់'],
  [<path key="s" {...stroke} d="M10 34 H54 C54 46 44 54 32 54 C20 54 10 46 10 34Z M20 30 C22 22 42 22 44 30" />, 'ស្ករត្នោតគុណភាពខ្ពស់'],
];
export const BenefitsScene: React.FC<SceneProps> = ({ L }) => {
  const E = L + 1;
  return (
    <>
      <Glow cx={250} cy={1040} r={600} start={0.1} end={E} />
      <CircleDraw cx={250} cy={1040} r={300} start={0.15} dur={1.2} end={E} width={2} />
      <Item src={img('sachet.png')} x={250} y={1040} w={330} start={0} end={E} dur={1} dx={-260} dy={0} rotY0={70} r0={-12} rot={-4} blur0={14} mb={50} sway={4} z={4} />
      <KhWords text="គុណភាព|ក្នុង|គ្រប់កញ្ចប់" y={160} start={0.05} end={E} size={64} ink="gold" stagger={0.12} gap={18} />
      <EnTrack text="GOODNESS IN EVERY SACHET" y={340} start={0.3} end={E} size={24} family="micro" weight={500} tracking={9} />
      {CLAIMS.map(([icon, text], i) => (
        <Chip key={text} x={440} y={560 + i * 150} w={610} start={0.2 + i * (BEAT / 2)} end={E} icon={icon} text={text} />
      ))}
    </>
  );
};

/* 07 · LIFESTYLE 1 — the model steps out of a gold temple arch ───────────────────────── */
export const Model1Scene: React.FC<SceneProps> = ({ L }) => {
  const t = useTime();
  const E = L + 1;
  const a = cubicOut(prog(t, 0.05, 0.9));
  return (
    <>
      {/* arch window: deep ruby glow inside, rises into place */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 560 + 200 * (1 - a),
          width: 840,
          height: 1360,
          borderRadius: '420px 420px 0 0',
          opacity: a,
          background: `radial-gradient(ellipse 70% 50% at 50% 35%, ${COLORS.crimson} 0%, ${COLORS.ruby} 45%, ${COLORS.burgundy} 100%)`,
          boxShadow: `0 0 80px ${rgba(COLORS.gold, 0.25)}`,
        }}
      />
      <OutlineDraw x={120} y={560} w={840} h={1500} arch start={0.15} dur={1.2} end={E} z={2} />
      <CircleDraw cx={540} cy={980} r={250} start={0.5} dur={1.1} end={E} width={1.5} halo={false} z={2} />
      <Item src={img('model1.png')} x={545} y={1400} w={1080} start={0} end={E} dur={1.1} dy={160} s0={0.94} blur0={18} ease="expo" bob={4} push={0.02} z={5} />
      <Sparkle x={420} y={1180} at={B(2)} size={120} />
      <KhWords text="ពេលវេលា|ដ៏កក់ក្តៅ" y={150} start={0.2} end={E} size={78} ink="gold" stagger={0.16} gap={20} />
      <KhWords text="ប្រចាំថ្ងៃ|របស់អ្នក" y={320} start={0.55} end={E} size={46} family="khmer" weight={600} ink="cream" stagger={0.14} gap={14} />
      <EnTrack text="Your daily moment of warmth" y={430} start={0.85} end={E} size={40} family="serif" italic tracking={1} ink="gold" stagger={0.02} />
    </>
  );
};

/* 08 · LIFESTYLE 2 — the music breathes: slow push, product callout on the cup ────────────── */
export const Model2Scene: React.FC<SceneProps> = ({ L }) => {
  const E = L + 1;
  return (
    <>
      <Glow cx={520} cy={1000} r={700} start={0.1} end={E} />
      <Item src={img('model2.png')} x={580} y={1270} w={1180} start={0} end={E} dur={1.1} dx={160} dy={0} s0={1.0} blur0={14} ease="expo" bob={3} push={0.025} mb={40} z={4} />
      <CircleDraw cx={520} cy={1015} r={140} start={0.45} dur={0.9} end={E} width={2.5} z={6} />
      <Callout x={430} y={935} tx={320} ty={770} start={0.9} end={E} kh="ក្លិនខ្ញីស្រស់" en="FRESH GINGER AROMA" side="left" />
      <KhWords text="ថាមពលថ្មី" y={150} start={0.15} end={E} size={92} ink="gold" />
      <KhWords text="សម្រាប់|ថ្ងៃថ្មី|របស់អ្នក" y={350} start={0.45} end={E} size={44} family="khmer" weight={600} ink="cream" stagger={0.12} gap={14} />
      <EnTrack text="ENERGIZING  ·  WARMING  ·  PREMIUM" y={455} start={0.8} end={E} size={22} family="micro" weight={500} tracking={7} ink="gold" />
      <Sparkle x={600} y={900} at={B(2)} size={110} />
    </>
  );
};

/* 09 · END CARD — hero line-up on the big hit, logo sheen, tagline + CTA ─────────────────── */
export const EndScene: React.FC<SceneProps> = ({ L }) => {
  const E = L + 2;
  return (
    <>
      <Glow cx={540} cy={960} r={860} start={0.05} end={E} strength={0.9} />
      <CircleDraw cx={540} cy={960} r={430} start={0.1} dur={1.2} end={E} width={2.5} />
      <CircleDraw cx={540} cy={960} r={500} start={0.3} dur={1.4} end={E} width={1} halo={false} from={90} />
      <Item src={img('logo.png')} x={540} y={250} w={470} start={0.35} end={E} dur={0.9} dy={-60} s0={0.8} blur0={20} bob={3} z={8} />
      <LogoSheen start={1.25} dur={0.9} box={{ left: 305, top: 250 - 140, width: 470, height: 280 }} />
      <Item src={img('pack.png')} mask={PACK_MASK} x={540} y={930} w={640} start={0} end={E} dur={1} dy={220} s0={0.7} blur0={20} sway={3} bob={6} z={4} />
      <Item src={img('sachet.png')} x={895} y={1000} w={230} start={0.15} end={E} dur={1} dx={260} dy={60} r0={30} rot={8} blur0={14} mb={40} bob={8} phase={1} z={3} />
      <Item src={img('cup.png')} x={290} y={1210} w={520} start={0.25} end={E} dur={1} dx={-260} dy={80} blur0={14} mb={40} bob={6} phase={2} z={6} />
      <Steam cx={300} baseY={1060} start={0.9} end={E} height={280} count={5} />
      <Item src={spr('slice.png')} x={830} y={1330} w={130} start={0.4} end={E} dy={120} spin={10} z={7} />
      <Item src={spr('bean2.png')} x={150} y={760} w={110} start={0.5} end={E} dy={120} blur={3} spin={-12} z={2} />
      <Sparkle x={760} y={640} at={0.9} size={130} />
      <Sparkle x={210} y={1100} at={1.6} size={100} />
      <KhWords text="បទពិសោធន៍|ខ្ញីមាស" y={1415} start={0.6} end={E} size={84} ink="gold" stagger={0.18} gap={22} />
      <EnTrack text="GOLEX — THE GOLDEN GINGER EXPERIENCE" y={1585} start={1.0} end={E} size={27} family="lux" tracking={4} ink="cream" stagger={0.015} />
      <Cta text="បញ្ជាទិញឥឡូវនេះ" y={1665} start={1.5} end={E} />
      <div style={{ position: 'absolute', left: 0, width: 1080, top: 1810, textAlign: 'center', fontFamily: LF.micro, fontWeight: 300, fontSize: 18, letterSpacing: 4, color: COLORS.cream, opacity: 0.8 }}>
        <FadeIn start={1.9}>HALAL · MeSTI · ISO 9001 · ISO 22000</FadeIn>
      </div>
    </>
  );
};

const FadeIn: React.FC<{ start: number; children: React.ReactNode }> = ({ start, children }) => {
  const t = useTime();
  const p = cubicOut(prog(t, start, 0.6));
  return <span style={{ opacity: p, display: 'inline-block', transform: `translateY(${10 * (1 - p)}px)` }}>{children}</span>;
};
