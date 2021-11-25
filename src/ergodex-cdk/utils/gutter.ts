export type GutterTwoNumbers = [number, number];
export type GutterFourNumbers = [number, number, number, number];
export type Gutter = number | GutterTwoNumbers | GutterFourNumbers;

export const calcGutter = (n: number): string =>
  `calc(var(--ergo-base-gutter) * ${n})`;

export const getGutter = (p: Gutter) => {
  if (p instanceof Array && p.length === 2) {
    return `${calcGutter(p[0])} ${calcGutter(p[1])}`;
  }
  if (p instanceof Array && p.length === 4) {
    return `${calcGutter(p[0])} ${calcGutter(p[1])} ${calcGutter(
      p[2],
    )} ${calcGutter(p[3])}`;
  }
  return `calc(var(--ergo-base-gutter) * ${p})`;
};
