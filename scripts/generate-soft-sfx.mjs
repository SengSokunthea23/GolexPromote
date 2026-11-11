/**
 * Sound design for the Soft Luxury Edition (GolexSoftLux) — 31 s cut.
 * Usage: node scripts/generate-soft-sfx.mjs  ->  public/audio/golex-soft-sfx.wav
 *
 * Every sound answers a visual event in src/soft/scenes.tsx. The scene table and the pace-scaled,
 * half-beat-snapped choreography beats mirror src/soft/timeline.ts exactly — keep them in sync.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMixer } from './lib/sfx-engine.mjs';

const DUR = 31;
const BEAT = 0.6667;
const bar = (n) => 1.839 + n * BEAT * 4; // music starts 1.5 beats in (MUSIC_TRIM) — downbeats at 1.839 + n·bar
const q = (k, pace) => (Math.round(k * pace * 2) / 2) * BEAT; // same snapping as beats() in timeline.ts

// scene start (s) and pace — mirrors S_SCENES
const S = {
  open: [0, 1],
  split: [bar(0.5), 0.5],
  macro: [bar(1.5), 0.5],
  cup: [bar(2.5), 0.75],
  texture: [bar(4), 0.5],
  ingredients: [bar(5), 0.67],
  model1: [bar(7), 0.5],
  highlights: [bar(8), 0.5],
  final: [bar(9), 0.7],
};
const T = (id) => S[id][0]; //                          scene start
const at = (id, k) => S[id][0] + q(k, S[id][1]); //     scene beat k  (== B(k) in the scene)
const O = (k) => 0.505 + q(k, S.open[1]); //            opening beat k (== B0(k), S_PICKUP = 0.505)

const m = createMixer({ sr: 48000, dur: DUR, seed: 11 });
// "Golden Lounge" is in B♭ major — every bell, gold draw, glass ting and bloom is tuned to B♭ major pentatonic
// (B♭ C D F G), so the sound design plays *with* the song instead of against it.
m.setScale([466.16, 523.25, 587.33, 698.46, 783.99]);
const BB_CHORD = [1396.91, 1864.66, 2349.32, 2793.83]; // F6 B♭6 D7 F7 — logo signature
const BEAT0 = 0.505; //                                first music beat in video time

/* ═══ BACKGROUND SOUND BED — continuous, musical, always tied to what is on screen ═══ */
// 1 · airy B♭ pad under the whole spot: the warm ivory light breathing with the bars
m.pad(0, DUR, [466.16, 698.46, 932.33], 0.2);
// 2 · gold-dust twinkles: the gold particles drifting on screen, denser on the ruby product stages
const DENS = { open: 0.35, split: 0.3, macro: 0.3, cup: 0.5, texture: 0.4, ingredients: 0.3, model1: 0.3, highlights: 0.35, final: 0.55 };
const ids = Object.keys(DENS);
ids.forEach((id, i) => {
  const t0 = i === 0 ? 0.3 : S[id][0];
  const t1 = i < ids.length - 1 ? S[ids[i + 1]][0] : DUR - 0.8;
  m.twinkles(t0, t1, { grid0: BEAT0, step: BEAT / 2, prob: DENS[id], g: 0.11 });
});
// 3 · a rising in-key shimmer run into every cut (the scene hand-off "sparkles" across)
ids.slice(1).forEach((id) => m.goldDraw(S[id][0] - 0.65, 0.65, 0.035, 1100, 3300, 0));

m.ambience(0.03); // warm coffee-house air under everything

/* 01 open — 3.17 s title moment */
m.bloom(0.35, 0.6, 0.1);
m.glass(0.15, 2600, 0.08); //                           label
m.whoosh(O(0) + 0.25, 0.6, 0.16, 0, 600, 4000); //      "បទពិសោធន៍ថ្មី" rises
m.softImpact(O(1) + 0.12, 0.38); m.bell(O(1) + 0.14, 1975.5, 0.09, 1.2); // gold "កាហ្វេខ្ញី 5IN1" scales in
m.rustle(O(1) + 0.4, 0.35, 0.08, -0.6); //               ginger slice floats in
m.goldDraw(O(2), 0.8, 0.045, 1600, 4000); //            gold underline (downbeat)
m.whoosh(O(2) + 0.5, 0.6, 0.07, 0, 1500, 6000); //      English line
m.rustle(O(2) + 0.25, 0.3, 0.07, 0.6); //               bean floats in

