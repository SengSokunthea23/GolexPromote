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
        // background-clip:text only paints glyph parts inside the element's box. Khmer stacks (top vowel +
        // subscript, e.g. ថ្មី ខ្ញី) reach well beyond the line box, so extend the painted area vertically
        // with padding and cancel it with an equal negative margin — layout is unchanged, nothing is cut.
        paddingTop: Math.round(size * (family === 'khmer' ? 0.45 : 0.2)),
        paddingBottom: Math.round(size * (family === 'khmer' ? 0.45 : 0.2)),
        marginTop: -Math.round(size * (family === 'khmer' ? 0.45 : 0.2)),
        marginBottom: -Math.round(size * (family === 'khmer' ? 0.45 : 0.2)),
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
