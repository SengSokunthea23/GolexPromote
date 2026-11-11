/**
 * Tiny dependency-free SFX synthesiser used by the GOLEX sound-design scripts.
 * Everything is generated from noise and oscillators — no samples, no copyrighted audio.
 *
 *   const m = createMixer({ sr: 48000, dur: 30 });
 *   m.whoosh(5.5, 0.8, 0.4); m.glass(6.1); …
 *   m.write('public/audio/x.wav');
 */
import { writeFileSync } from 'node:fs';

export const createMixer = ({ sr = 48000, dur = 30, seed = 7 } = {}) => {
  const SR = sr;
  const N = Math.round(SR * dur);
  const L = new Float32Array(N), R = new Float32Array(N);
  const VL = new Float32Array(N), VR = new Float32Array(N);
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const noise = () => rnd() * 2 - 1;

  const biquad = (type, f, q = 0.707) => {
    const w = (2 * Math.PI * f) / SR, c = Math.cos(w), sn = Math.sin(w), a = sn / (2 * q);
    let b0, b1, b2;
    if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
    else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
    else { b0 = a; b1 = 0; b2 = -a; }
    const a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    return (x) => { const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
  };
  const svf = (q = 1.2) => {
    let low = 0, band = 0;
    return (x, f) => { const F = 2 * Math.sin((Math.PI * Math.min(f, SR / 6)) / SR); low += F * band; const high = x - low - band / q; band += F * high; return band; };
  };

  const put = (t0, gen, len, g = 1, pan = 0, wet = 0.25) => {
    const i0 = Math.round(t0 * SR), n = Math.round(len * SR);
    for (let k = 0; k < n; k++) {
      const i = i0 + k;
      if (i < 0 || i >= N) continue;
      const v = gen(k / SR, k);
      const [l, r] = Array.isArray(v) ? v : [v, v];
      const p = typeof pan === 'function' ? pan(k / n) : pan;
      const gl = g * Math.cos(((p + 1) * Math.PI) / 4) * 1.414, gr = g * Math.sin(((p + 1) * Math.PI) / 4) * 1.414;
      L[i] += l * gl; R[i] += r * gr; VL[i] += l * gl * wet; VR[i] += r * gr * wet;
    }
  };

  /* ── instruments ── */
  /** Whoosh tuning: every whoosh is capped in length and trimmed in level (short, moderate, never dominant). */
  const WHOOSH_MAX = 0.5; //  longest whoosh in seconds
  const WHOOSH_LEN = 0.55; // length scale applied to the requested duration
  const WHOOSH_GAIN = 0.6; // level scale applied to the requested gain
  const whoosh = (tc, d = 0.8, g = 0.4, dir = 0, lo = 300, hi = 5000) => {
    d = Math.min(WHOOSH_MAX, d * WHOOSH_LEN);
    g *= WHOOSH_GAIN;
    const f1 = svf(1.4), f2 = svf(1.4);
    put(tc - d * 0.55, (t) => {
      const k = t / d, env = Math.pow(Math.sin(Math.PI * Math.min(1, k)), 1.6), f = lo + (hi - lo) * Math.sin(Math.PI * Math.min(1, k * 0.9));
      return [f1(noise(), f) * env * 2.2, f2(noise(), f * 1.06) * env * 2.2];
    }, d, g * 0.7, dir ? (q) => dir * (q * 2 - 1) : 0, 0.3);
  };
  const swell = (tEnd, d = 1.0, g = 0.3) => { const f = svf(2); put(tEnd - d, (t) => { const k = t / d, env = Math.pow(k, 3); return f(noise(), 400 + 5000 * k) * env * 2.5 + Math.sin(2 * Math.PI * (200 + 600 * k) * t) * env * 0.08; }, d, g, 0, 0.5); };
  const impact = (t0, g = 0.6, len = 2.0, low = 34) => { const lp = biquad('lp', 1600); let ph = 0; put(t0, (t) => { ph += (2 * Math.PI * (low + 70 * Math.exp(-t / 0.06))) / SR; return Math.sin(ph) * Math.exp(-t / 0.55) * 0.9 + lp(noise()) * Math.exp(-t / 0.025) * 0.6; }, len, g, 0, 0.35); };
  /** Softer, rounder impact for a bright editorial spot. */
  const softImpact = (t0, g = 0.4) => { const lp = biquad('lp', 700); let ph = 0; put(t0, (t) => { ph += (2 * Math.PI * (55 + 45 * Math.exp(-t / 0.08))) / SR; return (Math.sin(ph) * Math.exp(-t / 0.4) + lp(noise()) * Math.exp(-t / 0.05) * 0.35) * Math.min(1, t / 0.006); }, 1.6, g, 0, 0.45); };
  const boom = (t0, g = 0.5) => { let ph = 0; put(t0, (t) => { ph += (2 * Math.PI * (42 + 18 * Math.exp(-t / 0.1))) / SR; return Math.sin(ph) * Math.exp(-t / 0.9) * Math.min(1, t / 0.004); }, 2.5, g, 0, 0.1); };
  /* ── musical key: when set, every tonal sound (bells, gold draws, glass, blooms, signature) snaps to it ── */
  let SCALE = null;
  /** Set the scale as a list of pitch frequencies in any octave, e.g. B♭ major pentatonic. */
  const setScale = (freqs) => { SCALE = freqs; };
  const snap = (f) => {
    if (!SCALE) return f;
    let best = f, bd = 1e9;
    for (const s of SCALE) for (let o = -4; o <= 4; o++) { const c = s * 2 ** o, d = Math.abs(Math.log2(c / f)); if (d < bd) { bd = d; best = c; } }
    return best;
  };

  const bell = (t0, f0 = 1760, g = 0.18, dec = 0.7, pan = 0) => {
    f0 = snap(f0);
    const parts = [[1, 1], [2.01, 0.55], [2.76, 0.4], [4.07, 0.25], [5.4, 0.15]], ph = parts.map(() => rnd() * 6);
    put(t0, (t) => { let y = 0; parts.forEach(([m, a], j) => { y += Math.sin(2 * Math.PI * f0 * m * t + ph[j]) * a * Math.exp(-t / (dec / (1 + j * 0.45))); }); return y * Math.min(1, t / 0.003); }, dec * 4, g, pan, 0.55);
  };
  const goldDraw = (t0, d = 1.2, g = 0.06, from = 1500, to = 4200, pan = 0) => {
    const steps = Math.round(d * 14);
    for (let i = 0; i < steps; i++) { const k = i / steps; bell(t0 + k * d + rnd() * 0.02, from * Math.pow(to / from, k), g * (0.6 + 0.4 * Math.sin(Math.PI * k)), 0.25, pan + (rnd() - 0.5) * 0.6); }
  };
  /** Glass UI "ting": two bright detuned partials with a crystalline decay. */
  const glass = (t0, f = 2400, g = 0.14, pan = 0) => {
    f = snap(f);
    put(t0, (t) => (Math.sin(2 * Math.PI * f * t) + 0.6 * Math.sin(2 * Math.PI * f * 1.502 * t + 1) + 0.3 * Math.sin(2 * Math.PI * f * 2.71 * t)) * Math.exp(-t / 0.16) * Math.min(1, t / 0.002), 0.9, g, pan, 0.5);
  };
  const pop = (t0, f = 900, g = 0.2, pan = 0) => { const hp = biquad('hp', 2500); put(t0, (t) => Math.sin(2 * Math.PI * f * (1 + 0.8 * Math.exp(-t / 0.012)) * t) * Math.exp(-t / 0.045) + hp(noise()) * Math.exp(-t / 0.004) * 0.25, 0.25, g, pan, 0.2); };
  const tick = (t0, g = 0.1, pan = 0) => { const hp = biquad('hp', 3500); put(t0, (t) => hp(noise()) * Math.exp(-t / 0.006) + Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t / 0.01) * 0.3, 0.06, g, pan, 0.15); };
  /** Ingredient movement: a short papery rustle with a soft body. */
  const rustle = (t0, d = 0.35, g = 0.12, pan = 0) => { const bp = biquad('bp', 2200, 0.8); put(t0, (t) => bp(noise()) * Math.sin(Math.PI * Math.min(1, t / d)) * (0.6 + 0.4 * Math.sin(t * 90)) * 2, d, g, pan, 0.2); };
  const riser = (t0, tEnd, g = 0.15) => { const hp = biquad('hp', 1800), d = tEnd - t0; put(t0, (t) => { const k = t / d; return hp(noise()) * Math.pow(k, 2.5) + Math.sin(2 * Math.PI * (300 + 900 * k * k) * t) * Math.pow(k, 3) * 0.15; }, d, g, 0, 0.4); };
  const pour = (t0, d = 1.6, g = 0.3) => {
    const bp = biquad('bp', 900, 0.6), lp = biquad('lp', 2600);
    const env = (t) => Math.min(1, t / 0.12) * Math.min(1, Math.max(0, (d - t) / 0.4));
    put(t0, (t) => lp(bp(noise())) * env(t) * (0.8 + 0.4 * Math.sin(t * 37) * Math.sin(t * 13)) * 2.2, d, g, 0.1, 0.2);
    for (let tb = 0.25; tb < d - 0.1; tb += 0.012 + rnd() * 0.035) {
      const f = 350 + rnd() * 900, dd = 0.02 + rnd() * 0.03, a = 0.25 + rnd() * 0.5;
      put(t0 + tb, (t) => Math.sin(2 * Math.PI * f * (1 + (3 * t) / dd) * t) * Math.sin(Math.PI * Math.min(1, t / dd)), dd, g * a * 0.35, (rnd() - 0.5) * 0.5, 0.15);
    }
  };
  const steam = (t0, t1, g = 0.04) => { const bp = biquad('bp', 3800, 0.5), d = t1 - t0; put(t0, (t) => bp(noise()) * Math.min(1, t / 0.6) * Math.min(1, (d - t) / 0.6) * (0.7 + 0.3 * Math.sin(t * 2.2)), d, g, 0, 0.3); };
  const ambience = (g = 0.03) => { const a = biquad('lp', 500), b = biquad('lp', 700); put(0, (t) => [a(noise()) * 3, b(noise()) * 3].map((v) => v * Math.min(1, t / 1.5) * Math.min(1, (dur - t) / 1.5)), dur, g, 0, 0); };
  /** Soft light bloom: an airy major-ish pad swell with a breathy top. */
  const bloom = (tPeak, d = 0.9, g = 0.12) => { const f = svf(1.5); put(tPeak - d, (t) => { const k = t / d, env = Math.sin((Math.PI / 2) * Math.min(1, k)) * (k > 1 ? Math.exp(-(t - d) / 0.4) : 1); return (f(noise(), 2500 + 3000 * k) * 0.6 + [523.25, 659.25, 783.99].map(snap).reduce((a, fr) => a + Math.sin(2 * Math.PI * fr * t), 0) * 0.08) * env; }, d + 1.2, g, 0, 0.6); };
  /**
   * Transition hit — a layered, clearly audible cut sound centred on `tc`:
   *  low body sweep (pitch-falling sine) + wide air whoosh with doppler pan + bright swish tail.
   *  `kind` shapes the character: 'whip' (fast, bright), 'zoom' (deep, long), 'soft' (airy, gentle).
   */
  const transition = (tc, kind = 'zoom', g = 0.6, dir = 1) => {
    const d = kind === 'whip' ? 0.32 : kind === 'zoom' ? 0.48 : 0.42;
    // air layer (two band sweeps, stereo, doppler pan)
    const fa = svf(0.9), fb = svf(0.9), fh = biquad('hp', 4000);
    const lo = kind === 'soft' ? 400 : 220, hi = kind === 'whip' ? 5000 : kind === 'zoom' ? 3600 : 3000;
    put(tc - d * 0.62, (t) => {
      const k = Math.min(1, t / d);
      const env = Math.pow(Math.sin(Math.PI * k), kind === 'whip' ? 2.2 : 1.4) * (k < 0.62 ? 1 : 1 - 0.3 * (k - 0.62));
      const f = lo + (hi - lo) * Math.pow(Math.sin(Math.PI * Math.min(1, k * 0.95)), 1.2);
      const n1 = noise(), n2 = noise();
      const air = [fa(n1, f), fb(n2, f * 1.08)];
      const sw = fh((n1 + n2) * 0.5) * Math.max(0, k - 0.45) * 0.5;
      return [(air[0] * 2.4 + sw) * env, (air[1] * 2.4 + sw) * env];
    }, d, g, (q) => dir * (q * 1.6 - 0.8), 0.35);
    // body layer: falling sine "vroom" peaking at the cut
    if (kind !== 'soft') {
      let ph = 0;
      put(tc - 0.22, (t) => {
        const k = t / 0.45;
        ph += (2 * Math.PI * (kind === 'zoom' ? 160 - 110 * Math.min(1, k) : 220 - 140 * Math.min(1, k))) / SR;
        return Math.sin(ph) * Math.sin(Math.PI * Math.min(1, k)) * 0.5;
      }, 0.45, g, 0, 0.2);
    }
  };
  /** Bright "swish" for small UI movements — short, high, clearly audible over music. */
  const swish = (tc, g = 0.25, pan = 0) => {
    const f = svf(1.6);
    put(tc - 0.14, (t) => { const k = t / 0.28; return f(noise(), 2500 + 6000 * Math.sin(Math.PI * Math.min(1, k))) * Math.pow(Math.sin(Math.PI * Math.min(1, k)), 2) * 2.5; }, 0.28, g, (q) => pan + (q - 0.5) * 0.8, 0.25);
  };
  /** Sub drop: a felt low hit to anchor a cut. */
  const drop = (t0, g = 0.4) => { let ph = 0; put(t0, (t) => { ph += (2 * Math.PI * (90 * Math.exp(-t / 0.18) + 38)) / SR; return Math.sin(ph) * Math.exp(-t / 0.45) * Math.min(1, t / 0.003); }, 1.6, g, 0, 0.15); };

  const signature = (t0, g = 0.22, chord = [1318.5, 1661.2, 1975.5, 2637]) => { chord.forEach((f, i) => bell(t0 + i * 0.045, f, g * (1 - i * 0.15), 1.4, (i - 1.5) * 0.3)); boom(t0, 0.3); };


  /**
   * Gold-dust twinkles: a bed of tiny in-key bells on a beat-locked grid between t0 and t1.
   * grid0 = time of any beat (keeps the twinkles on the music), step = grid in seconds.
   */
  const twinkles = (t0, t1, { grid0 = 0, step = 0.333, prob = 0.55, g = 0.03, lo = 1400, hi = 4200, dec = 0.4 } = {}) => {
    let t = grid0 + Math.ceil((t0 - grid0) / step) * step;
    for (; t < t1; t += step) {
      if (rnd() > prob) continue;
      const f = lo * Math.pow(hi / lo, rnd());
      bell(t + (rnd() - 0.5) * 0.015, f, g * (0.5 + 0.5 * rnd()), dec * (0.7 + 0.6 * rnd()), (rnd() - 0.5) * 1.6);
    }
  };
  /**
   * Airy pad: soft detuned sines (snapped to the key) with a slow breathing swell per bar and a breathy top.
   */
  const pad = (t0, t1, freqs, g = 0.03, bar = 2.667) => {
    const fs = freqs.map(snap), d = t1 - t0, air = biquad('bp', 5000, 0.4), lpL = biquad('lp', 3000), lpR = biquad('lp', 3000);
    const ph = fs.map(() => [rnd() * 6, rnd() * 6]);
    put(t0, (t) => {
      const env = Math.min(1, t / 1.2) * Math.min(1, Math.max(0, (d - t) / 1.0));
      const breath = 0.72 + 0.28 * Math.sin((2 * Math.PI * t) / bar - Math.PI / 2) ** 2;
      let l = 0, r = 0;
      fs.forEach((f, i) => {
        const v = 0.5 + 0.5 * Math.sin(t * (0.6 + i * 0.17));
        l += Math.sin(2 * Math.PI * f * 0.997 * t + ph[i][0]) * v;
        r += Math.sin(2 * Math.PI * f * 1.003 * t + ph[i][1]) * v;
      });
      const a = air(noise()) * 0.35;
      return [lpL(l / fs.length) * env * breath + a * env, lpR(r / fs.length) * env * breath + a * env];
    }, d, g, 0, 0.7);
  };

  /* ── reverb + write ── */
  const reverb = (inp, spread) => {
    const out = new Float32Array(N);
    const cb = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116].map((d) => ({ buf: new Float32Array(d + spread), i: 0, lp: 0 }));
    const ab = [556, 441, 341, 225].map((d) => ({ buf: new Float32Array(d + spread), i: 0 }));
    for (let n = 0; n < N; n++) {
      const x = inp[n] * 0.015;
      let y = 0;
      for (const c of cb) { const o = c.buf[c.i]; c.lp = o * 0.72 + c.lp * 0.28; c.buf[c.i] = x + c.lp * 0.86; c.i = (c.i + 1) % c.buf.length; y += o; }
      for (const a of ab) { const o = a.buf[a.i]; a.buf[a.i] = y + o * 0.5; a.i = (a.i + 1) % a.buf.length; y = o - y; }
      out[n] = y;
    }
    return out;
  };
  const write = (dest, target = 0.89, drive = 1.1) => {
    const WL = reverb(VL, 0), WR = reverb(VR, 23);
    const ml = new Float32Array(N), mr = new Float32Array(N);
    let peak = 0;
    for (let i = 0; i < N; i++) { ml[i] = Math.tanh((L[i] + WL[i]) * drive); mr[i] = Math.tanh((R[i] + WR[i]) * drive); peak = Math.max(peak, Math.abs(ml[i]), Math.abs(mr[i])); }
    const norm = target / peak;
    const out = Buffer.alloc(44 + N * 4);
    out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVE', 8); out.write('fmt ', 12);
    out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22); out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
    out.write('data', 36); out.writeUInt32LE(N * 4, 40);
    for (let i = 0; i < N; i++) {
      const fade = Math.min(1, (N - i) / (SR * 0.5));
      out.writeInt16LE(Math.round(ml[i] * norm * fade * 32767), 44 + i * 4);
      out.writeInt16LE(Math.round(mr[i] * norm * fade * 32767), 46 + i * 4);
    }
    writeFileSync(dest, out);
    return peak;
  };

  return { setScale, snap, twinkles, pad, transition, swish, drop, whoosh, swell, impact, softImpact, boom, bell, goldDraw, glass, pop, tick, rustle, riser, pour, steam, ambience, bloom, signature, write, rnd };
};
