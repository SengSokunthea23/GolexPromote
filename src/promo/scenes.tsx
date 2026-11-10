import React from 'react';
import { Img, staticFile } from 'remotion';
import { AnamorphicFlare } from '../components/AnamorphicFlare';
import { GoldText } from '../components/GoldText';
import { KineticText } from '../components/KineticText';
import { Line } from '../components/Line';
import { LogoSheen } from '../components/LogoSheen';
import { Reveal } from '../components/Reveal';
import { RingWipe } from '../components/RingWipe';
import { RuleLabel } from '../components/RuleLabel';
import { Sparkle } from '../components/Sparkle';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { BenefitRow, CtaButton, Drifter, Glow, GoldRings, Hero, Label, Medallion, Steam, asset } from './parts';

type S = { L: number; khmer?: boolean };
const spr = (n: string) => staticFile(`sprites/${n}`);

/* 0 · LOGO REVEAL ─────────────────────────────────────────── */
export const LogoScene: React.FC<S> = ({ L, khmer = false }) => (
  <>
    <AnamorphicFlare y={900} end={0.95} />
    <Glow cx={540} cy={900} r={650} start={0.3} end={L} />
    <GoldRings cx={540} cy={900} r={400} start={0.9} end={L} opacity={0.8} />
    <Hero src={asset('logo.png')} cx={540} cy={900} w={700} start={0.55} end={L} ein={1.3} scale0={0.8} rise={30} float={6} />
    <LogoSheen start={1.7} box={{ left: 190, top: 691, width: 700, height: 418 }} />
    <Sparkle x={830} y={760} at={1.55} />
    <Sparkle x={260} y={1030} at={1.95} />
    <KineticText text={khmer ? 'បទពិសោធន៍ខ្ញីមាស' : 'The Golden Ginger'} top={1250} start={1.2} end={L} size={khmer ? 76 : 86} family={khmer ? 'khmer' : 'serif'} italic={!khmer} stagger={khmer ? 0 : 0.032} />
    <Line top={1380}>
      <Reveal start={1.75} end={L} mode="wipe" ein={0.9}>
        <GoldText family={khmer ? 'khmer' : 'sans'} weight={500} size={khmer ? 34 : 30} tracking={khmer ? 0 : 20} variant="cream">
          {khmer ? 'បទពិសោធន៍' : 'EXPERIENCE'}
        </GoldText>
      </Reveal>
    </Line>
    <RuleLabel text={khmer ? 'កាហ្វេខ្ញី ៥ ក្នុង ១' : 'GINGER INSTANT COFFEE  5 IN 1'} top={1500} start={2.05} end={L} family={khmer ? 'khmer' : 'micro'} weight={500} size={khmer ? 24 : 22} tracking={khmer ? 0 : 5} lineLength={50} />
  </>
);

