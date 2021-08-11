import { parseUserInputToFractions, renderFractions } from './math';

export const calculateTotalFee = (
  minerFee: string,
  dexFee: string,
  { precision }: { precision: number },
): string => {
  const totalFee =
    parseUserInputToFractions(minerFee, precision) +
    parseUserInputToFractions(dexFee, precision);
  return renderFractions(totalFee, precision);
};