/* 02 split */
m.whoosh(T('split'), 1.0, 0.4, 0, 220, 3800);
m.softImpact(T('split'), 0.25);
m.whoosh(T('split') + 0.6, 0.8, 0.16, 0.8, 400, 3500); // pack slides in from the right
m.tick(T('split') + 0.35, 0.07, -0.5);
[1, 2, 3].forEach((k, i) => m.tick(at('split', k) + 0.25, 0.09, -0.5 + i * 0.1)); // headline words slide
m.bell(T('split') + 1.6, 2093, 0.06, 0.9, 0.4); //   pack sheen
m.goldDraw(at('split', 3), 1.0, 0.04, 1800, 4200, -0.4); // underline
m.whoosh(at('split', 3) + 0.5, 0.6, 0.06, -0.4, 1500, 6000);
m.whoosh(at('split', 3.5) + 0.25, 0.5, 0.09, -0.6, 1000, 4500); m.glass(at('split', 3.5) + 0.4, 2200, 0.12, -0.4); // glass panel

/* 03 macro — focus pull */
m.swell(T('macro') + 0.1, 1.0, 0.18);
m.whoosh(T('macro') + 0.2, 1.1, 0.12, 0, 200, 1800);
m.goldDraw(T('macro') + 0.45, 1.3, 0.035, 1200, 3000);
m.tick(T('macro') + 0.4, 0.06);
m.bell(T('macro') + 1.8, 2349, 0.08, 1.0); m.bell(at('macro', 4) + 0.8, 2093, 0.07, 1.0); // two light sweeps
[0, 0.25].forEach((d, i) => m.pop(at('macro', 2) + 0.2 + d, 700 + i * 140, 0.14));
[0, 0.2, 0.4].forEach((d, i) => m.tick(at('macro', 4) + 0.2 + d, 0.06, (i - 1) * 0.3));
m.tick(at('macro', 5) + 0.2, 0.06);

/* 04 cup — rounded-card expansion, the pour */
m.whoosh(T('cup'), 1.1, 0.45, 0, 200, 3800);
m.impact(T('cup') + 0.03, 0.32, 1.8);
m.pour(T('cup') + 0.4, 1.2, 0.32);
m.steam(T('cup') + 1.6, T('texture') + 0.5, 0.045);
m.goldDraw(T('cup') + 0.3, 1.4, 0.035, 1100, 3000);
for (let tp = T('cup') + 1.6; tp < T('texture'); tp += 1.6) m.whoosh(tp, 0.55, 0.06, 0.8, 500, 2800); // orbit passes
m.softImpact(at('cup', 2) + 0.15, 0.3); m.bell(at('cup', 2) + 0.17, 1760, 0.08, 1.1); // "ឈ្ងុយឆ្ងាញ់"
m.pop(at('cup', 3) + 0.25, 760, 0.12); m.pop(at('cup', 3) + 0.45, 900, 0.11);
m.bell(T('cup') + 1.95, 2349, 0.06, 0.9, 0.3); m.bell(T('cup') + 3.5, 2093, 0.06, 0.9, -0.3); // cup sheens
m.goldDraw(at('cup', 4), 1.0, 0.04, 1800, 4200);
m.whoosh(at('cup', 4) + 0.6, 0.6, 0.06, 0, 1500, 6000);