/* 1 · CUP HERO ────────────────────────────────────────────── */
export const CupScene: React.FC<S> = ({ L, khmer = false }) => (
  <>
    <Glow cx={540} cy={960} r={760} start={0.1} end={L} />
    <Drifter src={spr('bean2.png')} w={170} from={[930, 560]} to={[890, 440]} start={0.5} end={L} blur={3} rot0={-20} rotSpeed={14} />
    <Drifter src={spr('bean5.png')} w={120} from={[140, 720]} to={[170, 580]} start={0.4} end={L} rot0={40} rotSpeed={-16} />
    <Drifter src={spr('bean8.png')} w={86} from={[960, 1260]} to={[930, 1150]} start={0.7} end={L} rot0={60} rotSpeed={-10} />
    <Drifter src={spr('bean7.png')} w={210} from={[90, 1320]} to={[120, 1230]} start={0.5} end={L} blur={9} opacity={0.9} rot0={10} rotSpeed={8} z={5} />
    <Drifter src={asset('ginger1.png')} w={170} from={[920, 900]} to={[950, 800]} start={0.6} end={L} rot0={-15} rotSpeed={9} />
    <Drifter src={asset('ginger1.png')} w={140} from={[130, 460]} to={[150, 380]} start={0.8} end={L} blur={4} rot0={30} rotSpeed={-8} />
    <Hero src={asset('cup.png')} cx={540} cy={990} w={1000} start={0.15} end={L} ein={1.3} rise={170} scale0={0.84} push={0.05} float={8} />
    <Steam cx={545} baseY={720} start={0.9} end={L} height={430} />
    <Sparkle x={690} y={830} at={1.4} size={110} />
    <Line top={200}>
      <Reveal start={0.5} end={L} mode="wipe" ein={0.8}>
        <GoldText family={khmer ? 'khmer' : 'sans'} weight={700} size={khmer ? 100 : 34} tracking={khmer ? 0 : 13} variant="cream">
          {khmer ? 'កាហ្វេខ្ញីឆុងរហ័ស' : 'GINGER INSTANT COFFEE'}
        </GoldText>
      </Reveal>
    </Line>
    <KineticText text={khmer ? 'ឈ្ងុយឆ្ងាញ់ និងខាប់' : 'Rich & Creamy'} top={1480} start={0.7} end={L} size={khmer ? 76 : 104} family={khmer ? 'khmer' : 'serif'} italic={!khmer} stagger={khmer ? 0 : 0.032} />
    <Line top={1640}>
      <Reveal start={1.5} end={L} mode="wipe" ein={0.9}>
        <GoldText family={khmer ? 'khmer' : 'sans'} weight={500} size={khmer ? 30 : 30} tracking={khmer ? 0 : 14} variant="cream">
          {khmer ? 'កក់ក្តៅ និងផ្តល់ថាមពល' : 'WARMING &amp; ENERGIZING'}
        </GoldText>
      </Reveal>
    </Line>
    <RuleLabel text={khmer ? 'គុណភាពពិសេស' : 'PREMIUM QUALITY'} top={1740} start={1.9} end={L} family={khmer ? 'khmer' : 'micro'} weight={500} size={khmer ? 24 : 22} tracking={khmer ? 0 : 8} lineLength={70} />
  </>
);

/* 2 · PACK REVEAL ─────────────────────────────────────────── */
export const PackScene: React.FC<S> = ({ L, khmer = false }) => (
  <>
    <Glow cx={540} cy={880} r={720} start={0.1} end={L} />
    <GoldRings cx={540} cy={880} r={470} start={0.2} end={L} opacity={0.7} />
    <Drifter src={asset('ginger1.png')} w={150} from={[110, 1180]} to={[140, 1080]} start={1.0} end={L} rot0={-10} rotSpeed={9} />
    <Drifter src={spr('bean1.png')} w={130} from={[960, 380]} to={[930, 300]} start={0.9} end={L} blur={2} rot0={50} rotSpeed={-12} />
    <Drifter src={spr('bean4.png')} w={90} from={[120, 520]} to={[150, 440]} start={1.1} end={L} rot0={-30} rotSpeed={14} />
    <Hero src={asset('pack.png')} cx={540} cy={880} w={880} start={0.2} end={L} ein={1.5} rise={50} scale0={0.78} rotY0={-80} sway={4} float={8} push={0.04} />
    <Sparkle x={760} y={560} at={2.0} size={120} />
    <Sparkle x={330} y={1010} at={2.45} size={100} />
    <Line top={200}>
      <Reveal start={0.4} end={L} mode="wipe" ein={0.8}>
        <GoldText family={khmer ? 'khmer' : 'sans'} weight={700} size={khmer ? 100 : 34} tracking={khmer ? 0 : 13} variant="cream">
          {khmer ? 'កាហ្វេខ្ញីឆុងរហ័ស' : 'GINGER INSTANT COFFEE'}
        </GoldText>
      </Reveal>
    </Line>
    <KineticText text={khmer ? 'បទពិសោធន៍ ៥ ក្នុង ១' : 'The 5 in 1 Experience'} top={1480} start={0.9} end={L} size={khmer ? 70 : 76} family={khmer ? 'khmer' : 'serif'} italic={!khmer} stagger={khmer ? 0 : 0.032} />
    <RuleLabel text={khmer ? 'ឈ្ងុយឆ្ងាញ់ · កក់ក្តៅ · ផ្តល់ថាមពល' : 'RICH & CREAMY  +  WARMING & ENERGIZING'} top={1610} start={1.4} end={L} family={khmer ? 'khmer' : 'micro'} weight={500} size={khmer ? 22 : 21} tracking={khmer ? 0 : 3} lineLength={khmer ? 24 : 50} gap={khmer ? 10 : 20} />
    <Line top={1676}>
      <Reveal start={1.8} end={L} mode="rise">
        <GoldText family={khmer ? 'khmer' : 'micro'} weight={500} size={khmer ? 20 : 21} tracking={khmer ? 0 : 4} variant="cream">
          {khmer ? '២៥ កញ្ចប់ · ១៩ ក្រាម × ២៥ · ទម្ងន់សុទ្ធ ៤៧៥ ក្រាម' : '25 SACHETS  ·  19 g × 25  ·  NET WEIGHT 475 g'}
        </GoldText>
      </Reveal>
    </Line>
  </>
);

