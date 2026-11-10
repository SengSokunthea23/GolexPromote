import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/600-italic.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/manrope/300.css';
import '@fontsource/manrope/500.css';
import '@fontsource/noto-sans-khmer/500.css';
import { continueRender, delayRender } from 'remotion';

/** Typography system: luxury serif (L1) + modern sans (L2–L4). */
export const FONTS = {
  serif: '"Playfair Display", Georgia, serif',
  sans: 'Montserrat, Helvetica, Arial, sans-serif',
  micro: 'Manrope, Inter, Helvetica, Arial, sans-serif',
  khmer: 'Krasar, Roboto, "Noto Sans Khmer", sans-serif',
} as const;

const FACES = [
  'italic 400 40px "Playfair Display"',
  'italic 600 40px "Playfair Display"',
  '600 40px "Playfair Display"',
  '500 40px Montserrat',
  '600 40px Montserrat',
  '700 40px Montserrat',
  '300 40px Manrope',
  '500 40px Manrope',
  '400 40px Krasar',
  '500 40px Krasar',
  '700 40px Krasar',
];

let started = false;
/** Block rendering until every face is loaded so no frame renders with fallback fonts. */
export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading GOLEX fonts');
  Promise.all([
    ...FACES.map((f) => document.fonts.load(f)),
    document.fonts.load('400 40px Krasar', 'ខ្ញី'),
    document.fonts.load('500 40px "Noto Sans Khmer"', 'ផលិតនៅម៉ាឡេស៊ី'),
  ])
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
