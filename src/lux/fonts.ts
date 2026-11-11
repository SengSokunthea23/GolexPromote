import '@fontsource/moul/400.css';
import '@fontsource/kantumruy-pro/300.css';
import '@fontsource/kantumruy-pro/400.css';
import '@fontsource/kantumruy-pro/600.css';
import '@fontsource/kantumruy-pro/700.css';
import '@fontsource/italiana/400.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/manrope/300.css';
import '@fontsource/manrope/500.css';
import { continueRender, delayRender } from 'remotion';

/**
 * Royal Silk type system
 *  - display: Moul — the classic Khmer ceremonial display face, used for gold headlines
 *  - khmer:   Kantumruy Pro — clean modern Khmer sans for supporting copy
 *  - lux:     Italiana — thin luxury Latin caps for English accents
 *  - serif:   Playfair Display italic — emotional English lines
 *  - micro:   Manrope — tracked product info
 */
export const LF = {
  display: 'Moul, "Kantumruy Pro", serif',
  khmer: '"Kantumruy Pro", "Noto Sans Khmer", sans-serif',
  lux: 'Italiana, "Playfair Display", serif',
  serif: '"Playfair Display", Georgia, serif',
  micro: 'Manrope, Inter, Helvetica, Arial, sans-serif',
} as const;

let started = false;
export const loadLuxFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const h = delayRender('Loading Royal Silk fonts');
  Promise.all([
    document.fonts.load('400 40px Moul', 'កាហ្វេខ្ញី'),
    document.fonts.load('300 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('400 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('600 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('700 40px "Kantumruy Pro"', 'កាហ្វេខ្ញី'),
    document.fonts.load('400 40px Italiana', 'GOLEX'),
    document.fonts.load('italic 400 40px "Playfair Display"', 'Golden'),
    document.fonts.load('300 40px Manrope', 'GOLEX'),
    document.fonts.load('500 40px Manrope', 'GOLEX'),
  ])
    .then(() => continueRender(h))
    .catch(() => continueRender(h));
};
