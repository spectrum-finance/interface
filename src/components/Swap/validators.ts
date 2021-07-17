import * as yup from 'yup';
import { evaluate } from 'mathjs';

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
    return e.message;
  }
  return undefined;
};

type validateInputAmountOpts = {
  maxDecimals: number;
  maxAvailable: bigint;
};

function validDecimals(value: string, maxDecimals: number): boolean {
  const [, decimals = ''] = value
    .toString()
    .split(new RegExp('^[1-9]*[.|,]([1-9]*)$'));
  return decimals.length <= maxDecimals;
}

export const validateInputAmount = (
  value: string,
  { maxDecimals, maxAvailable }: validateInputAmountOpts,
): string | undefined => {
  const schema = yup
    .string()
    .trim()
    .test(
      'no-more-decimals-allowed',
      `Max number of decimals exceeded. Max allowed: ${maxDecimals}`,
      (value = '') => validDecimals(value, maxDecimals),
    )
    .test(
      'balance-exceeded',
      `Available balance exceeded. Available amount: ${evaluate(
        `${maxAvailable} / 10^${maxDecimals}`,
      )}`,
      (value = '') => {
        const valueRefined = BigInt(evaluate(`${value} * 10^${maxDecimals}`));
        return valueRefined <= maxAvailable;
      },
    );
  try {
    schema.validateSync(value);
  } catch (e) {
    return e.message;
  }
  return undefined;
};

export const validateNumber = (
  value: string,
  opts: { maxDecimals: number },
): string | undefined => {
  const schema = yup
    .string()
    .trim()
    .test(
      'no-more-decimals-allowed',
      'no more decimals allowed',
      (value = '') => validDecimals(value, opts.maxDecimals),
    );
  try {
    schema.validateSync(value);
  } catch (e) {
    return e.message;
  }
  return undefined;
};

type validateSwapFormOpts = {
  availableInputAmount: bigint;
};

type validateSwapFormValues = {
  inputAmount: string;
};

export const validateSwapForm = (
  values: validateSwapFormValues,
  { availableInputAmount }: validateSwapFormOpts,
): string => {
  const schema = yup
    .object()
    .test(
      'is-enough-available-amount',
      `must be less than available amount ${availableInputAmount}`,
      ({ inputAmount }) => {
        return BigInt(inputAmount) <= availableInputAmount;
      },
    );
  try {
    schema.validateSync(values);
  } catch (e) {
    return e.message;
  }
  return '';
};
