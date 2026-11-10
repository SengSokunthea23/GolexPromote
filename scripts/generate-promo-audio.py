"""Warm cinematic music bed + whooshes, impacts and chimes for the GOLEX promo (30 s).
Usage: python3 scripts/generate-promo-audio.py -> public/audio/golex-promo.wav
Cut times mirror src/promo/timeline.ts."""
import os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR, DUR = 44100, 30.0
N = int(SR * DUR)
rng = np.random.default_rng(21)
mus = np.zeros((N, 2)); fx = np.zeros((N, 2))

def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)

t_ir = np.arange(int(SR * 2.4)) / SR
IR = rng.normal(0, 1, (len(t_ir), 2)) * np.exp(-t_ir / .6)[:, None]
IR = np.stack([lp(IR[:, 0], 5500), lp(IR[:, 1], 6000)], 1); IR /= np.abs(IR).sum(0) ** .5 * 6
def verb(st, wet):
    w = np.stack([fftconvolve(st[:, c], IR[:, c])[:len(st)] for c in range(2)], 1)
    return st * (1 - wet) + w * wet
def put(buf, t0, st, g):
    i = int(t0 * SR)
    if i < 0: st = st[-i:]; i = 0
    n = min(len(st), N - i)
    if n > 0: buf[i:i + n] += st[:n] * g

def hz(m): return 440 * 2 ** ((m - 69) / 12)

# ── music: slow pad progression (Dm9 · Bbmaj7 · Fmaj7 · Cadd9), 7.5 s each ─────────────
CH = [[38, 45, 53, 60, 64], [34, 41, 57, 62, 65], [41, 48, 52, 57, 64], [36, 43, 52, 55, 62]]
for ci, notes in enumerate(CH):
    t0 = ci * 7.5 - 0.6; ln = 9.0
    n = int(ln * SR); t = np.arange(n) / SR
    env = np.clip(t / 2.0, 0, 1) * np.clip((ln - t) / 2.0, 0, 1)
    pad = np.zeros(n)
    for m in notes:
        for d in (-0.15, 0.15):
            f = hz(m) * (1 + d * 0.01)
            pad += (np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) + .15 * np.sin(6 * np.pi * f * t)) / len(notes)
    pad = lp(pad * env, 2200)
    st = np.stack([pad, np.roll(pad, 260)], 1)
    put(mus, max(t0, 0) if t0 < 0 else t0, st if t0 >= 0 else st[int(-t0 * SR):], 0.55)

# arpeggio: soft bell-like plucks from 3 s on, 8th notes at 96 bpm
beat = 60 / 96 / 2
arp_notes = [[62, 69, 72, 76], [58, 65, 69, 74], [60, 65, 69, 72], [60, 67, 71, 74]]
k = 0; t = 3.0
while t < 29.0:
    ci = min(int(t // 7.5), 3); m = arp_notes[ci][k % 4] + (12 if (k // 4) % 4 == 3 else 0)
    n = int(1.4 * SR); tt = np.arange(n) / SR; f = hz(m)
    y = (np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * f * 2.01 * tt) + .15 * np.sin(2 * np.pi * f * 3.02 * tt)) * np.exp(-tt / .35)
    y *= np.clip(tt / .004, 0, 1)
    st = np.stack([y * (.8 + .2 * (k % 2)), y * (1 - .2 * (k % 2))], 1)
    put(mus, t, verb(np.vstack([st, np.zeros((SR, 2))]), .45), 0.09)
    t += beat; k += 1

# heartbeat pulse (soft, from 3 s)
for tb in np.arange(3.0, 29.5, 60 / 96):
    n = int(.3 * SR); tt = np.arange(n) / SR
    y = np.sin(2 * np.pi * (48 + 40 * np.exp(-tt / .04)) * tt) * np.exp(-tt / .12)
    put(mus, tb, np.stack([y, y], 1), 0.16)

# ── sound design ────────────────────────────────────────────────────────────────────────
def whoosh(tc, dur=.8, g=.2):
    n = int(dur * SR); t = np.linspace(0, 1, n); x = rng.normal(0, 1, n)
    y = (bp(x, 200, 700) * (1 - t) + bp(x, 700, 2200) * np.sin(np.pi * t) + bp(x, 2200, 7000) * t * .6) * np.sin(np.pi * t) ** 1.5
    st = np.stack([y * np.cos(t * np.pi / 2), y * np.sin(t * np.pi / 2)], 1); st /= np.abs(st).max() + 1e-9
    put(fx, tc - dur * .55, verb(np.vstack([st, np.zeros((SR, 2))]), .3), g)
def impact(t0, g=.4):
    n = int(1.7 * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * np.cumsum(32 + 42 * np.exp(-t / .08)) / SR) * np.exp(-t / .5) + lp(rng.normal(0, 1, n), 1800) * np.exp(-t / .03) * .5
    st = np.stack([y, y], 1); st /= np.abs(st).max(); put(fx, t0, verb(st, .35), g)
def shimmer(t0, g=.08, base=1760, dur=1.8):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for j, m in enumerate([1, 1.5, 2, 2.5, 3, 4]):
        y += np.sin(2 * np.pi * base * m * (1 + rng.uniform(-.003, .003)) * t + rng.uniform(0, 6)) * np.exp(-t / (.55 / (1 + j * .2))) / (1 + j * .5)
    y *= np.clip(t / .015, 0, 1); st = np.stack([y * .9, np.roll(y, 220)], 1); st /= np.abs(st).max()
    put(fx, t0, verb(np.vstack([st, np.zeros((SR, 2))]), .55), g)
def riser(t0, t1, g=.15):
    n = int((t1 - t0) * SR); t = np.linspace(0, 1, n); x = hp(rng.normal(0, 1, n), 1500) * t ** 2.5
    st = np.stack([x, np.roll(x, 300)], 1); st /= np.abs(st).max(); put(fx, t0, st, g)
def steam(t0, t1, g=.03):
    n = int((t1 - t0) * SR); t = np.arange(n) / SR
    y = bp(rng.normal(0, 1, n), 900, 4500) * (.6 + .4 * np.sin(2 * np.pi * .35 * t)) * np.clip(t / .5, 0, 1) * np.clip((t1 - t0 - t) / .5, 0, 1)
    st = np.stack([y, np.roll(y, 1500)], 1); st /= np.abs(st).max(); put(fx, t0, st, g)

riser(0.0, 0.7, .15); impact(0.75, .5)
for c in [3, 7, 11, 15.5, 20, 24, 27]:
    whoosh(c, .8 if c in (3, 7, 20, 27) else .6, .22 if c in (3, 7, 20, 27) else .14)
    if c in (3, 7, 20, 27): impact(c + .02, .3)
for tt, b in [(1.3, 1568), (3.9, 1760), (8.0, 1760), (12.2, 1760), (16.5, 2093), (20.5, 1760), (24.4, 1975), (27.9, 2093)]: shimmer(tt, .07, b)
for tt in [12.4, 12.9, 13.4, 13.9, 14.4, 16.4, 17.4, 18.4]: shimmer(tt, .04, 2637, .9)
shimmer(28.7, .1, 1975, 2.2); impact(28.6, .2)
steam(3.0, 7.0); steam(20.0, 27.0, .02)

mix = np.tanh((mus + fx * 1.15) * 1.1) / 1.1
mix[:int(.05 * SR)] *= np.linspace(0, 1, int(.05 * SR))[:, None]
mix[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))[:, None]
mix = mix / np.abs(mix).max() * .85
out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'golex-promo.wav')
wavfile.write(out, SR, (mix * 32767).astype(np.int16)); print('ok', out)
