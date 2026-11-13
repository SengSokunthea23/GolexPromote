/**
 * Sound design for the Soft Luxury Edition (GolexSoftLux) — 34 s Khmer-script cut.
 * Usage: node scripts/generate-soft-sfx.mjs  ->  public/audio/golex-soft-sfx.wav
 *
 * Every sound answers a visual event in src/soft/scenes.tsx. The scene table and the pace-scaled,
 * half-beat-snapped choreography beats mirror src/soft/timeline.ts exactly — keep them in sync.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMixer } from './lib/sfx-engine.mjs';

const DUR = 34;
const BEAT = 0.6667;
const bar = (n) => 1.839 + n * BEAT * 4; // music starts 1.5 beats in (MUSIC_TRIM) — downbeats at 1.839 + n·bar
const q = (k, pace) => (Math.round(k * pace * 2) / 2) * BEAT; // same snapping as beats() in timeline.ts

// scene start (s) and pace — mirrors S_SCENES
const S = {
  open: [0, 1],
  split: [bar(0.5), 0.5],
  macro: [bar(1.5), 0.5],
  ingredients: [bar(2.5), 0.67],
  cup: [bar(4.5), 0.75],
  texture: [bar(6), 0.5],
  model1: [bar(7), 0.5],
  highlights: [bar(8), 0.5],
  brew: [bar(9), 0.75],
  final: [bar(10.5), 0.7],
};
const T = (id) => S[id][0]; //                          scene start
const at = (id, k) => S[id][0] + q(k, S[id][1]); //     scene beat k  (== B(k) in the scene)
const O = (k) => 0.505 + q(k, S.open[1]); //            opening beat k (== B0(k), S_PICKUP = 0.505)

const m = createMixer({ sr: 48000, dur: DUR, seed: 11 });
m.ambience(0.03); // warm coffee-house air under everything

/* 01 open — GOLEX plate · "ឥឡូវនេះមានចេញ" O(1) · gold line O(1.5) · gold line-2 O(2) */
m.bloom(0.35, 0.6, 0.1);
m.softImpact(0.1, 0.3); //                              GOLEX plate lands
m.goldDraw(0.3, 0.45, 0.04, 1500, 3800); //            the five gold letters rise
m.bell(1.15, 2349, 0.06, 0.9); //                       plate light sweep
m.whoosh(O(1) + 0.2, 0.6, 0.14, 0, 200, 1000); //       "ឥឡូវនេះមានចេញ"
m.goldDraw(O(1.5), 0.6, 0.045, 1600, 4000); //          gold line
m.softImpact(O(2) + 0.12, 0.35); m.bell(O(2) + 0.14, 1975.5, 0.08, 1.2); // "មួយរសជាតិថ្មីទៀតហេីយ"
m.rustle(O(1) + 0.4, 0.35, 0.08, -0.6); m.rustle(O(2) + 0.25, 0.3, 0.07, 0.6); // ginger + bean float in

/* 02 what it is */
m.whoosh(T('split'), 1.0, 0.4, 0, 220, 3800);
m.softImpact(T('split'), 0.25);
m.whoosh(T('split') + 0.6, 0.8, 0.16, 0.8, 400, 3500); // pack slides in
m.tick(at('split', 1) + 0.2, 0.08, -0.5); //            "គឺកាហ្វេGolex"
m.softImpact(at('split', 2) + 0.12, 0.3); m.bell(at('split', 2) + 0.14, 1760, 0.07, 1.0); // "5in1"
m.goldDraw(at('split', 3), 0.8, 0.04, 1800, 4200, -0.4); m.tick(at('split', 3) + 0.2, 0.07, -0.5); // "(កាហ្វេខ្ញី)"
m.bell(T('split') + 1.6, 2093, 0.06, 0.9, 0.4); //      pack sheen

/* 03 "ដែលរួមផ្សំពី" */
m.swell(T('macro') + 0.1, 1.0, 0.18);
m.goldDraw(T('macro') + 0.45, 1.3, 0.035, 1200, 3000); // frame border
m.bell(T('macro') + 1.8, 2349, 0.08, 1.0); //           light sweep
m.goldDraw(at('macro', 1.5), 0.8, 0.04, 1800, 4200); //  underline
m.softImpact(at('macro', 2) + 0.12, 0.3); m.pop(at('macro', 2) + 0.2, 700, 0.12);

/* 04 five ingredients — one glass card every 0.7 s */
m.whoosh(T('ingredients'), 0.9, 0.45, 0, 200, 5000);
m.softImpact(T('ingredients') + 0.05, 0.28);
for (let i = 0; i < 5; i++) {
  const tt = T('ingredients') + 0.35 + i * 0.7;
  const side = i % 2 ? 1 : -1;
  m.glass(tt + 0.4, [2093, 2349, 2637, 2960, 3136][i], 0.12, side * 0.3);
  m.rustle(tt + 0.25, 0.3, 0.07, side * 0.5);
}