/* 3 · SACHET + BENEFITS (all claims copied from the pack) ─── */
const BENEFITS: [keyof typeof import('./parts').ICONS, string][] = [
  ['heart', 'NO CHOLESTEROL'],
  ['drop', 'TRANS FAT-FREE'],
  ['flask', 'NO ADDED ARTIFICIAL FLAVOURING'],
  ['leaf', 'MADE WITH PREMIUM BENTONG GINGER'],
  ['bowl', 'PREMIUM BROWN SUGAR'],
];
const KHMER_BENEFITS: [keyof typeof import('./parts').ICONS, string][] = [
  ['heart', 'គ្មានកូឡេស្តេរ៉ុល'],
  ['drop', 'គ្មានជាតិខ្លាញ់បំប្លែង'],
  ['flask', 'មិនបន្ថែមរសជាតិសិប្បនិម្មិត'],
  ['leaf', 'ផលិតពីខ្ញីបេនតុងគុណភាពខ្ពស់'],
  ['bowl', 'ស្ករត្នោតគុណភាពខ្ពស់'],
];
export const SachetScene: React.FC<S> = ({ L, khmer = false }) => (
  <>
    <Glow cx={300} cy={1000} r={620} start={0.1} end={L} />
    <GoldRings cx={300} cy={1000} r={330} start={0.3} end={L} opacity={0.55} />
    <Drifter src={asset('ginger1.png')} w={130} from={[500, 1500]} to={[470, 1420]} start={1.0} end={L} blur={2} rot0={20} rotSpeed={9} />
    <Drifter src={spr('bean3.png')} w={100} from={[80, 560]} to={[110, 480]} start={0.9} end={L} rot0={-20} rotSpeed={12} />
    <Hero src={asset('sachet.png')} cx={290} cy={1010} w={410} start={0.2} end={L} ein={1.3} rise={60} scale0={0.82} rotY0={50} tilt={-3} sway={3} float={9} />
    <Sparkle x={380} y={620} at={1.9} size={100} />
    <RuleLabel text={khmer ? 'ក្នុងមួយកញ្ចប់មាន' : "WHAT'S INSIDE"} top={215} start={0.3} end={L} family={khmer ? 'khmer' : 'micro'} weight={500} size={khmer ? 24 : 22} tracking={khmer ? 0 : 9} lineLength={70} />
    <KineticText text={khmer ? 'គុណភាពល្អក្នុងមួយកញ្ចប់' : 'Goodness in Every Sachet'} top={285} start={0.5} end={L} size={khmer ? 56 : 64} family={khmer ? 'khmer' : 'serif'} italic={!khmer} stagger={khmer ? 0 : 0.032} />
    {(khmer ? KHMER_BENEFITS : BENEFITS).map(([icon, text], i) => (
      <BenefitRow key={text} icon={icon} text={text} left={525} width={500} top={470 + i * 218} start={0.9 + i * 0.5} end={L} khmer={khmer} />
    ))}
    <Line top={1745}>
      <Reveal start={3.2} end={L} mode="rise">
        <GoldText family={khmer ? 'khmer' : 'micro'} weight={500} size={khmer ? 22 : 20} tracking={khmer ? 0 : 5} variant="cream">
          {khmer ? 'កាហ្វេខ្ញី GOLEX ៥ ក្នុង ១' : 'GOLEX  GINGER INSTANT COFFEE  5 IN 1'}
        </GoldText>
      </Reveal>
    </Line>
  </>
);

