/** Shared easing + directional blur, re-exported from the Royal Silk kit so all themes move the same way. */
import { clamp } from '../lib/easing';
export { DirBlur, backOut, cubicIn, cubicInOut, cubicOut, exitK, expoOut, prog } from '../lux/kit';
export const clampN = (x: number) => clamp(x);
