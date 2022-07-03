export const size = {
  s: 320,
  m: 520,
  l: 960,
  xl: 1280,
  xxl: 1920,
};

export type Sizes = keyof typeof size;

export const device: Record<Sizes, string> = {
  s: `@media (min-width: ${size.s}px)`,
  m: `@media (min-width: ${size.m}px)`,
  l: `@media (min-width: ${size.l}px)`,
  xl: `@media (min-width: ${size.xl}px)`,
  xxl: `@media (min-width: ${size.xxl}px)`,
};
