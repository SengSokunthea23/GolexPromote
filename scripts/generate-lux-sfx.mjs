/**
 * Sound design for "Royal Silk · សូត្រមាស" (GolexKhmerLux) — pure Node, no dependencies.
 * Usage: node scripts/generate-lux-sfx.mjs  ->  public/audio/golex-lux-sfx.wav
 *
 * Everything is synthesised (no samples, no copyrighted audio) and placed on the beat grid of
 * "Golden Bells" measured for src/lux/timeline.ts (102.9 BPM, first downbeat 0.356 s).
 * The music itself is played from the mp3 inside the composition; this file is SFX only.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SR = 48000;
const DUR = 30;
const N = SR * DUR;
const BEAT = 0.5831;
const BAR = BEAT * 4;
const bar = (n) => 0.356 + n * BAR;
const L = new Float32Array(N);
const R = new Float32Array(N);

/* ── deterministic noise ── */
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = () => rnd() * 2 - 1;

/* ── RBJ biquad ── */
const biquad = (type, f, q = 0.707) => {
  const w = (2 * Math.PI * f) / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q);
  let b0, b1, b2, a0, a1, a2;
  if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
  else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
  else { b0 = a; b1 = 0; b2 = -a; } // band-pass (0 dB peak)
  a0 = 1 + a; a1 = -2 * c; a2 = 1 - a;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x) => { const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
};
/* ── state-variable filter with per-sample cutoff (for sweeps) ── */
const svf = (q = 1.2) => {
  let low = 0, band = 0;
  return (x, f) => { const F = 2 * Math.sin((Math.PI * Math.min(f, SR / 6)) / SR); low += F * band; const high = x - low - band / q; band += F * high; return band; };
};

/* ── reverb send bus (Freeverb-style) ── */
const VL = new Float32Array(N), VR = new Float32Array(N);
const reverb = () => {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116];
  const aps = [556, 441, 341, 225];
  const run = (inp, spread) => {
    const out = new Float32Array(N);
    const cb = combs.map((d) => ({ buf: new Float32Array(d + spread), i: 0, lp: 0 }));
    const ab = aps.map((d) => ({ buf: new Float32Array(d + spread), i: 0 }));
    for (let n = 0; n < N; n++) {
      const x = inp[n] * 0.015;
      let y = 0;
      for (const c of cb) { const o = c.buf[c.i]; c.lp = o * 0.72 + c.lp * 0.28; c.buf[c.i] = x + c.lp * 0.86; c.i = (c.i + 1) % c.buf.length; y += o; }
      for (const a of ab) { const o = a.buf[a.i]; a.buf[a.i] = y + o * 0.5; a.i = (a.i + 1) % a.buf.length; y = o - y; }
      out[n] = y;
    }
    return out;
  };
  return [run(VL, 0), run(VR, 23)];
};

/* ── placement ── */
const put = (t0, gen, len, g = 1, pan = 0, wet = 0.25) => {
  const i0 = Math.round(t0 * SR);
  const n = Math.round(len * SR);
  for (let k = 0; k < n; k++) {
    const i = i0 + k;
    if (i < 0 || i >= N) continue;
    const v = gen(k / SR, k);
    const [l, r] = Array.isArray(v) ? v : [v, v];
    const p = typeof pan === 'function' ? pan(k / n) : pan;
    const gl = g * Math.cos(((p + 1) * Math.PI) / 4) * 1.414, gr = g * Math.sin(((p + 1) * Math.PI) / 4) * 1.414;
    L[i] += l * gl; R[i] += r * gr;
    VL[i] += l * gl * wet; VR[i] += r * gr * wet;
  }
};

