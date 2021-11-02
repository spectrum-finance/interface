import { parseUserInputToFractions, renderFractions } from './math';

export const calculateTotalFee = (
  fees: number[],
  precision: number,
): string => {
  const feeSum = fees.reduce(
    (acc: bigint, fee: number) =>
      parseUserInputToFractions(fee, precision) + acc,
    0n,
  );

  return renderFractions(feeSum, precision);
};