/* 05 "ក្លិនឈ្ងុយ" — card expansion, the pour, steam */
m.whoosh(T('cup'), 1.1, 0.45, 0, 200, 3800);
m.impact(T('cup') + 0.03, 0.32, 1.8);
m.pour(T('cup') + 0.4, 1.2, 0.32);
m.steam(T('cup') + 1.2, T('texture') + 0.5, 0.05);
m.goldDraw(T('cup') + 0.3, 1.4, 0.035, 1100, 3000);
m.softImpact(at('cup', 2) + 0.15, 0.3); m.bell(at('cup', 2) + 0.17, 1760, 0.08, 1.1);
m.bell(T('cup') + 1.95, 2349, 0.06, 0.9, 0.3); m.bell(T('cup') + 3.5, 2093, 0.06, 0.9, -0.3); // cup sheens

/* 06 "រសជាតិឆ្ងាញ់" — crema lens */
m.whoosh(T('texture'), 1.0, 0.4, 0, 250, 4200);
m.bloom(T('texture') + 0.6, 0.6, 0.06);
m.goldDraw(T('texture') + 0.35, 1.4, 0.035, 1300, 3400);
m.rustle(T('texture') + 0.7, 0.4, 0.09, -0.7); m.rustle(T('texture') + 0.95, 0.35, 0.08, 0.7);
m.goldDraw(at('texture', 1.5), 0.8, 0.04, 1800, 4200);
m.softImpact(at('texture', 2) + 0.12, 0.28); m.bell(at('texture', 2) + 0.14, 2093, 0.07, 1.0);

/* 07 "ប្រេនកូនខ្មែរ" + "ផលិតនៅប្រទេសម៉ាឡេសុី" */
m.whoosh(T('model1'), 1.1, 0.42, 0, 220, 3600);
m.softImpact(T('model1') + 0.05, 0.3);
m.goldDraw(T('model1') + 0.6, 1.4, 0.035, 1200, 3000); // frame border
m.pop(T('model1') + 0.2, 640, 0.14, -0.6); //  Cambodia flag pops in
m.tick(at('model1', 1) + 0.2, 0.08, -0.5);
m.pop(at('model1', 2) + 0.05, 760, 0.12, -0.6); // Malaysia flag pops in
m.goldDraw(at('model1', 2), 0.8, 0.035, 2000, 4400, -0.5); m.tick(at('model1', 2) + 0.2, 0.07, -0.5);
m.rustle(at('model1', 2.5) + 0.2, 0.3, 0.06, -0.6);

/* 08 "ញាំមិនឆ្ងាញ់ / ធានាប្ដូរលុយវិញ" + guarantee seal */
m.swell(T('highlights') + 0.1, 0.9, 0.16);
m.goldDraw(T('highlights') + 0.55, 1.2, 0.03, 1400, 3400, 0.4);
m.pop(at('highlights', 1) + 0.2, 700, 0.12);
m.softImpact(at('highlights', 2) + 0.12, 0.3); m.bell(at('highlights', 2) + 0.14, 1760, 0.07, 1.0);
m.pop(at('highlights', 2.5) + 0.1, 520, 0.18); m.goldDraw(at('highlights', 2.5) + 0.3, 0.6, 0.04, 1600, 4000, -0.5); // seal + check mark

/* 09 how to brew — sachet pours powder, water pours, measuring glass fills to 60–70 */
const W = T('brew');
m.whoosh(W, 1.0, 0.4, 0, 250, 4200);
m.softImpact(W + 0.05, 0.25);
m.pop(W + 0.35, 640, 0.12); //                          "ឆុងអោយបានឆ្ងាញ់"
m.rustle(W + 0.3, 0.35, 0.07, 0.5); //                   sachet floats in
m.tick(W + 0.9, 0.08, 0.2); //                          sachet tips over
for (let i = 0; i < 7; i++) m.rustle(W + 1.15 + i * 0.12, 0.14, 0.05, -0.1); // powder shaken out
m.whoosh(W + 2.1, 0.5, 0.08, 0.6, 400, 2500); //         sachet lifts away
m.rustle(W + 1.45, 0.3, 0.05, 0.6); //                   measuring glass slides in
m.pour(W + 2.05, 1.2, 0.34); //                         water pours
m.bell(W + 3.2, 1760, 0.08, 1.0, 0.5); m.goldDraw(W + 3.05, 0.4, 0.035, 1800, 4000, 0.5); // level reaches 60–70
m.pop(W + 2.75, 520, 0.18); m.glass(W + 2.8, 2093, 0.1); // brewing pill
m.steam(W + 3.0, W + 4.5, 0.05);

/* 10 final — logo + "បញ្ជាទិញឥឡូវនេះ" pill */
const F = T('final');
m.bloom(F + 0.2, 0.7, 0.12);
m.impact(F + 0.03, 0.4, 2.4);
m.goldDraw(F + 0.25, 1.2, 0.035, 1100, 3200); //       rings draw
m.pop(F + 0.4, 600, 0.14); //                          logo arrives
m.signature(F + 1.15, 0.22); //                        logo light sweep
m.pop(at('final', 3) + 0.15, 520, 0.2); m.glass(at('final', 3) + 0.2, 2093, 0.1); // order pill
m.bell(F + 2.75, 2637, 0.06, 1.0); //                  second logo sweep

const dest = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio', 'golex-soft-sfx.wav');
console.log('ok', dest, 'peak', m.write(dest).toFixed(3));
