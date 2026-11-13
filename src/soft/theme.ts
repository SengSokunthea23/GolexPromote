import '@fontsource/hanuman/400.css';
import '@fontsource/hanuman/700.css';
import '@fontsource/hanuman/900.css';
import '@fontsource/kantumruy-pro/400.css';
import '@fontsource/kantumruy-pro/600.css';
import '@fontsource/kantumruy-pro/700.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600-italic.css';
import '@fontsource/bodoni-moda/700.css';
import '@fontsource/cinzel/900.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import { continueRender, delayRender } from 'remotion';

/** Soft Luxury Edition palette (from the brief). Packaging colours are never altered. */
export const SC = {
  ivory: '#F8F3EA',
  beige: '#E9DCCB',
  cream: '#FFF6E8',
  ruby: '#8D1722',
  burgundy: '#4A1118',
  espresso: '#211416',
  champagne: '#D9B66F',
  gold: '#C99B45',
  softGold: '#EBD49C',
} as const;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export const GOLD_INK = `linear-gradient(180deg, ${SC.softGold} 0%, ${SC.champagne} 40%, ${SC.gold} 75%, #9C7430 100%)`;
export const RUBY_INK = `linear-gradient(180deg, ${SC.ruby} 0%, ${SC.burgundy} 100%)`;

/**
 * Type system — one serif + one sans per language, never more than two families in a scene.
 *  khSerif  Hanuman           — elegant serif-style Khmer for emotional headlines
 *  khSans   Kantumruy Pro     — clean Khmer for labels and product details
 *  serif    Cormorant Garamond — English editorial headlines (italic)
 *  sans     Manrope            — English uppercase micro labels
 */
export const SF = {
  brand: 'Cinzel, "Bodoni Moda", "Playfair Display", Georgia, serif',
  khSerif: 'Hanuman, "Kantumruy Pro", serif',
  khSans: '"Kantumruy Pro", "Noto Sans Khmer", sans-serif',
  serif: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  sans: 'Manrope, Inter, Helvetica, Arial, sans-serif',
} as const;

let started = false;
export const loadSoftFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const h = delayRender('Loading Soft Luxury fonts');
  Promise.all([
    document.fonts.load('400 40px Hanuman', 'កាហ្វេខ្ញី'),
    document.fonts.load('700 40px Hanuman', 'កាហ្វេខ្ញី'),
    document.fonts.load('900 40px Hanuman', 'កាហ្វេខ្ញី'),
    document.fonts.load('400 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('600 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('700 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('500 40px "Cormorant Garamond"', 'Golden'),
    document.fonts.load('italic 500 40px "Cormorant Garamond"', 'Golden'),
    document.fonts.load('italic 600 40px "Cormorant Garamond"', 'Golden'),
    document.fonts.load('700 40px "Bodoni Moda"', 'GOLEX'),
    document.fonts.load('900 40px Cinzel', 'GOLEX'),
    document.fonts.load('500 40px Manrope', 'GOLEX'),
    document.fonts.load('600 40px Manrope', 'GOLEX'),
  ])
    .then(() => continueRender(h))
    .catch(() => continueRender(h));
};
