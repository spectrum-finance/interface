export const renderPercent = (pct: number) => {
  if (pct > 0.01) {
    return `${pct.toFixed(2)}%`;
  }
  return '> 0.01%';
};
