/**
 * Sound design for The Golden Ginger World — 3D Isometric Storytelling Edition (GolexIsoWorld) — 30 s.
 * Usage: node scripts/generate-iso-sfx.mjs  ->  public/audio/golex-iso-sfx.wav
 *
 * Every sound answers a visual event in src/iso/scenes.tsx, on the beat grid of "Sunny Morning"
 * (104.35 BPM, beat 0.575 s, first downbeat 0.739 s, key D major) — see src/iso/timeline.ts.
 * Restraint rule: one transition sound per cut; pops/bounces only for objects that actually land.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMixer } from './lib/sfx-engine.mjs';

const DUR = 30;
const BEAT = 0.575;
const bar = (n) => 0.739 + n * BEAT * 4;
const B = (k) => k * BEAT;

// scene starts — mirrors I_SCENES
const S = { open: 0, split: bar(1), macro: bar(2.5), cup: bar(4), texture: bar(5.5), ingredients: bar(6.5), model1: bar(8.5), highlights: bar(9.5), final: bar(10.5) };
const at = (id, k) => S[id] + B(k);

const m = createMixer({ sr: 48000, dur: DUR, seed: 31 });
// "Sunny Morning" is in D major — every tonal sound is tuned to D major pentatonic (D E F♯ A B)
m.setScale([587.33, 659.25, 739.99, 880.0, 987.77]);
const D_CHORD = [1174.66, 1479.98, 1760.0, 2349.32]; // D6 F♯6 A6 D7 — logo signature
/** Miniature landing: a soft pop with a smaller second bounce. */
const bounce = (t, f = 520, g = 0.16, pan = 0) => { m.pop(t, f, g, pan); m.pop(t + 0.13, f * 1.25, g * 0.45, pan); };

m.ambience(0.025); // warm café air

/* 01 open — the island floats in, the café builds, the curved title runs */
m.swell(0.75, 0.6, 0.1);
bounce(0.75, 440, 0.2); //                              island lands
m.goldDraw(0.3, 1.2, 0.025, 900, 2400); //              ribbon draws
[0.5, 0.75, 0.95].forEach((d, i) => m.tick(d + 0.1, 0.05, -0.3 + i * 0.3)); // café builds up
bounce(0.95, 700, 0.1, -0.4); bounce(1.1, 760, 0.1, 0.4); // tiny pack + cup land
m.pop(0.8, 620, 0.12); //                                "បទពិសោធន៍ថ្មី"
m.softImpact(1.36, 0.3); m.bell(1.38, 1760.0, 0.08, 1.1); // gold "កាហ្វេខ្ញី 5IN1"
m.goldDraw(1.9, 1.0, 0.03, 1500, 3800); //               curved title travels

/* 02 product introduction — package floats onto the pedestal, the card counts up */
bounce(S.split + 0.25, 420, 0.18); //                    pedestal
m.softImpact(S.split + 1.0, 0.28); //                     package settles
m.bell(S.split + 1.65, 1479.98, 0.06, 0.9, 0.4); //      package sheen
[1, 2, 3].forEach((k, i) => m.pop(at('split', k) + 0.05, 600 + i * 90, 0.1, -0.5)); // words
m.goldDraw(at('split', 3.5), 0.6, 0.03, 1800, 4200, -0.4); // underline
for (let i = 0; i < 8; i++) m.tick(at('split', 3.7) + i * 0.1, 0.035, -0.5); // counter ០ → ២៥

/* 03 sachet → package, 5 IN 1 */
m.pop(S.macro + 0.15, 560, 0.12);
m.goldDraw(at('macro', 2), 0.8, 0.035, 1100, 3300); //   the transformation shimmer
m.softImpact(at('macro', 2) + 0.75, 0.32); //            package revealed
bounce(at('macro', 2) + 0.1, 420, 0.14); //              gold pedestal
m.impact(at('macro', 3) + 0.05, 0.25, 1.2); m.pop(at('macro', 3) + 0.08, 380, 0.16); // big "5"
m.pop(at('macro', 3.5) + 0.2, 700, 0.12); //             "IN 1" slides in
m.pop(at('macro', 2.5) + 0.1, 620, 0.1); m.tick(at('macro', 4) + 0.1, 0.05);

