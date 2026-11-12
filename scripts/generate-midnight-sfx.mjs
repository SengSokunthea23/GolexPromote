/**
 * Sound design for the Midnight Luxury Edition (GolexMidnight) — 30 s.
 * Usage: node scripts/generate-midnight-sfx.mjs  ->  public/audio/golex-midnight-sfx.wav
 *
 * Every sound answers a visual event in src/midnight/scenes.tsx, on the beat grid of "Rising Gold"
 * (128.75 BPM, beat 0.466 s, first downbeat 0.754 s, key B major) — see src/midnight/timeline.ts.
 * Restraint rule: one transition sound per cut, deep hits only on the logo, the drop and the end card.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMixer } from './lib/sfx-engine.mjs';

const DUR = 30;
const BEAT = 0.466;
const bar = (n) => 0.754 + n * BEAT * 4;
const B = (k) => k * BEAT;

// scene starts — mirrors M_SCENES
const S = { open: 0, split: bar(1.5), macro: bar(3), cup: bar(4.5), texture: bar(6.5), ingredients: bar(8), model1: bar(10), highlights: bar(11.5), final: bar(13) };
const at = (id, k) => S[id] + B(k);

const m = createMixer({ sr: 48000, dur: DUR, seed: 23 });
// "Rising Gold" is in B major — every tonal sound is tuned to B major pentatonic (B C♯ D♯ F♯ G♯)
m.setScale([493.88, 554.37, 622.25, 739.99, 830.61]);
const B_CHORD = [987.77, 1244.51, 1479.98, 1975.53]; // B5 D♯6 F♯6 B6 — logo signature

/* ═══ atmosphere ═══ */
m.ambience(0.03); //                                  dark room air
m.pad(0, DUR, [123.47, 185.0, 246.94], 0.09); //      low B drone: the midnight stage

/* 01 open — black → gold line → logo traced in gold → headline */
m.tick(0.15, 0.06);
m.goldDraw(0.15, 0.9, 0.03, 900, 2600); //            thin gold line opens
m.swell(0.75, 0.6, 0.12);
m.impact(0.75, 0.42, 2.2); //                         logo emerges (deep reveal)
m.goldDraw(1.0, 0.9, 0.035, 1500, 4200, 0.2); //      logo traced in light
m.bell(1.65, 1975.53, 0.08, 1.2); //                  logo sheen
m.pop(1.25, 620, 0.12); //                            "បទពិសោធន៍ថ្មី"
m.softImpact(1.72, 0.3); m.bell(1.74, 1479.98, 0.08, 1.0); // gold "កាហ្វេខ្ញី 5IN1"
m.tick(2.42, 0.05); //                                English label

/* 02 split — pack emerges under a spotlight */
m.pulse(S.split + 0.1, 246.94, 0.12);
[1, 2, 3].forEach((k, i) => m.tick(at('split', k) + 0.1, 0.07, -0.5 + i * 0.1)); // headline words
m.bell(S.split + 1.25, 1244.51, 0.06, 0.9, 0.5); //   pack sheen
m.goldDraw(at('split', 3.5), 0.7, 0.03, 1800, 4200, -0.4); // underline
m.glass(at('split', 4) + 0.15, 2489, 0.1, -0.4); m.pulse(at('split', 4) + 0.15, 493.88, 0.08, -0.4); // dark glass card

/* 03 macro — THE DROP */
m.impact(S.macro + 0.01, 0.55, 2.0);
m.boom(S.macro + 0.01, 0.35);
m.bell(S.macro + 0.4, 1975.53, 0.07, 0.9); m.bell(at('macro', 4) + 0.1, 1661.22, 0.06, 0.9); // two metallic sweeps
m.pop(at('macro', 1) + 0.1, 700, 0.12); m.pop(at('macro', 1) + 0.3, 830, 0.11);
m.tick(at('macro', 2.5) + 0.1, 0.06); m.tick(at('macro', 3.5) + 0.1, 0.05);

/* 04 cup — glowing circle reveal, the pour, steam, orbit */
m.pour(S.cup + 0.35, 1.0, 0.3);
m.steam(S.cup + 1.4, S.texture + 0.4, 0.045);
m.goldDraw(S.cup + 0.3, 1.2, 0.03, 1100, 3000); //    HUD halo draws
m.softImpact(at('cup', 2) + 0.12, 0.32); m.bell(at('cup', 2) + 0.14, 1479.98, 0.08, 1.1); // "ឈ្ងុយឆ្ងាញ់"
m.bell(S.cup + 1.45, 2489.0, 0.05, 0.9, 0.3); m.bell(S.cup + 3.05, 1975.53, 0.05, 0.9, -0.3); // cup sheens
m.goldDraw(at('cup', 4), 0.7, 0.03, 1800, 4200); //   underline