/* 05 texture — zoom into the crema lens */
m.whoosh(T('texture'), 1.0, 0.4, 0, 250, 4200);
m.bloom(T('texture') + 0.6, 0.6, 0.06);
m.goldDraw(T('texture') + 0.35, 1.4, 0.035, 1300, 3400);
m.rustle(T('texture') + 0.7, 0.4, 0.09, -0.7); m.rustle(T('texture') + 0.95, 0.35, 0.08, 0.7);
m.tick(at('texture', 1) + 0.2, 0.06);
m.bell(T('texture') + 1.8, 2093, 0.06, 1.0); m.bell(at('texture', 5) + 0.5, 2349, 0.05, 1.0);
[0, 0.25, 0.5].forEach((d, i) => m.pop(at('texture', 2) + 0.2 + d, 680 + i * 120, 0.12));
m.goldDraw(at('texture', 4), 1.0, 0.04, 1800, 4200);
m.whoosh(at('texture', 4) + 0.6, 0.6, 0.06, 0, 1500, 6000);

/* 06 ingredients — sheet slides up */
m.whoosh(T('ingredients'), 0.9, 0.45, 0, 200, 5000);
m.softImpact(T('ingredients') + 0.05, 0.28);
m.tick(T('ingredients') + 0.5, 0.06);
m.whoosh(at('ingredients', 1) + 0.25, 0.5, 0.09, 0, 800, 4000);
m.whoosh(at('ingredients', 2) + 0.25, 0.5, 0.09, 0, 800, 4000);
m.tick(at('ingredients', 3) + 0.25, 0.06);
[[4, -1], [5.5, 1], [7, -1]].forEach(([k, side], i) => {
  const tt = at('ingredients', k);
  m.whoosh(tt + 0.3, 0.6, 0.17, -side * 0.8, 400, 3500);
  m.glass(tt + 0.45, 2000 + i * 300, 0.13, side * 0.3);
  m.rustle(tt + 0.4, 0.35, 0.08, side * 0.4);
});
[8, 9, 10].forEach((k, i) => m.glass(at('ingredients', k) + 0.3, 2637 + i * 330, 0.1, (i - 1) * 0.4)); // focus cycle
m.rustle(at('ingredients', 4) + 0.5, 0.35, 0.07, 0.8); m.rustle(at('ingredients', 7) + 0.5, 0.35, 0.07, -0.8);
m.tick(at('ingredients', 10.5) + 0.2, 0.06);

/* 07 model 1 — card expansion, editorial type */
m.whoosh(T('model1'), 1.1, 0.42, 0, 220, 3600);
m.softImpact(T('model1') + 0.05, 0.3);
m.goldDraw(T('model1') + 0.6, 1.4, 0.035, 1200, 3000); // frame border
m.tick(T('model1') + 0.5, 0.06, -0.5);
m.tick(at('model1', 1) + 0.25, 0.08, -0.5); m.tick(at('model1', 2) + 0.25, 0.08, -0.5);
m.whoosh(at('model1', 4) + 0.35, 0.6, 0.07, -0.5, 1500, 6000);
m.goldDraw(at('model1', 5), 0.9, 0.035, 2000, 4400, -0.5);

/* 08 highlights — focus pull, ruby disc, feature cards */
m.swell(T('highlights') + 0.1, 0.9, 0.16);
m.whoosh(T('highlights') + 0.4, 0.9, 0.2, 0.5, 250, 3000); // disc + model
m.goldDraw(T('highlights') + 0.55, 1.2, 0.03, 1400, 3400, 0.4);
m.tick(T('highlights') + 0.5, 0.06);
m.pop(at('highlights', 1) + 0.25, 700, 0.12); m.pop(at('highlights', 2) + 0.25, 820, 0.11);
[0, 1, 2].forEach((i) => { const tt = at('highlights', 2.5) + i * 0.33; m.whoosh(tt + 0.3, 0.45, 0.08, -0.6, 1200, 5000); m.glass(tt + 0.4, 2200 + i * 260, 0.12, -0.4); });

