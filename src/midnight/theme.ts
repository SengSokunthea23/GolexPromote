import '@fontsource/hanuman/400.css';
import '@fontsource/hanuman/700.css';
import '@fontsource/hanuman/900.css';
import '@fontsource/kantumruy-pro/400.css';
import '@fontsource/kantumruy-pro/600.css';
import '@fontsource/kantumruy-pro/700.css';
import '@fontsource/bodoni-moda/500.css';
import '@fontsource/bodoni-moda/500-italic.css';
import '@fontsource/bodoni-moda/600.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import { continueRender, delayRender } from 'remotion';

/** Midnight Luxury palette (from the brief). Packaging colours are never altered. */
export const MC = {
  black: '#08090A',
  espresso: '#211416',
  burgundy: '#4A1118',
  ruby: '#941B27',
  crimson: '#A71924',
  gold: '#C99B45',
  champagne: '#F4D98A',
  ivory: '#FFF0D2',
} as const;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/** Controlled metallic gold for type and edges. */
export const GOLD_INK = `linear-gradient(180deg, #FFF3C4 0%, ${MC.champagne} 30%, ${MC.gold} 70%, #8E6A2A 100%)`;
/** Ruby emphasis that still reads on black. */
export const RUBY_INK = `linear-gradient(180deg, #E2505B 0%, ${MC.crimson} 55%, ${MC.ruby} 100%)`;

/**
 * Type system — one Khmer serif, one Khmer sans, one English serif, one English sans.
 *  khSerif  Hanuman             — dramatic Khmer headlines
 *  khSans   Kantumruy Pro       — Khmer labels and product details
 *  serif    Bodoni Moda         — high-contrast English accents
 *  sans     Manrope             — uppercase micro labels
 */
export const MF = {
  khSerif: 'Hanuman, "Kantumruy Pro", serif',
  khSans: '"Kantumruy Pro", "Noto Sans Khmer", sans-serif',
  serif: '"Bodoni Moda", "Playfair Display", Georgia, serif',
  sans: 'Manrope, Inter, Helvetica, Arial, sans-serif',
} as const;

let started = false;
export const loadMidnightFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const h = delayRender('Loading Midnight fonts');
  Promise.all([
    document.fonts.load('400 40px Hanuman', 'កាហ្វេខ្ញី'),
    document.fonts.load('700 40px Hanuman', 'កាហ្វេខ្ញី'),
    document.fonts.load('900 40px Hanuman', 'កាហ្វេខ្ញី'),
    document.fonts.load('400 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('600 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('700 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('500 40px "Bodoni Moda"', 'Golden'),
    document.fonts.load('italic 500 40px "Bodoni Moda"', 'Golden'),
    document.fonts.load('600 40px "Bodoni Moda"', 'Golden'),
    document.fonts.load('500 40px Manrope', 'GOLEX'),
    document.fonts.load('600 40px Manrope', 'GOLEX'),
  ])
    .then(() => continueRender(h))
    .catch(() => continueRender(h));
};