/* ════════════════════ instruments ════════════════════ */
/** Air whoosh: noise through a swept band-pass, peaking at 55 % of its length. dir pans L↔R. */
const whoosh = (tc, dur = 0.8, g = 0.5, dir = 0, lo = 300, hi = 5000) => {
  const f1 = svf(1.4), f2 = svf(1.4);
  put(tc - dur * 0.55, (t) => {
    const k = t / dur; const env = Math.pow(Math.sin(Math.PI * Math.min(1, k)), 1.6);
    const f = lo + (hi - lo) * Math.sin(Math.PI * Math.min(1, k * 0.9));
    return [f1(noise(), f) * env * 2.2, f2(noise(), f * 1.06) * env * 2.2];
  }, dur, g * 0.7, dir ? (q) => dir * (q * 2 - 1) : 0, 0.3);
};
/** Reverse swell into a focus moment. */
const swell = (tEnd, dur = 1.0, g = 0.35) => {
  const f = svf(2);
  put(tEnd - dur, (t) => { const k = t / dur; const env = Math.pow(k, 3); return f(noise(), 400 + 5000 * k) * env * 2.5 + Math.sin(2 * Math.PI * (200 + 600 * k) * t) * env * 0.08; }, dur, g, 0, 0.5);
};
/** Deep cinematic impact: pitched sub drop + soft transient + room. */
const impact = (t0, g = 0.7, len = 2.0) => {
  const lp = biquad('lp', 1600);
  let ph = 0;
  put(t0, (t) => {
    ph += (2 * Math.PI * (34 + 70 * Math.exp(-t / 0.06))) / SR;
    return Math.sin(ph) * Math.exp(-t / 0.55) * 0.9 + lp(noise()) * Math.exp(-t / 0.025) * 0.6;
  }, len, g, 0, 0.35);
};
/** Sub boom only (felt rather than heard). */
const boom = (t0, g = 0.5) => { let ph = 0; put(t0, (t) => { ph += (2 * Math.PI * (42 + 18 * Math.exp(-t / 0.1))) / SR; return Math.sin(ph) * Math.exp(-t / 0.9) * Math.min(1, t / 0.004); }, 2.5, g, 0, 0.1); };
/** Bell shimmer: inharmonic partials with staggered decays. */
const bell = (t0, f0 = 1760, g = 0.18, dec = 0.7, pan = 0) => {
  const parts = [[1, 1], [2.01, 0.55], [2.76, 0.4], [4.07, 0.25], [5.4, 0.15]];
  const ph = parts.map(() => rnd() * 6);
  put(t0, (t) => { let y = 0; parts.forEach(([m, a], j) => { y += Math.sin(2 * Math.PI * f0 * m * t + ph[j]) * a * Math.exp(-t / (dec / (1 + j * 0.45))); }); return y * Math.min(1, t / 0.003); }, dec * 4, g, pan, 0.55);
};
/** Gold line drawing: a twinkling ascending glissando of tiny bells across `dur`. */
const goldDraw = (t0, dur = 1.3, g = 0.08, from = 1500, to = 4200, pan = 0) => {
  const steps = Math.round(dur * 14);
  for (let i = 0; i < steps; i++) {
    const k = i / steps;
    bell(t0 + k * dur + rnd() * 0.02, from * Math.pow(to / from, k), g * (0.6 + 0.4 * Math.sin(Math.PI * k)), 0.25, pan + (rnd() - 0.5) * 0.6);
  }
};
/** Soft pop for floating graphic elements. */
const pop = (t0, f = 900, g = 0.22, pan = 0) => {
  const hp = biquad('hp', 2500);
  put(t0, (t) => Math.sin(2 * Math.PI * f * (1 + 0.8 * Math.exp(-t / 0.012)) * t) * Math.exp(-t / 0.045) + hp(noise()) * Math.exp(-t / 0.004) * 0.25, 0.25, g, pan, 0.2);
};
/** UI tick. */
const tick = (t0, g = 0.12, pan = 0) => { const hp = biquad('hp', 3500); put(t0, (t) => hp(noise()) * Math.exp(-t / 0.006) + Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t / 0.01) * 0.3, 0.06, g, pan, 0.15); };
/** Card landing: soft felt thud. */
const thud = (t0, g = 0.3) => { let ph = 0; put(t0, (t) => { ph += (2 * Math.PI * (70 + 90 * Math.exp(-t / 0.03))) / SR; return Math.sin(ph) * Math.exp(-t / 0.12); }, 0.5, g, 0, 0.15); };
/** Riser: high-passed noise + rising tone into tEnd. */
const riser = (t0, tEnd, g = 0.2) => { const hp = biquad('hp', 1800); const d = tEnd - t0; put(t0, (t) => { const k = t / d; return hp(noise()) * Math.pow(k, 2.5) + Math.sin(2 * Math.PI * (300 + 900 * k * k) * t) * Math.pow(k, 3) * 0.15; }, d, g, 0, 0.4); };
/** Coffee pour: a liquid stream (band-limited noise) + a cloud of bubble chirps. */
const pour = (t0, dur = 1.6, g = 0.35) => {
  const bp = biquad('bp', 900, 0.6), lp = biquad('lp', 2600);
  const env = (t) => Math.min(1, t / 0.12) * Math.min(1, Math.max(0, (dur - t) / 0.4));
  put(t0, (t) => lp(bp(noise())) * env(t) * (0.8 + 0.4 * Math.sin(t * 37) * Math.sin(t * 13)) * 2.2, dur, g, 0.1, 0.2);
  for (let tb = 0.25; tb < dur - 0.1; tb += 0.012 + rnd() * 0.035) {
    const f = 350 + rnd() * 900, d = 0.02 + rnd() * 0.03, a = 0.25 + rnd() * 0.5;
    put(t0 + tb, (t) => Math.sin(2 * Math.PI * f * (1 + 3 * t / d) * t) * Math.sin(Math.PI * Math.min(1, t / d)), d, g * a * 0.35, (rnd() - 0.5) * 0.5, 0.15);
  }
};
/** Gentle steam / hiss bed. */
const steam = (t0, t1, g = 0.05) => { const bp = biquad('bp', 3800, 0.5); const d = t1 - t0; put(t0, (t) => bp(noise()) * Math.min(1, t / 0.6) * Math.min(1, (d - t) / 0.6) * (0.7 + 0.3 * Math.sin(t * 2.2)), d, g, 0, 0.3); };
/** Warm room ambience under the whole spot (barely-there coffee-house air). */
const ambience = (g = 0.03) => { const lp = biquad('lp', 500), lp2 = biquad('lp', 700); put(0, (t) => [lp(noise()) * 3, lp2(noise()) * 3].map((v) => v * Math.min(1, t / 1.5) * Math.min(1, (DUR - t) / 1.5)), DUR, g, 0, 0); };
/** Premium logo signature: bell chord bloom + sub. */
const signature = (t0, g = 0.25) => {
  [1318.5, 1661.2, 1975.5, 2637].forEach((f, i) => bell(t0 + i * 0.045, f, g * (1 - i * 0.15), 1.4, (i - 1.5) * 0.3));
  boom(t0, 0.35);
};

