import React from 'react';
import { FloatingSprite, FloatSpec } from '../components/FloatingSprite';
import { IngredientCard } from '../components/IngredientCard';
import { LowerBand } from '../components/LowerBand';
import { SugarCrystals } from '../components/SugarCrystals';
import { INGREDIENT_CUTS, SCENES } from '../theme/timeline';

/**
 * 8.3–20.35s · The five ingredients, matching the Khmer titles in the footage:
 * Robusta · Arabica · Brown sugar · Natural creamer · Bentong ginger.
 */
export const INGREDIENTS = [
  { index: '01', name: 'ROBUSTA COFFEE', sub: 'BOLD  ·  FULL-BODIED' },
  { index: '02', name: 'ARABICA COFFEE', sub: 'SMOOTH  ·  AROMATIC' },
  { index: '03', name: 'PREMIUM BROWN SUGAR', sub: 'RICH CARAMEL SWEETNESS' },
  { index: '04', name: 'NATURAL CREAMER', sub: 'RICH  &  CREAMY' },
  { index: '05', name: 'BENTONG GINGER', sub: 'WARMING  &  ENERGIZING' },
];

const T0 = SCENES.ingredients.from;
const local = (abs: number) => abs - T0;

// Real ingredient cut-outs drifting with depth (times are absolute, converted below).
const FLOATS: FloatSpec[] = [
  // Robusta
  { src: 'sprites/bean5.png', width: 89, blur: 1.2, from: [105, 690], to: [125, 630], start: 8.35, end: 10.6, rot0: 40, rotSpeed: -12 },
  { src: 'sprites/bean7.png', width: 62, blur: 4, from: [975, 600], to: [960, 560], start: 8.35, end: 10.6, opacity: 0.9, rot0: 10, rotSpeed: 10 },
  // Arabica
  { src: 'sprites/bean2.png', width: 105, blur: 3, from: [70, 620], to: [95, 560], start: 10.55, end: 13.0, opacity: 0.9, rot0: -20, rotSpeed: 8 },
  { src: 'sprites/bean8.png', width: 66, blur: 1, from: [1015, 820], to: [1000, 760], start: 10.6, end: 13.0, rot0: 60, rotSpeed: -10 },
  // Bentong ginger
  { src: 'sprites/slice.png', width: 143, blur: 1.5, from: [120, 1240], to: [140, 1150], start: 17.85, end: 20.4, rot0: -15, rotSpeed: 7 },
  { src: 'sprites/slice.png', width: 104, blur: 5, from: [985, 760], to: [965, 690], start: 17.9, end: 20.4, opacity: 0.95, rot0: 30, rotSpeed: -9 },
  { src: 'sprites/slice.png', width: 299, blur: 18, from: [1060, 1560], to: [1040, 1470], start: 17.85, end: 20.4, opacity: 0.9, rot0: 10, rotSpeed: 4 },
];

export const IngredientsScene: React.FC = () => (
  <>
    <LowerBand start={0.1} end={12.0} strength={0.78} ein={0.5} />
    {FLOATS.map((f, i) => (
      <FloatingSprite key={i} {...f} start={local(f.start)} end={local(f.end)} />
    ))}
    <SugarCrystals start={local(12.95)} end={local(15.45)} />
    {INGREDIENTS.map((ing, i) => (
      <IngredientCard key={ing.index} {...ing} start={local(INGREDIENT_CUTS[i]) + 0.22} end={local(INGREDIENT_CUTS[i + 1]) - 0.08} />
    ))}
  </>
);
