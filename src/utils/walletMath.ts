import { AssetAmount, ErgoBox, NativeAssetId } from '@ergolabs/ergo-sdk';

import { AmmPool } from '../common/models/AmmPool';
import { Currency } from '../common/models/Currency';

const MIN_ERG_BALANCE_TO_PAY_FEES = 0.1;

export const calculateAvailableAmount = (
  tokenId: string,
  boxes: ErgoBox[],
): bigint => {
  if (tokenId === NativeAssetId) {
    return boxes.map(({ value }) => value).reduce((acc, x) => acc + x, 0n);
  } else {
    return boxes
      .flatMap(({ assets }) => assets)
      .filter((a) => a.tokenId == tokenId)
      .map(({ amount }) => amount)
      .reduce((acc, x) => acc + x, 0n);
  }
};

export type BaseInputParameters = {
  baseInput: AssetAmount;
  baseInputAmount: bigint;
  minOutput: AssetAmount;
};

export const getBaseInputParameters = (
  pool: AmmPool,
  { inputAmount, slippage }: { inputAmount: Currency; slippage: number },
): BaseInputParameters => {
  const baseInputAmount =
    inputAmount.asset.id === pool.x.asset.id
      ? pool['pool'].x.withAmount(inputAmount.amount)
      : pool['pool'].y.withAmount(inputAmount.amount);
  const minOutput = pool['pool'].outputAmount(baseInputAmount as any, slippage);

  return {
    baseInput: baseInputAmount as any,
    baseInputAmount: inputAmount.amount,
    minOutput: minOutput as any,
  };
};

export const isLowBalance = (balance: number): boolean => {
  return balance <= MIN_ERG_BALANCE_TO_PAY_FEES;
};