/* ════════════════════ the score (times in seconds, global) ════════════════════ */
const D = Array.from({ length: 13 }, (_, n) => bar(n));
const b = (n, k) => D[n] + k * BEAT;

ambience(0.035);

// 01 intro
riser(0, D[0] + 0.05, 0.12);
boom(D[0], 0.4);
goldDraw(0.15, 1.5, 0.05, 1200, 3600, -0.2);
swell(1.25, 1.0, 0.3);
bell(1.25, 1975.5, 0.12, 1.0);
signature(1.55, 0.18);
goldDraw(1.0, 0.9, 0.035, 2400, 4800, 0.2); // lotus
whoosh(1.2, 0.5, 0.12, 0.6, 1500, 7000);

// 02 title (cream) — circle reveal
whoosh(D[1], 0.7, 0.5, 0, 250, 4200);
tick(D[1], 0.2);
pop(D[1] + 0.12, 700, 0.18);
impact(b(1, 1), 0.35, 1.4); // "ខ្ញីមាស" scale-in
pop(b(1, 1) + 0.05, 600, 0.2, -0.3); pop(b(1, 1) + 0.25, 760, 0.2, 0.3);
goldDraw(b(1, 2), 0.9, 0.04, 2000, 4500);
[0, 0.16, 0.32, 0.48, 0.64].forEach((d, i) => pop(b(1, 3) + d, 1000 + i * 110, 0.1, (i - 2) * 0.25));

// 03 pack — circle reveal, arch mask, gold outline, orbit; lift at bar 3
whoosh(D[2], 0.75, 0.5, 0, 250, 4000);
swell(D[2] + 1.1, 1.0, 0.25);
goldDraw(D[2] + 0.3, 1.6, 0.04, 1100, 3000, -0.3);
goldDraw(D[2] + 1.2, 1.2, 0.05, 1600, 4400, 0.3);
[0, 0.14, 0.28].forEach((d, i) => pop(D[2] + 0.8 + d, 650 + i * 120, 0.2));
bell(D[2] + 1.9, 2349, 0.1, 0.8, 0.4);
whoosh(D[2] + 1.6, 0.6, 0.1, -0.7, 400, 2600); // orbit pass
impact(D[3], 0.6);
whoosh(D[3], 0.5, 0.25, 0, 600, 6000);
bell(D[3] + 0.02, 1760, 0.14, 1.2);
goldDraw(D[3] + 0.5, 1.0, 0.035, 2000, 4400);
[0, 0.06, 0.12, 0.18, 0.24].forEach((d, i) => tick(D[3] + 0.8 + d, 0.07, (i - 2) * 0.3));

// 04 cup — zoom-through, pour, orbit, steam
whoosh(D[4], 0.9, 0.6, 0, 200, 3500);
boom(D[4], 0.35);
pour(D[4] + 0.25, 1.75, 0.4);
steam(D[4] + 1.5, D[6] + 0.4, 0.05);
goldDraw(D[4] + 0.6, 1.2, 0.04, 1300, 3400);
for (let tp = D[4] + 1.6; tp < D[6]; tp += 1.67) whoosh(tp, 0.55, 0.09, 0.8, 500, 3000); // ingredients pass in front
[0, 1, 2].forEach((i) => pop(b(4, 1) + i * BEAT, 820 + i * 140, 0.22, (i - 1) * 0.4));
bell(b(4, 4), 2093, 0.12, 0.9, -0.3);
whoosh(D[5], 0.5, 0.2, -0.5, 500, 5000);
[0, 0.14, 0.28].forEach((d, i) => pop(D[5] + 0.05 + d, 700 + i * 100, 0.16));
goldDraw(D[5] + 0.6, 0.9, 0.035, 2000, 4500);