/* 4 · THREE GOLDEN NOTES ─────────────────────────────────── */
const Fill: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>;
const ROWS = [
  { cy: 640, side: 'L' as const, n: '01', name: 'BENTONG GINGER', sub: 'WARMING & ENERGIZING' },
  { cy: 1080, side: 'R' as const, n: '02', name: 'FRESH COFFEE', sub: 'RICH & CREAMY' },
  { cy: 1520, side: 'L' as const, n: '03', name: 'PREMIUM BROWN SUGAR', sub: 'GOLDEN SWEETNESS' },
];
export const IngredientsScene: React.FC<S> = ({ L, khmer = false }) => {
  const ts = [0.9, 1.9, 2.9];
  return (
    <>
      <Glow cx={540} cy={1000} r={800} start={0.1} end={L} strength={0.45} />
      <RuleLabel text={khmer ? 'ផលិតពីខ្ញីបេនតុងគុណភាពខ្ពស់' : 'MADE WITH PREMIUM BENTONG GINGER'} top={205} start={0.3} end={L} family={khmer ? 'khmer' : 'micro'} weight={500} size={khmer ? 22 : 21} tracking={khmer ? 0 : 5} lineLength={44} gap={18} />
      <KineticText text={khmer ? 'រសជាតិមាស ៣ យ៉ាង' : 'Three Golden Notes'} top={275} start={0.45} end={L} size={khmer ? 64 : 80} family={khmer ? 'khmer' : 'serif'} italic={!khmer} stagger={khmer ? 0 : 0.032} />
      {ROWS.map((r, i) => {
        const cx = r.side === 'L' ? 290 : 790;
        return (
          <React.Fragment key={r.n}>
            <Medallion cx={cx} cy={r.cy} d={340} start={ts[i]} end={L}>
              {i === 0 && (
                <Fill>
                  <Img src={asset('ginger2.png')} style={{ width: 400, transform: 'rotate(-8deg) translateY(8px)' }} />
                </Fill>
              )}
              {i === 1 && (
                <Fill>
                  <Img src={spr('bean1.png')} style={{ position: 'absolute', width: 190, left: 20, top: 70, transform: 'rotate(-25deg)' }} />
                  <Img src={spr('bean2.png')} style={{ position: 'absolute', width: 210, left: 120, top: 120, transform: 'rotate(35deg)' }} />
                  <Img src={spr('bean8.png')} style={{ position: 'absolute', width: 120, left: 190, top: 40, transform: 'rotate(80deg)' }} />
                </Fill>
              )}
              {i === 2 && (
                <Fill>
                  <Img src={asset('palm2.png')} style={{ width: 410, transform: 'translateY(6px)' }} />
                </Fill>
              )}
            </Medallion>
            <Label text={r.n} left={r.side === 'L' ? 520 : 60} width={500} align={r.side === 'L' ? 'left' : 'right'} top={r.cy - 100} size={46} weight={400} tracking={0} color={COLORS.gold} family="serif" italic start={ts[i] + 0.3} end={L} />
            <Label text={khmer ? ['ខ្ញីបេនតុង', 'កាហ្វេស្រស់', 'ស្ករត្នោតគុណភាពខ្ពស់'][i] : r.name} left={r.side === 'L' ? 520 : 40} width={520} align={r.side === 'L' ? 'left' : 'right'} top={r.cy - 38} size={khmer ? 34 : 36} tracking={khmer ? 0 : 4} family={khmer ? 'khmer' : 'sans'} start={ts[i] + 0.45} end={L} />
            <Label text={khmer ? ['កក់ក្តៅ និងផ្តល់ថាមពល', 'ឈ្ងុយឆ្ងាញ់ និងខាប់', 'ផ្អែមឈ្ងុយដូចការ៉ាមែល'][i] : r.sub} left={r.side === 'L' ? 520 : 40} width={520} align={r.side === 'L' ? 'left' : 'right'} top={r.cy + 52} size={khmer ? 23 : 22} weight={500} tracking={khmer ? 0 : 6} color={COLORS.champagne} family={khmer ? 'khmer' : 'micro'} start={ts[i] + 0.65} end={L} />
          </React.Fragment>
        );
      })}
      <Drifter src={asset('ginger1.png')} w={110} from={[950, 480]} to={[930, 400]} start={0.8} end={L} blur={3} rot0={20} rotSpeed={8} />
      <Drifter src={spr('bean5.png')} w={90} from={[90, 860]} to={[110, 780]} start={1.4} end={L} rot0={10} rotSpeed={-12} />
    </>
  );
};

