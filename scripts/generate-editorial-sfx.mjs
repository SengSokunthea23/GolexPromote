/**
 * Sound design for the Editorial Kinetic Typography Edition (GolexEditorial) — 35 s.
 * Usage: node scripts/generate-editorial-sfx.mjs  ->  public/audio/golex-editorial-sfx.wav
 *
 * Every sound answers a visual event in src/editorial/scenes.tsx, on the beat grid of "Sunset Breeze"
 * (100 BPM, beat 0.5997 s, first beat 0.42 s, first downbeat 1.02 s, key G major).
 * Restraint: one transition sound per cut; one soft swish per oversized word; impacts only on big headlines.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMixer } from './lib/sfx-engine.mjs';

const DUR = 35;
const BEAT = 0.5997;
const bar = (n) => 1.02 + n * BEAT * 4;
const B = (k) => k * BEAT;
const O = (k) => 0.42 + B(k); // opening beats

// scene starts — mirrors E_SCENES
const S = { open: 0, split: bar(1), macro: bar(2.5), cup: bar(4), texture: bar(5.5), ingredients: bar(7), model1: bar(9), highlights: bar(10.5), final: bar(12) };
const at = (id, k) => S[id] + B(k);

const m = createMixer({ sr: 48000, dur: DUR, seed: 41 });
// "Sunset Breeze" is in G major — every tonal sound is tuned to G major pentatonic (G A B D E)
m.setScale([392.0, 440.0, 493.88, 587.33, 659.25]);
const G_CHORD = [1174.66, 1567.98, 1975.53, 2349.32]; // D6 G6 B6 D7 — logo signature
const giant = (t, pan = 0) => m.swish(t + 0.15, 0.09, pan); // one soft swish per oversized word

m.ambience(0.025);

/* 01 open */
m.bloom(0.3, 0.6, 0.08);
m.tick(0.12, 0.05);
giant(0.2, -0.3); //                                   "Ginger"
m.pop(0.15, 520, 0.12); //                              ruby shape blooms
m.pop(O(0) + 0.05, 620, 0.1); //                        "បទពិសោធន៍ថ្មី"
m.softImpact(O(1) + 0.08, 0.32); m.bell(O(1) + 0.1, 1567.98, 0.08, 1.1); // "កាហ្វេខ្ញី 5IN1"
m.rustle(O(1) + 0.25, 0.3, 0.06, 0.5); //               ginger slice floats in
m.goldDraw(O(2), 0.6, 0.035, 1500, 3800); //            underline

/* 02 split — colour-block wipe, pack resolves from silhouette */
giant(S.split + 0.15, 0.6); //                          "Discover" (vertical)
m.softImpact(S.split + 0.6, 0.22); m.bell(S.split + 1.2, 1974, 0.05, 0.9, 0.5); // pack resolves + sheen
[1, 1.5, 2].forEach((k, i) => m.tick(at('split', k) + 0.08, 0.07, -0.5 + i * 0.1)); // Khmer words slide
m.glass(at('split', 2) + 0.2, 2349, 0.09, -0.4); //     info card
m.goldDraw(at('split', 2.5), 0.5, 0.03, 1800, 4200, -0.4);

/* 03 5 IN 1 — white flash */
giant(S.macro + 0.05);
m.softImpact(S.macro + 0.1, 0.28); //                   crop reveals
m.bell(S.macro + 1.0, 1975.53, 0.06, 0.9); //           gold sweep
m.pop(at('macro', 1) + 0.05, 620, 0.1); m.tick(at('macro', 2) + 0.05, 0.05); m.tick(at('macro', 2.5) + 0.05, 0.04);

/* 04 cup (the music lifts here) */
m.boom(S.cup, 0.2);
giant(S.cup + 0.05); //                                 "Richness"
m.goldDraw(S.cup + 0.3, 1.0, 0.025, 1100, 2800); //     curved gold lines
m.pour(S.cup + 0.35, 0.8, 0.26);
m.steam(S.cup + 1.0, S.texture + 0.3, 0.04);
m.softImpact(at('cup', 1) + 0.1, 0.3); m.bell(at('cup', 1) + 0.12, 1174.66, 0.08, 1.0); // "ឈ្ងុយឆ្ងាញ់"
m.goldDraw(at('cup', 2.5), 0.5, 0.03, 1800, 4200);

