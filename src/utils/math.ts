import {
  all,
  ConfigOptions,
  create,
  FormatOptions,
  MathJsStatic,
} from 'mathjs';

const mathConf: ConfigOptions = {
  epsilon: 1e-24,
  matrix: 'Matrix',
  number: 'BigNumber',
  precision: 64,
};

const formatOptions: FormatOptions = {
  notation: 'fixed',
  lowerExp: 1e-100,
  upperExp: 1e100,
};

const math = create(all, mathConf) as Partial<MathJsStatic>;

export const allowedNumPat = new RegExp(/^\d+\.?\d*$/);

export function parseUserInputToFractions(
  rawInput: string,
  numDecimals?: number,
): bigint {
  const safeInput = allowedNumPat.test(rawInput) ? rawInput : '0';
  const input = math.format!(
    math.evaluate!(`${safeInput} * 10^${numDecimals || 0}`),
    formatOptions,
  );
  return BigInt(input);
}

export const strToBigInt = (value: string, precision = 0): bigint => {
  if (isNaN(Number(value)) || Number(value) === 0) return 0n;
  const result = math.evaluate!('value * 10^precision', { value, precision });
  return BigInt(result.toFixed(0));
};

export function renderFractions(
  fractions: bigint | number,
  numDecimals?: number,
): string {
  return math.format!(
    math.evaluate!(`${fractions} / 10^${numDecimals || 0}`),
    formatOptions,
  );
}

export const toPercent = (num: number | string): string =>
  String(Number(num) * 100);

export const fromPercent = (num: number | string): string =>
  String(Number(num) / 100);
