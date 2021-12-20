import numeral from 'numeral';

const CURRENCY_FORMAT = '0,0.00';
const USD_FORMAT = `$${CURRENCY_FORMAT}`;
const USD_ABBREVIATION_FORMAT = `$${CURRENCY_FORMAT}a`;
const PERCENT_FORMAT = '0.00%';

export const formatToCurrency = (amount: number | string): string => {
  return numeral(amount).format(CURRENCY_FORMAT);
};

export const formatToUSD = (amount: number | string, type?: 'abbr'): string => {
  switch (type) {
    case 'abbr':
      return numeral(amount).format(USD_ABBREVIATION_FORMAT);
    default:
      return numeral(amount).format(USD_FORMAT);
  }
};

export const formatToPercent = (amount: number | string): string => {
  return numeral(amount).format(PERCENT_FORMAT);
};
