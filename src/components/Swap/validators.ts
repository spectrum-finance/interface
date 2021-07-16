import * as yup from 'yup';

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
};

export const validateInputAmount = (
  value: string,
  { maxDecimals }: validateInputAmountOpts,
): string | undefined => {
  const schema = yup
    .string()
    .trim()
    .test(
      'no-more-decimals-allowed',
      'no more decimals allowed',
      (value = '') => {
        const [, decimals = ''] = value
          .toString()
          .split(new RegExp('^[1-9]*[.|,]([1-9]*)$'));
        return decimals.length <= maxDecimals;
      },
    )
    .test(
      'is-max-dicimals',
      `max decimals at this token after comma is ${maxDecimals}`,
      (value = '') => {
        const fractionalPartIndex = value.match('.,')?.index;
        const fractionalPart = fractionalPartIndex
          ? value.substr(fractionalPartIndex + 1)
          : '';
        return maxDecimals >= fractionalPart.length;
      },
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
      `must be less then available amount ${availableInputAmount}`,
      ({ inputAmount }) => {
        return BigInt(inputAmount) < availableInputAmount;
      },
    );
  try {
    schema.validateSync(values);
  } catch (e) {
    return e.message;
  }
  return '';
};
