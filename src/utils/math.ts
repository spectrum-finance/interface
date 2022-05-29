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

export const math = create(all, mathConf) as Partial<MathJsStatic>;

export const allowedNumPat = new RegExp(/^-?\d+\.?\d*$/);

export function parseUserInputToFractions(
  rawInput: string | number,
  numDecimals?: number,
): bigint {
  const safeInput = allowedNumPat.test(
    typeof rawInput === 'number' ? String(rawInput) : rawInput,
  )
    ? rawInput
    : '0';
  const input = math.format!(
    math.evaluate!(`${safeInput} * 10^${numDecimals || 0}`),
    formatOptions,
  );
  // TODO: CHECK_FUNCTION_LAST_CHANGE[]
  return BigInt(input);
}

export function renderFractions(
  fractions: bigint | number | string,
  numDecimals?: number,
): string {
  return math.format!(
    math.evaluate!(`${fractions} / 10^${numDecimals || 0}`),
    formatOptions,
  );
}

export function fractionsToNum(
  fractions: bigint | number,
  numDecimals?: number,
): number {
  return Number(renderFractions(fractions, numDecimals));
}
