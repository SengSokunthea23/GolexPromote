export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const easeInOut = (x: number) => {
  const v = clamp(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};

/** 0→1 entrance over `ein` from t0, 1→0 exit over `eout` ending at t1. */
export const envelope = (t: number, t0: number, t1: number, ein = 0.5, eout = 0.4) => {
  if (t < t0 || t > t1) return 0;
  const inn = easeOut((t - t0) / ein);
  const out = t > t1 - eout ? 1 - easeInOut((t - (t1 - eout)) / eout) : 1;
  return inn * out;
};

/** Gaussian pulse centred on tc. */
export const pulse = (t: number, tc: number, width: number) => Math.exp(-(((t - tc) / width) ** 2));
