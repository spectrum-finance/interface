import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import {
  AssetAmount,
  AssetInfo,
  ErgoBox,
  NativeAssetId,
} from '@ergolabs/ergo-sdk';

import { parseUserInputToFractions } from './math';

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
  {
    inputAmount,
    inputAsset,
    slippage,
  }: { inputAmount: string; inputAsset: AssetInfo; slippage: number },
): BaseInputParameters => {
  const baseInput = parseUserInputToFractions(inputAmount, inputAsset.decimals);
  const baseInputAmount =
    inputAsset.id === pool.x.asset.id
      ? pool.x.withAmount(baseInput)
      : pool.y.withAmount(baseInput);
  const minOutput = pool.outputAmount(baseInputAmount, slippage);

  return {
    baseInput: baseInputAmount,
    baseInputAmount: baseInput,
    minOutput,
  };
};

export const isLowBalance = (balance: number): boolean => {
  return balance <= MIN_ERG_BALANCE_TO_PAY_FEES;
};