// 05 ingredients — whip, cards land on the beats
whoosh(D[6], 0.55, 0.6, -1, 300, 6500);
[1, 2, 3].forEach((k, i) => { whoosh(b(6, k) + 0.12, 0.4, 0.14, 0, 600, 3500); thud(b(6, k) + 0.35, 0.3); pop(b(6, k) + 0.4, 880 + i * 160, 0.2, (i - 1) * 0.6); });
bell(b(6, 2) + 0.2, 2349, 0.08, 0.7, -0.5); bell(b(6, 4), 2637, 0.08, 0.7, 0.5); bell(b(6, 6), 2093, 0.1, 0.9);
boom(D[7], 0.3);
goldDraw(D[7], 1.0, 0.04, 1800, 4200);
[0, 0.15].forEach((d, i) => pop(D[7] + 0.15 + d, 760 + i * 150, 0.16));

// 06 benefits — whip, sachet turns, chips on half-beats
whoosh(D[8], 0.55, 0.6, 1, 300, 6500);
whoosh(D[8] + 0.35, 0.5, 0.16, -0.6, 400, 3000);
goldDraw(D[8] + 0.15, 1.2, 0.035, 1400, 3600, -0.4);
for (let i = 0; i < 5; i++) { whoosh(D[8] + 0.2 + i * (BEAT / 2) + 0.18, 0.3, 0.07, 0.5, 1500, 6000); pop(D[8] + 0.2 + i * (BEAT / 2) + 0.2, 950 + i * 120, 0.17, 0.4); }

// 07 model 1 — circle reveal, arch draws
whoosh(D[9], 0.7, 0.5, 0, 250, 4200);
impact(D[9], 0.35, 1.5);
goldDraw(D[9] + 0.15, 1.2, 0.04, 1100, 3200);
bell(b(9, 2), 1975.5, 0.12, 1.0, -0.2);
[0, 0.16].forEach((d, i) => pop(D[9] + 0.25 + d, 720 + i * 120, 0.16));

// 08 model 2 — lift (the music breathes)
whoosh(D[10], 0.8, 0.35, 0, 200, 2600);
goldDraw(D[10] + 0.45, 0.9, 0.04, 1500, 3800, -0.2);
tick(D[10] + 0.9, 0.14, -0.4);
whoosh(D[10] + 1.2, 0.35, 0.06, -0.6, 2500, 8000); // leader line zip
bell(b(10, 2), 2093, 0.1, 0.9, 0.2);

// 09 end card — the big hit
riser(D[11] - 1.2, D[11], 0.14);
whoosh(D[11], 1.0, 0.55, 0, 180, 3800);
impact(D[11], 0.85, 2.6);
whoosh(D[11] + 0.25, 0.5, 0.18, 0.8, 400, 3000);
whoosh(D[11] + 0.35, 0.5, 0.18, -0.8, 400, 3000);
goldDraw(D[11] + 0.1, 1.2, 0.045, 1100, 3300);
bell(D[11] + 0.9, 2349, 0.12, 1.0, 0.4);
signature(D[11] + 1.25, 0.26); // logo sheen
[0, 0.18].forEach((d, i) => pop(D[11] + 0.6 + d, 640 + i * 160, 0.18));
pop(D[11] + 1.5, 520, 0.25); bell(D[11] + 1.55, 1760, 0.1, 0.8); // CTA
impact(D[12], 0.45, 2.4); // final warm cinematic hit as the music lands
signature(D[12] + 0.02, 0.2);

/* ════════════════════ mix & write ════════════════════ */
const [WL, WR] = reverb();
const out = Buffer.alloc(44 + N * 4);
let peak = 0;
const mixL = new Float32Array(N), mixR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  mixL[i] = Math.tanh((L[i] + WL[i]) * 1.1);
  mixR[i] = Math.tanh((R[i] + WR[i]) * 1.1);
  peak = Math.max(peak, Math.abs(mixL[i]), Math.abs(mixR[i]));
}
const norm = 0.89 / peak;
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVE', 8); out.write('fmt ', 12);
out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22); out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
out.write('data', 36); out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, (N - i) / (SR * 0.5));
  out.writeInt16LE(Math.round(mixL[i] * norm * fade * 32767), 44 + i * 4);
  out.writeInt16LE(Math.round(mixR[i] * norm * fade * 32767), 46 + i * 4);
}
const dest = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio', 'golex-lux-sfx.wav');
writeFileSync(dest, out);
console.log('ok', dest, 'peak', peak.toFixed(3));
