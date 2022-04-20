import { parseUserInputToFractions } from '../../utils/math';
import { AssetInfo } from '../models/AssetInfo';
import { Currency } from '../models/Currency';

type Fee = Currency | string | number | bigint;

export const calculateTotalFee = (
  fees: Fee[],
  assetInfo: AssetInfo,
): Currency => {
  const feeSum = fees.reduce<bigint>((acc, fee) => {
    if (typeof fee === 'string' || typeof fee === 'number') {
      return acc + parseUserInputToFractions(fee, assetInfo.decimals);
    }
    if (typeof fee === 'bigint') {
      return acc + fee;
    }

    return acc + fee.amount;
  }, 0n);

  return new Currency(feeSum, assetInfo);
};
