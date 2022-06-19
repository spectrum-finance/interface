export const size = {
  s: 320,
  m: 520,
  l: 960,
  xl: 1280,
  xxl: 1920,
};

export type Sizes = keyof typeof size;

export const device: Record<Sizes, string> = {
  s: `@media (min-width: ${size.s})`,
  m: `@media (min-width: ${size.m})`,
  l: `@media (min-width: ${size.l})`,
  xl: `@media (min-width: ${size.xl})`,
  xxl: `@media (min-width: ${size.xxl})`,
};
