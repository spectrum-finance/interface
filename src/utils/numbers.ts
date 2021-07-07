export const countDecimals = (value: number): number =>
  value % 1 != 0 ? value.toString().split('.')[1].length : 0;
