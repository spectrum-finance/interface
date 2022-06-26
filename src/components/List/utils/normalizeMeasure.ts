export const normalizeMeasure = (value: number | string): string => {
  return typeof value === 'number' ? `${value}px` : value;
};