/* 5 · MODEL 1 ─────────────────────────────────────────────── */
export const Model1Scene: React.FC<S> = ({ L, khmer = false }) => (
  <>
    <RingWipe at={0.05} cy={1100} />
    <Glow cx={540} cy={1060} r={760} start={0.1} end={L} />
    <GoldRings cx={540} cy={1080} r={400} start={0.2} end={L} opacity={0.85} />
    <Hero src={asset('model1.png')} cx={540} cy={1380} w={1240} start={0.1} end={L} ein={1.2} rise={80} scale0={0.92} push={0.07} float={5} />
    <Sparkle x={300} y={1440} at={1.5} size={100} />
    {khmer ? (
      <KineticText text="ទទួលយករសជាតិដ៏សម្បូរបែប" top={285} start={0.45} end={L} size={70} family="khmer" stagger={0} />
    ) : (
      <>
        <KineticText text="Experience" top={215} start={0.45} end={L} size={116} />
        <KineticText text="the Richness" top={365} start={0.85} end={L} size={116} />
      </>
    )}
    <RuleLabel text={khmer ? 'ឈ្ងុយឆ្ងាញ់ · ខាប់ · កក់ក្តៅ · ផ្តល់ថាមពល' : 'RICH  ·  CREAMY  ·  WARMING  ·  ENERGIZING'} top={555} start={1.4} end={L} family={khmer ? 'khmer' : 'micro'} weight={500} size={khmer ? 20 : 21} tracking={khmer ? 0 : 4} lineLength={khmer ? 22 : 46} gap={khmer ? 8 : 18} />
    <Line top={1815}>
      <Reveal start={1.7} end={L} mode="rise">
        <GoldText family={khmer ? 'khmer' : 'micro'} weight={500} size={khmer ? 22 : 20} tracking={khmer ? 0 : 6} variant="cream">
          {khmer ? 'កាហ្វេខ្ញី GOLEX ៥ ក្នុង ១' : 'GOLEX  GINGER INSTANT COFFEE  5 IN 1'}
        </GoldText>
      </Reveal>
    </Line>
  </>
);

/* 6 · MODEL 2 ─────────────────────────────────────────────── */
export const Model2Scene: React.FC<S> = ({ L, khmer = false }) => (
  <>
    <Glow cx={560} cy={1050} r={760} start={0.1} end={L} />
    <GoldRings cx={560} cy={1060} r={390} start={0.2} end={L} opacity={0.85} />
    <Hero src={asset('model2.png')} cx={560} cy={1360} w={1260} start={0.1} end={L} ein={1.2} rise={80} scale0={0.92} push={0.06} float={5} />
    <KineticText text={khmer ? 'ពេលវេលាដ៏កក់ក្តៅប្រចាំថ្ងៃ' : 'Your Daily Moment'} top={215} start={0.4} end={L} size={khmer ? 62 : 86} family={khmer ? 'khmer' : 'serif'} italic={!khmer} stagger={khmer ? 0 : 0.032} />
    <Line top={345}>
      <Reveal start={1.0} end={L} mode="center" ein={0.9}>
        <GoldText family={khmer ? 'khmer' : 'sans'} weight={600} size={khmer ? 36 : 44} tracking={khmer ? 0 : 20} variant="cream">
          {khmer ? 'នៃភាពកក់ក្តៅ' : 'OF WARMTH'}
        </GoldText>
      </Reveal>
    </Line>
    <Sparkle x={820} y={1150} at={1.2} size={110} />
  </>
);

