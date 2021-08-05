import { MIN_BOX_VALUE } from '../constants/erg';

export function miniSufficientValue(minerFee: bigint, dexFee: bigint): bigint {
  const min = minerFee * 2n + MIN_BOX_VALUE * 2n;
  const actual = minerFee * 2n + dexFee;
  return actual > min ? actual : min;
}
