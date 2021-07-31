export const countDecimals = (value: number): number =>
  value % 1 != 0 ? value.toString().split('.')[1].length : 0;

export const isZero = (value: string | number | bigint): boolean =>
  Number(value) === 0;