/* 7 · END CARD ────────────────────────────────────────────── */
export const EndScene: React.FC<S> = ({ L, khmer = false }) => (
  <>
    <RingWipe at={0.05} cy={950} />
    <Glow cx={540} cy={980} r={800} start={0.1} end={L + 5} strength={0.85} />
    <GoldRings cx={540} cy={1010} r={450} start={0.2} end={L + 5} opacity={0.6} />
    <Drifter src={asset('ginger1.png')} w={150} from={[110, 1300]} to={[140, 1220]} start={0.6} end={L + 5} rot0={-15} rotSpeed={8} z={6} />
    <Drifter src={spr('bean5.png')} w={110} from={[960, 700]} to={[940, 620]} start={0.7} end={L + 5} rot0={30} rotSpeed={-12} z={6} />
    <Drifter src={spr('bean2.png')} w={160} from={[950, 1360]} to={[925, 1280]} start={0.8} end={L + 5} blur={4} rot0={-40} rotSpeed={10} z={6} />
    <Hero src={asset('logo.png')} cx={540} cy={290} w={560} start={0.2} end={L + 5} ein={1} scale0={0.85} rise={20} float={4} z={7} />
    <LogoSheen start={1.0} box={{ left: 260, top: 290 - 167, width: 560, height: 334 }} />
    <Hero src={asset('pack.png')} cx={420} cy={960} w={740} start={0.35} end={L + 5} ein={1.2} rise={90} scale0={0.85} sway={3} float={7} z={2} />
    <Hero src={asset('sachet.png')} cx={860} cy={1010} w={290} start={0.5} end={L + 5} ein={1.2} rise={90} scale0={0.85} tilt={7} float={9} z={3} />
    <Hero src={asset('cup.png')} cx={380} cy={1330} w={520} start={0.65} end={L + 5} ein={1.2} rise={90} scale0={0.85} float={6} z={5} />
    <Sparkle x={700} y={720} at={1.3} size={110} />
    <Sparkle x={250} y={1150} at={1.8} size={90} />
    <KineticText text={khmer ? 'បទពិសោធន៍ខ្ញីមាស' : 'The Golden Ginger Experience'} top={1555} start={0.9} end={L + 5} size={khmer ? 60 : 58} family={khmer ? 'khmer' : 'serif'} italic={!khmer} stagger={khmer ? 0 : 0.032} />
    <RuleLabel text={khmer ? 'កាហ្វេខ្ញី ៥ ក្នុង ១' : 'GINGER INSTANT COFFEE  5 IN 1'} top={1650} start={1.4} end={L + 5} family={khmer ? 'khmer' : 'sans'} weight={600} size={khmer ? 26 : 24} tracking={khmer ? 0 : 8} variant="cream" lineLength={46} gap={18} />
    <CtaButton text={khmer ? 'បញ្ជាទិញឥឡូវនេះ' : 'ORDER YOURS TODAY'} top={1722} start={1.7} end={L + 5} khmer={khmer} />
    <Line top={1846}>
      <Reveal start={2.0} end={L + 5} mode="rise">
        <GoldText family="micro" weight={300} size={18} tracking={khmer ? 0 : 4} variant="cream">
          HALAL  ·  MeSTI  ·  ISO 9001  ·  ISO 22000
        </GoldText>
      </Reveal>
    </Line>
    <Line top={192}>
      <Reveal start={1.2} end={L + 5} mode="fade">
        <span style={{ fontFamily: FONTS.khmer, fontWeight: 500, fontSize: khmer ? 28 : 26, color: COLORS.champagne, letterSpacing: khmer ? 0 : 1 }}>
          {khmer ? 'ផលិតនៅប្រទេសម៉ាឡេស៊ី' : 'ផលិតនៅម៉ាឡេស៊ី · MADE IN MALAYSIA'}
        </span>
      </Reveal>
    </Line>
  </>
);
