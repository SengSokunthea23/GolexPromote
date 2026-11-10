import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, rgba } from '../theme/colors';

/** Espresso-black cinematic vignette for depth. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 72% 70% at 50% 47%, ${rgba(COLORS.espresso, 0)} 55%, ${rgba(COLORS.espresso, 0.5)} 100%)`,
    }}
  />
);
