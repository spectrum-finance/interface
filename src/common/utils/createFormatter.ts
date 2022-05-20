import { uint } from '../types';

const mapKeyToFormatter = new Map<string, Intl.NumberFormat>();

const decimalsParamsToKey = (maxDecimals: uint, minDecimals?: uint) =>
  `${maxDecimals}${minDecimals ? `-${minDecimals}` : ''}`;

const createFormatter = (
  maxDecimals: uint,
  minDecimals?: uint,
): Intl.NumberFormat =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: minDecimals,
    currencySign: undefined,
    currency: undefined,
  });

export const getFormatter = (
  maxDecimals: uint,
  minDecimals?: uint,
): Intl.NumberFormat => {
  const formatterKey = decimalsParamsToKey(maxDecimals, minDecimals);

  if (!mapKeyToFormatter.has(formatterKey)) {
    mapKeyToFormatter.set(
      formatterKey,
      createFormatter(maxDecimals, minDecimals),
    );
  }

  return mapKeyToFormatter.get(formatterKey)!;
};
