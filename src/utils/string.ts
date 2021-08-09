const DOT_SYMBOL = '.';

export const truncate = (id: string): string => {
  return `${id.slice(0, 16)}...${id.slice(48)}`;
};

export const toFloat = (value: string, maxDecimals?: number): string => {
  if (value === DOT_SYMBOL) {
    return '';
  }
  // TODO: EDEX-230
  const result = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

  if (maxDecimals) {
    const dotPosition = result.indexOf(DOT_SYMBOL) + 1;
    return !dotPosition ? result : result.slice(0, dotPosition + maxDecimals);
  }

  return result;
};

export const toInt = (value: string): string => value.replace(/[^0-9]/g, '');
