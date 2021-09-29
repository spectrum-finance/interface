import { parseUserInputToFractions, renderFractions } from './math';

export const calculateTotalFee = (
  fees: string[],
  precision: number,
): string => {
  const feeSum = fees.reduce(
    (acc: bigint, fee: string) =>
      parseUserInputToFractions(fee, precision) + acc,
    0n,
  );

  return renderFractions(feeSum, precision);
};