/* 05 texture — crema lens */
m.goldDraw(S.texture + 0.3, 1.1, 0.03, 1300, 3400); // halo draws
m.rustle(S.texture + 0.45, 0.35, 0.07, -0.7); m.rustle(S.texture + 0.65, 0.3, 0.06, 0.7);
m.tick(at('texture', 1) + 0.15, 0.05);
m.bell(S.texture + 1.05, 1975.53, 0.05, 1.0);
m.pop(at('texture', 2) + 0.1, 680, 0.11); m.pop(at('texture', 2) + 0.3, 800, 0.1);
m.goldDraw(at('texture', 3), 0.7, 0.03, 1800, 4200);

/* 06 ingredients — each ingredient emerges, its gold annotation line draws */
[2.5, 3.5, 4.5].forEach((k, i) => {
  const tt = at('ingredients', k);
  m.rustle(tt + 0.1, 0.35, 0.08, -0.5);
  m.pulse(tt + 0.25, [246.94, 311.13, 369.99][i], 0.1, 0.2);
  m.goldDraw(tt + 0.3, 0.5, 0.03, 2000, 4400, 0.4); // annotation line
  m.tick(tt + 0.75, 0.06, 0.5); //                   label lands
});
m.tick(at('ingredients', 6.5) + 0.1, 0.05);

/* 07 model 1 — emerges from darkness with rim light */
m.boom(S.model1 + 0.05, 0.25);
m.goldDraw(S.model1 + 0.4, 0.9, 0.025, 1200, 2800, 0.3); // rim light blooms
m.tick(at('model1', 1) + 0.1, 0.07, -0.5); m.tick(at('model1', 2) + 0.1, 0.07, -0.5);
m.bell(at('model1', 3) + 0.2, 1661.22, 0.05, 0.9, -0.4);

/* 08 highlights — feature cards + infographic curve */
m.goldDraw(S.highlights + 0.35, 1.0, 0.03, 1400, 3400, 0.4); // halo
m.pop(at('highlights', 1) + 0.1, 700, 0.11); m.pop(at('highlights', 2) + 0.1, 820, 0.1);
m.goldDraw(at('highlights', 2), 1.0, 0.025, 1600, 3800, 0.5); // curve draws
[0, 1].forEach((i) => { const tt = at('highlights', 2.5) + i * 0.35; m.glass(tt + 0.2, 2217 + i * 272, 0.11, -0.4); m.pulse(tt + 0.2, 493.88, 0.07, -0.4); });

/* 09 final — hero composition, logo traced in light, CTA */
m.riser(S.final - 1.0, S.final, 0.09);
m.impact(S.final + 0.02, 0.5, 2.6);
m.goldDraw(S.final + 0.3, 1.2, 0.03, 1100, 3200); //  halo
m.rustle(S.final + 1.0, 0.35, 0.07, 0.6);
const logo = at('final', 2);
m.pop(logo + 0.1, 600, 0.12);
m.goldDraw(logo + 0.2, 0.9, 0.035, 1500, 4200); //    logo traced in light
m.signature(logo + 1.1, 0.2, B_CHORD); //            logo sheen
m.tick(at('final', 5) + 0.1, 0.06);
m.pop(at('final', 6) + 0.15, 520, 0.18); m.glass(at('final', 6) + 0.2, 1975.53, 0.09); // CTA
m.tick(at('final', 7) + 0.1, 0.04);

/* ═══ TRANSITIONS — exactly one per cut, shaped by the visual transition ═══ */
const KIND = { split: ['whip', 1], macro: ['zoom', 1], cup: ['zoom', -1], texture: ['zoom', 1], ingredients: ['whip', -1], model1: ['soft', 1], highlights: ['soft', -1], final: ['zoom', 1] };
for (const [id, [kind, dir]] of Object.entries(KIND)) m.transition(S[id], kind, kind === 'soft' ? 0.26 : 0.3, dir);

const dest = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio', 'golex-midnight-sfx.wav');
console.log('ok', dest, 'peak', m.write(dest).toFixed(3));
