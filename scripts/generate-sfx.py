"""Synthesises the GOLEX sound-design bed (whooshes, impacts, chimes, steam).
Usage: python3 scripts/generate-sfx.py  ->  public/audio/golex-sfx.wav
Timings mirror src/theme/timeline.ts."""
import os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100; DUR = 30.0
N = int(SR * DUR)
out = np.zeros((N, 2))
rng = np.random.default_rng(5)

def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)

IR_T = np.arange(int(SR * 2.2)) / SR
IR = rng.normal(0, 1, (len(IR_T), 2)) * np.exp(-IR_T / .55)[:, None]
IR = np.stack([lp(IR[:, 0], 6000), lp(IR[:, 1], 6500)], 1); IR /= np.abs(IR).sum(0) ** .5 * 6

def verb(st, wet=.35):
    w = np.stack([fftconvolve(st[:, c], IR[:, c])[:len(st)] for c in range(2)], 1)
    return st * (1 - wet) + w * wet

def put(t0, st, gain):
    i = int(t0 * SR)
    if i < 0: st = st[-i:]; i = 0
    n = min(len(st), N - i)
    out[i:i + n] += st[:n] * gain

def whoosh(tc, dur=.7, g=.25):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    x = rng.normal(0, 1, n)
    # three bands crossfaded to fake a frequency sweep
    lo, mid, hi = bp(x, 200, 700), bp(x, 700, 2200), bp(x, 2200, 7000)
    sw = np.sin(np.pi * t) ** 2
    y = lo * (1 - t) + mid * np.sin(np.pi * t) + hi * t * .6
    y *= sw ** 1.5
    pan = t
    st = np.stack([y * np.cos(pan * np.pi / 2), y * np.sin(pan * np.pi / 2)], 1)
    st /= np.abs(st).max() + 1e-9
    put(tc - dur * .55, verb(np.vstack([st, np.zeros((SR, 2))]), .3), g)

def impact(t0, g=.5):
    n = int(1.6 * SR); t = np.arange(n) / SR
    f = 34 + 40 * np.exp(-t / .08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .45)
    click = lp(rng.normal(0, 1, n), 1800) * np.exp(-t / .03) * .5
    y = boom + click
    st = np.stack([y, y], 1); st /= np.abs(st).max()
    put(t0, verb(st, .35), g)

def shimmer(t0, g=.12, base=1760, dur=1.6):
    n = int(dur * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for k, m in enumerate([1, 1.5, 2, 2.5, 3, 4]):
        fr = base * m * (1 + rng.uniform(-.003, .003))
        y += np.sin(2 * np.pi * fr * t + rng.uniform(0, 6)) * np.exp(-t / (.5 / (1 + k * .2))) / (1 + k * .5)
    y *= np.clip(t / .015, 0, 1)
    st = np.stack([y * .9, np.roll(y, 220)], 1); st /= np.abs(st).max()
    put(t0, verb(np.vstack([st, np.zeros((SR, 2))]), .55), g)

def riser(t0, t1, g=.18):
    n = int((t1 - t0) * SR); t = np.linspace(0, 1, n)
    x = hp(rng.normal(0, 1, n), 1500) * t ** 2.5
    st = np.stack([x, np.roll(x, 300)], 1); st /= np.abs(st).max()
    put(t0, st, g)

def steam(t0, t1, g=.035):
    n = int((t1 - t0) * SR); t = np.arange(n) / SR
    x = bp(rng.normal(0, 1, (n)), 900, 4500)
    mod = .6 + .4 * np.sin(2 * np.pi * .35 * t) * np.sin(2 * np.pi * .13 * t + 1)
    fade = np.clip(t / .5, 0, 1) * np.clip((t1 - t0 - t) / .5, 0, 1)
    y = x * mod * fade
    st = np.stack([y, np.roll(y, 1500)], 1); st /= np.abs(st).max()
    put(t0, st, g)

CUTS = [0.4, 4.4, 8.3, 10.55, 12.95, 15.4, 17.85, 20.35, 23.95, 26.85]
BIG = {0.4, 4.4, 8.3, 20.35, 23.95, 26.85}

riser(0.0, 0.42, .16)
impact(0.42, .55)
for c in CUTS[1:]:
    whoosh(c, .75 if c in BIG else .55, .22 if c in BIG else .14)
    if c in BIG: impact(c + .02, .32)
# text reveals / glints
for t, b in [(1.05, 1568), (4.95, 1760), (20.85, 1568), (24.25, 1760), (27.35, 2093)]:
    shimmer(t, .07, b)
for t in [8.52, 10.77, 13.17, 15.62, 18.07]:  # ingredient cards: soft tick
    shimmer(t, .045, 2637, .9)
shimmer(6.85, .06, 2349); shimmer(28.45, .11, 1975, 2.2); impact(28.3, .22)
steam(0.5, 4.4); steam(8.3, 17.9, .03)

out = np.tanh(out * 1.2) / 1.2
wavfile.write(os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'golex-sfx.wav'), SR, (out * 32767 * .95).astype(np.int16))
print('peak', np.abs(out).max())
