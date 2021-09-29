import * as yup from 'yup';

import { ERG_DECIMALS, MIN_EX_FEE, MIN_NITRO } from '../../constants/erg';
import {
  allowedNumPat,
  parseUserInputToFractions,
  renderFractions,
} from '../../utils/math';

const fixedNumber = (decimals: number) =>
  yup
    .number()
    .test(
      'is-fixed-decimal',
      `this amount must have less than ${decimals + 1} decimal places`,
      (n) => n !== undefined && Number(n.toFixed(decimals)) === n,
    );

export const validateSlippage = (value: string): string | undefined => {
  const schema = fixedNumber(2).min(0).max(100);
  try {
    schema.validateSync(Number(value || 0));
  } catch (e) {
    return e instanceof Error ? e.message : 'validate sync error';
  }
  return undefined;
};

type validateInputAmountOpts = {
  maxDecimals: number;
  maxAvailable: bigint;
};

export const validateInputAmount = (
  value: string,
  isWalletConnected: boolean,
  { maxDecimals, maxAvailable }: validateInputAmountOpts,
): string | undefined => {
  const schema = yup
    .string()
    .trim()
    .test(
      'input-format-violation',
      'Only non-negative numbers are allowed here',
      (value = '') => allowedNumPat.test(value),
    )
    .test(
      'no-more-decimals-allowed',
      `Max number of decimals exceeded. Max allowed: ${maxDecimals}`,
      (value = '') => validDecimals(value, maxDecimals),
    )
    .test(
      'balance-exceeded',
      `Available balance exceeded. Available amount: ${renderFractions(
        maxAvailable,
        maxDecimals,
      )}`,
      (value = '') => {
        const valueRefined = parseUserInputToFractions(value, maxDecimals);
        return valueRefined <= maxAvailable || !isWalletConnected; // apply validation only if wallet connected
      },
    );
  try {
    schema.validateSync(value);
  } catch (e) {
    return e instanceof Error ? e.message : 'validate sync error';
  }
  return undefined;
};

function validDecimals(value: string, maxDecimals: number): boolean {
  const idx = value.indexOf('.');
  return idx === -1 || value.slice(idx + 1).length <= maxDecimals;
}

export const validateNumber = (
  value: string,
  opts: { maxDecimals: number },
): string | undefined => {
  const schema = yup
    .string()
    .trim()
    .test(
      'input-format-violation',
      'Only non-negative numbers are allowed here',
      (value = '') => allowedNumPat.test(value),
    )
    .test(
      'no-more-decimals-allowed',
      'no more decimals allowed',
      (value = '') => validDecimals(value, opts.maxDecimals),
    );
  try {
    schema.validateSync(value);
  } catch (e) {
    return e instanceof Error ? e.message : 'validate sync error';
  }
  return undefined;
};

export const validateNitro = (value: string): unknown => {
  const schema = yup
    .string()
    .trim()
    .test('value-exceeded', `Minimal Nitro value is ${MIN_NITRO}`, (value) => {
      return Number(value) >= MIN_NITRO;
    });

  try {
    schema.validateSync(value);
  } catch (e) {
    return e instanceof Error ? e.message : 'validate sync error';
  }
};

export const validateMinDexFee = (value: string): unknown => {
  const schema = yup
    .string()
    .trim()
    .test(
      'value-exceeded',
      `The bottom line of DEX Fee is ${renderFractions(
        MIN_EX_FEE,
        ERG_DECIMALS,
      )}`,
      (value) => {
        return (
          Number(value) >= Number(renderFractions(MIN_EX_FEE, ERG_DECIMALS))
        );
      },
    );

  try {
    schema.validateSync(value);
  } catch (e) {
    return e instanceof Error ? e.message : 'validate sync error';
  }
};
