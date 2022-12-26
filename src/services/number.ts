import numeral from 'numeral';

import { Currency } from '../common/models/Currency';

const INT_FORMAT = '0,0';
const CURRENCY_FORMAT = '0,0.00';
const USD_FORMAT = `$${CURRENCY_FORMAT}`;
const USD_ABBREVIATION_FORMAT = `$${CURRENCY_FORMAT}a`;
const PERCENT_FORMAT = '0.00%';

export const formatToCurrency = (amount: number | string): string => {
  return numeral(amount).format(CURRENCY_FORMAT);
};

export const formatToUSD = (
  amount: number | string | Currency,
  type?: 'abbr' | 'default',
): string => {
  switch (type) {
    case 'abbr':
      return amount instanceof Currency
        ? numeral(amount.toAmount()).format(USD_ABBREVIATION_FORMAT)
        : numeral(amount).format(USD_ABBREVIATION_FORMAT);
    default:
      return amount instanceof Currency
        ? numeral(amount.toAmount()).format(USD_FORMAT)
        : numeral(amount).format(USD_FORMAT);
  }
};

export const formatToPercent = (amount: number | string): string => {
  return numeral(Number(amount) / 100).format(PERCENT_FORMAT);
};

export const formatToInt = (amount: number | string): string =>
  numeral(amount).format(INT_FORMAT);