/* 09 final — light bloom, horizon rises, products, logo signature, CTA */
const F = T('final');
m.riser(F - 1.2, F, 0.1);
m.bloom(F + 0.2, 0.7, 0.12);
m.impact(F + 0.03, 0.45, 2.4);
m.whoosh(F + 0.45, 1.2, 0.24, 0, 180, 2600); //        burgundy horizon + pack rise
m.whoosh(F + 0.9, 0.6, 0.12, 0.8, 400, 3000); m.whoosh(F + 1.2, 0.6, 0.12, -0.8, 400, 3000); // sachet, cup
m.goldDraw(F + 0.35, 1.4, 0.035, 1100, 3200);
m.rustle(F + 1.3, 0.4, 0.08, 0.6); m.rustle(F + 1.5, 0.35, 0.07, -0.7);
const logo = at('final', 2);
m.whoosh(logo + 0.4, 0.7, 0.12, 0, 300, 3000); m.pop(logo + 0.6, 600, 0.14); // logo arrives
m.signature(logo + 1.2, 0.22, BB_CHORD); //                      logo light sweep
m.bell(logo + 2.8, 2637, 0.06, 1.0); //                second logo sweep
[0, 0.3].forEach((d, i) => m.pop(at('final', 3) + 0.5 + d, 680 + i * 160, 0.13));
m.tick(at('final', 5) + 0.2, 0.07);
m.pop(at('final', 6) + 0.2, 520, 0.2); m.glass(at('final', 6) + 0.25, 2093, 0.1); // CTA
m.tick(at('final', 7) + 0.2, 0.05);

/* ═══ TRANSITION LAYER — one clear, layered hit on every cut, shaped by the visual transition ═══ */
// open (light bloom from white)
m.transition(0.25, 'soft', 0.45); m.bell(0.3, 2637, 0.1, 1.2);
// 01→02 zoom-through · 02→03 blur focus pull · 03→04 rounded card · 04→05 zoom · 05→06 sheet up
// 06→07 rounded card · 07→08 blur · 08→09 light bloom
const KIND = { split: ['zoom', 1], macro: ['soft', -1], cup: ['zoom', 1], texture: ['zoom', -1], ingredients: ['whip', 1], model1: ['zoom', -1], highlights: ['soft', 1], final: ['zoom', 1] };
for (const [id, [kind, dir]] of Object.entries(KIND)) {
  const c = T(id);
  m.transition(c, kind, kind === 'soft' ? 0.6 : 0.7, dir);
  if (kind !== 'soft') m.drop(c + 0.02, 0.32);
  else m.softImpact(c + 0.05, 0.3);
  m.swish(c + 0.35, 0.16, -dir * 0.5); // the incoming layout settling
}
m.riser(T('final') - 1.6, T('final'), 0.18); // build into the end card

/* ═══ ELEMENT ACCENTS — audible swishes on the main entrances ═══ */
const sw = (t, g, p = 0) => m.swish(t, g * 0.7, p);
sw(O(0) + 0.2, 0.18); sw(O(1) + 0.1, 0.22); sw(O(2) + 0.2, 0.16); // headline · gold title · underline
sw(at('split', 1) + 0.15, 0.14, -0.6); sw(at('split', 2) + 0.15, 0.14, -0.6); sw(at('split', 3) + 0.15, 0.14, -0.6);
sw(at('macro', 2) + 0.15, 0.16);
sw(at('cup', 2) + 0.1, 0.2); sw(at('cup', 4) + 0.2, 0.15);
sw(at('texture', 2) + 0.15, 0.16);
[4, 5.5, 7].forEach((k, i) => sw(at('ingredients', k) + 0.25, 0.2, i % 2 ? 0.6 : -0.6)); // ingredient cards
sw(at('model1', 1) + 0.15, 0.16, -0.6); sw(at('model1', 2) + 0.15, 0.16, -0.6);
[0, 1, 2].forEach((i) => sw(at('highlights', 2.5) + i * 0.33 + 0.2, 0.17, -0.6)); // feature cards
sw(at('final', 2) + 0.3, 0.2); sw(at('final', 6) + 0.15, 0.18); // logo · CTA

const dest = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio', 'golex-soft-sfx.wav');
console.log('ok', dest, 'peak', m.write(dest, 0.92, 1.9).toFixed(3));
