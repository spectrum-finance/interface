import { evaluate } from 'mathjs';

export const getPoolFee = (poolFeeNum: BigInt): number => {
  return evaluate(`(1 - ${poolFeeNum} / 1000) * 10`).toFixed(1);
};
