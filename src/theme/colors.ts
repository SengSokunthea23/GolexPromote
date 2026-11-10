/** GOLEX brand palette — taken from the real packaging. */
export const COLORS = {
  ruby: '#790D18',
  burgundy: '#3B1016',
  crimson: '#A71924',
  gold: '#D9A83F',
  champagne: '#F4D98A',
  goldDeep: '#A8792A',
  espresso: '#170B0D',
  cream: '#FFF0D2',
} as const;

/** Metallic gold fill for type: champagne → gold → deep gold. */
export const GOLD_GRADIENT = `linear-gradient(180deg, ${COLORS.champagne} 0%, ${COLORS.gold} 55%, ${COLORS.goldDeep} 100%)`;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
