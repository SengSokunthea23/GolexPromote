import React from 'react';
import { easeInOut, easeOut } from '../lib/easing';
import { useTime } from '../lib/useTime';

export type RevealMode = 'rise' | 'fade' | 'wipe' | 'center' | 'vwipe';

type Props = {
  start: number;
  end: number;
  mode?: RevealMode;
  ein?: number;
  eout?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * Elegant entrance / exit for any element.
 * - rise: fades up 22px
 * - wipe: soft-edged mask reveal left → right
 * - center: mask opens from the centre outward (used for rule labels)
 * - vwipe: top → bottom (vertical gold dividers)
 * Exit is always a gentle fade with a 14px lift.
 */
/** Extra masked area above/below the content, so tall Khmer glyphs are never clipped mid-reveal. */
const MASK_PAD = 70;

export const Reveal: React.FC<Props> =({ start, end, mode = 'rise', ein = 0.7, eout = 0.35, children, style }) => {
  const t = useTime();
  if (t < start || t > end) return null;
  const p = easeOut((t - start) / ein);
  const out = t > end - eout ? 1 - easeInOut((t - (end - eout)) / eout) : 1;
  const lift = -14 * (1 - out);

  let opacity = out;
  let dy = lift;
  let mask: string | undefined;
  if (mode === 'rise') {
    opacity *= p;
    dy += 22 * (1 - p);
  } else if (mode === 'fade') {
    opacity *= p;
  } else if (mode === 'wipe' || mode === 'vwipe') {
    const e = p * 118;
    mask = `linear-gradient(${mode === 'wipe' ? 90 : 180}deg, #000 ${e - 18}%, transparent ${e}%)`;
  } else if (mode === 'center') {
    const h = p * 60;
    mask = `linear-gradient(90deg, transparent ${50 - h}%, #000 ${50 - h + 10}%, #000 ${50 + h - 10}%, transparent ${50 + h}%)`;
  }

  // A mask only covers the element's own box, and anything outside it is hidden. Khmer stacks (top vowels,
  // subscripts like ហ្វេ ខ្ញី) reach above and below the line box, so:
  //  1. once the reveal has finished, the mask is removed entirely (it would otherwise keep cutting them);
  //  2. while it animates, the masked box is extended vertically (padding cancelled by negative margin).
  if (p >= 0.999) mask = undefined;
  const pad = mask ? MASK_PAD : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${dy}px)`,
        WebkitMaskImage: mask,
        maskImage: mask,
        paddingTop: pad,
        paddingBottom: pad,
        marginTop: -pad,
        marginBottom: -pad,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
