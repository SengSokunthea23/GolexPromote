import '@fontsource/hanuman/400.css';
import '@fontsource/hanuman/700.css';
import '@fontsource/hanuman/900.css';
import '@fontsource/kantumruy-pro/400.css';
import '@fontsource/kantumruy-pro/600.css';
import '@fontsource/kantumruy-pro/700.css';
import '@fontsource/bodoni-moda/500-italic.css';
import '@fontsource/bodoni-moda/600-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600-italic.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import { continueRender, delayRender } from 'remotion';

/** Editorial palette (from the brief). Packaging colours are never altered. */
export const EC = {
  ruby: '#790D18',
  burgundy: '#3B1016',
  crimson: '#A71924',
  ivory: '#F8F3EA',
  cream: '#FFF6EA',
  espresso: '#211416',
  champagne: '#D9B66F',
  gold: '#C99B45',
  softGold: '#F4D98A',
} as const;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/**
 * Type system — typography is the hero.
 *  display  Bodoni Moda italic   — oversized editorial words (graphic layer)
 *  serif    Cormorant Garamond   — English emotional lines
 *  sans     Manrope              — bold product details, uppercase captions
 *  khSerif  Hanuman              — Khmer headlines
 *  khSans   Kantumruy Pro        — Khmer details
 */
export const EF = {
  display: '"Bodoni Moda", "Playfair Display", Georgia, serif',
  serif: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  sans: 'Manrope, Inter, Helvetica, Arial, sans-serif',
  khSerif: 'Hanuman, "Kantumruy Pro", serif',
  khSans: '"Kantumruy Pro", "Noto Sans Khmer", sans-serif',
} as const;

let started = false;
export const loadEditorialFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const h = delayRender('Loading Editorial fonts');
  Promise.all([
    document.fonts.load('400 40px Hanuman', 'កាហ្វេខ្ញី'),
    document.fonts.load('700 40px Hanuman', 'កាហ្វេខ្ញី'),
    document.fonts.load('900 40px Hanuman', 'កាហ្វេខ្ញី'),
    document.fonts.load('400 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('600 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('700 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('italic 500 40px "Bodoni Moda"', 'Golden'),
    document.fonts.load('italic 600 40px "Bodoni Moda"', 'Golden'),
    document.fonts.load('italic 500 40px "Cormorant Garamond"', 'Golden'),
    document.fonts.load('italic 600 40px "Cormorant Garamond"', 'Golden'),
    document.fonts.load('500 40px Manrope', 'GOLEX'),
    document.fonts.load('600 40px Manrope', 'GOLEX'),
    document.fonts.load('700 40px Manrope', 'GOLEX'),
  ])
    .then(() => continueRender(h))
    .catch(() => continueRender(h));
};