/* 05 texture */
m.goldDraw(S.texture + 0.2, 1.0, 0.03, 1300, 3400); //  waveforms + ring draw
m.rustle(S.texture + 0.45, 0.3, 0.06, -0.6); m.rustle(S.texture + 0.6, 0.3, 0.05, 0.6);
m.tick(at('texture', 0.5) + 0.05, 0.05);
m.pop(at('texture', 1) + 0.05, 660, 0.1);
m.goldDraw(at('texture', 2), 0.5, 0.03, 1800, 4200);

/* 06 ingredients — three cropped photos */
m.pop(at('ingredients', 0.5) + 0.05, 600, 0.1); m.pop(at('ingredients', 1.5) + 0.05, 700, 0.1);
[2.5, 3.5, 4.5].forEach((k, i) => {
  m.tick(at('ingredients', k) + 0.05, 0.07, i === 1 ? 0.5 : -0.5); //      crop opens
  m.glass(at('ingredients', k) + 0.4, [2349, 2637, 2960][i], 0.08, i === 1 ? -0.4 : 0.4); // label lands
});
m.tick(at('ingredients', 6) + 0.05, 0.05);

/* 07 lifestyle — burgundy wipe */
giant(S.model1 + 0.3, -0.4); //                         "Warmth"
m.tick(at('model1', 0.5) + 0.05, 0.07, -0.5); m.tick(at('model1', 1.5) + 0.05, 0.07, -0.5);
m.goldDraw(S.model1 + 0.6, 0.8, 0.025, 1200, 3000, -0.5); // waveform
m.goldDraw(at('model1', 3), 0.5, 0.03, 1800, 4200, -0.5);

/* 08 highlights */
giant(S.highlights + 0.4, -0.3); //                     "Pure"
m.pop(at('highlights', 0.5) + 0.05, 620, 0.1); m.pop(at('highlights', 1) + 0.05, 740, 0.1);
[0, 1].forEach((i) => m.glass(at('highlights', 1.5) + i * 0.3 + 0.25, 2349 + i * 300, 0.09, -0.4));

/* 09 final */
m.riser(S.final - 0.9, S.final - 0.05, 0.07);
giant(S.final + 0.1); //                               "Golden"
m.softImpact(S.final + 0.3, 0.3); //                    burgundy band + products
m.rustle(S.final + 0.85, 0.3, 0.06, 0.6);
const logo = at('final', 2);
m.pop(logo + 0.1, 600, 0.12);
m.signature(logo + 1.0, 0.2, G_CHORD); //              logo sweep
m.softImpact(at('final', 3) + 0.1, 0.22); //            final title
m.tick(at('final', 5) + 0.05, 0.05);
m.pop(at('final', 6) + 0.12, 520, 0.18); m.glass(at('final', 6) + 0.17, 1975.53, 0.09); // CTA
m.tick(at('final', 7) + 0.05, 0.04);

/* ═══ TRANSITIONS — exactly one per cut ═══ */
// wipe / slide → whip · zoom / shape → zoom · blur / flash → soft (+ a light bloom on the white flashes)
const KIND = { split: ['whip', 1], macro: ['soft', 1], cup: ['zoom', -1], texture: ['zoom', 1], ingredients: ['whip', -1], model1: ['whip', 1], highlights: ['soft', -1], final: ['soft', 1] };
for (const [id, [kind, dir]] of Object.entries(KIND)) m.transition(S[id], kind, kind === 'soft' ? 0.24 : 0.28, dir);
[S.macro, S.final].forEach((t) => m.bloom(t + 0.05, 0.35, 0.06));

const dest = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio', 'golex-editorial-sfx.wav');
console.log('ok', dest, 'peak', m.write(dest).toFixed(3));
