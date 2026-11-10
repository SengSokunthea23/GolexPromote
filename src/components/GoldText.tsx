import React from 'react';
import { COLORS, GOLD_GRADIENT, rgba } from '../theme/colors';
import { FONTS } from '../theme/fonts';

export type TypeStyle = {
  family: keyof typeof FONTS;
  weight: number;
  size: number;
  italic?: boolean;
  /** letter-spacing in px */
  tracking?: number;
  variant?: 'gold' | 'cream';
  opacity?: number;
};

/** Shared typographic style: metallic gold or warm cream, with a soft espresso shadow. */
export const typeStyle = ({ family, weight, size, italic, tracking = 0, variant = 'gold', opacity = 1 }: TypeStyle): React.CSSProperties => ({
  fontFamily: FONTS[family],
  fontWeight: weight,
  fontStyle: italic ? 'italic' : 'normal',
  fontSize: size,
  letterSpacing: tracking,
  // letter-spacing adds trailing space after the last glyph; pad the left so centring stays true
  paddingLeft: tracking,
  lineHeight: family === 'khmer' ? 1.35 : 1.15,
  whiteSpace: 'pre',
  opacity,
  ...(variant === 'gold'
    ? {
        backgroundImage: GOLD_GRADIENT,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        filter: `drop-shadow(0 ${Math.round(size * 0.05) + 1}px ${Math.round(size * 0.1)}px ${rgba(COLORS.espresso, 0.75)})`,
      }
    : {
        color: COLORS.cream,
        textShadow: `0 ${Math.round(size * 0.05) + 1}px ${Math.round(size * 0.12)}px ${rgba(COLORS.espresso, 0.8)}`,
      }),
});

export const GoldText: React.FC<TypeStyle & { children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style, ...t }) => (
  <span style={{ ...typeStyle(t), display: 'inline-block', ...style }}>{children}</span>
);