/* 04 cup — turns in, pour, steam, orbit */
bounce(S.cup + 0.25, 400, 0.16); //                     island
m.softImpact(S.cup + 1.05, 0.26); //                     cup lands
m.pour(S.cup + 0.4, 0.9, 0.28);
m.steam(S.cup + 1.3, S.texture + 0.3, 0.04);
m.rustle(S.cup + 0.7, 0.35, 0.06, -0.6); m.rustle(S.cup + 1.6, 0.35, 0.05, 0.6); // ingredients orbiting
m.softImpact(at('cup', 1) + 0.12, 0.28); m.bell(at('cup', 1) + 0.14, 1174.66, 0.08, 1.0); // "ឈ្ងុយឆ្ងាញ់"
m.bell(S.cup + 1.6, 1760.0, 0.05, 0.9, 0.3);
m.goldDraw(at('cup', 3), 0.6, 0.03, 1800, 4200);

/* 05 coffee-bean pathway */
m.goldDraw(S.texture + 0.05, 0.9, 0.025, 800, 2200, -0.5); // the path draws
for (let i = 0; i < 6; i++) m.rustle(S.texture + 0.2 + i * 0.32, 0.18, 0.045, -0.6 + i * 0.2); // beans tumbling along
m.tick(at('texture', 0.5) + 0.1, 0.05);
m.pop(at('texture', 1.5) + 0.1, 640, 0.11);
m.goldDraw(at('texture', 1.9), 0.5, 0.03, 1800, 4200);

/* 06 ingredient world — three islands land, cards flip in */
m.goldDraw(at('ingredients', 2), 1.6, 0.02, 900, 2600); // golden path between islands
[2, 3, 4].forEach((k, i) => {
  bounce(at('ingredients', k) + 0.35, [440, 494, 523][i], 0.16, i === 1 ? 0.5 : -0.5);
  m.glass(at('ingredients', k) + 0.75, [2349, 2637, 2960][i], 0.08, i === 1 ? -0.5 : 0.5); // card flips in
});
m.pop(at('ingredients', 0.5) + 0.05, 600, 0.1); m.pop(at('ingredients', 1.5) + 0.05, 700, 0.1);
m.tick(at('ingredients', 6.5) + 0.1, 0.05);

/* 07 lifestyle — pull-back, cup island, parallax ingredients */
bounce(at('model1', 1) + 0.3, 460, 0.14, -0.6);
m.goldDraw(S.model1 + 0.3, 0.9, 0.025, 1200, 3000, 0.3); // arch frame draws
m.tick(at('model1', 0.5) + 0.1, 0.06, -0.5); m.tick(at('model1', 1.5) + 0.1, 0.06, -0.5);
m.bell(at('model1', 2.5) + 0.1, 1479.98, 0.05, 0.9, -0.4);

/* 08 highlights — cards flip in with isometric icons */
m.pop(at('highlights', 0.5) + 0.05, 620, 0.1); m.pop(at('highlights', 1) + 0.05, 740, 0.1);
[0, 1].forEach((i) => { const tt = at('highlights', 1.5) + i * 0.3; m.glass(tt + 0.4, 2349 + i * 300, 0.09, -0.4); m.goldDraw(tt + 0.3, 0.5, 0.02, 1800, 3600, -0.4); });

/* 09 final hero */
m.riser(S.final - 0.9, S.final, 0.08);
bounce(S.final + 0.4, 360, 0.2); //                     big island
m.softImpact(S.final + 1.2, 0.32); //                    products land
bounce(S.final + 1.4, 700, 0.09, 0.5); bounce(S.final + 1.6, 620, 0.09, -0.5);
m.goldDraw(S.final + 0.25, 1.3, 0.025, 900, 2600); //    ribbon
const logo = at('final', 2);
m.pop(logo + 0.1, 600, 0.12);
m.signature(logo + 1.1, 0.2, D_CHORD); //               logo sheen
m.tick(at('final', 5) + 0.1, 0.05);
m.pop(at('final', 6) + 0.15, 520, 0.18); m.glass(at('final', 6) + 0.2, 1760.0, 0.09); // CTA
m.tick(at('final', 7) + 0.1, 0.04);

/* ═══ TRANSITIONS — exactly one per cut, shaped by the visual transition ═══ */
const KIND = { split: ['zoom', 1], macro: ['whip', -1], cup: ['soft', 1], texture: ['zoom', -1], ingredients: ['zoom', 1], model1: ['soft', -1], highlights: ['whip', 1], final: ['zoom', -1] };
for (const [id, [kind, dir]] of Object.entries(KIND)) m.transition(S[id], kind, kind === 'soft' ? 0.24 : 0.28, dir);

const dest = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio', 'golex-iso-sfx.wav');
console.log('ok', dest, 'peak', m.write(dest).toFixed(3));
