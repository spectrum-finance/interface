import { ErgoBox } from 'ergo-dex-sdk/build/module/ergo';
import { AmmPool } from 'ergo-dex-sdk';
import { AssetAmount } from 'ergo-dex-sdk/build/module/ergo';
import { parseUserInputToFractions } from './math';

export const calculateAvailableAmount = (
  tokenId: string,
  boxes: ErgoBox[],
): bigint => {
  return boxes
    .flatMap(({ assets }) => assets)
    .filter((a) => a.tokenId == tokenId)
    .map(({ amount }) => amount)
    .reduce((acc, x) => acc + x, 0n);
};

type BaseInputParameters = {
  baseInput: AssetAmount;
  baseInputAmount: bigint;
  minOutput: AssetAmount;
};

export const getBaseInputParameters = (
  pool: AmmPool,
  {
    inputAmount,
    inputAssetAmount,
    slippage,
  }: { inputAmount: string; inputAssetAmount: AssetAmount; slippage: number },
): BaseInputParameters => {
  const baseInput = parseUserInputToFractions(inputAmount, inputAssetAmount.asset.decimals);
  const baseInputAmount = pool.x.withAmount(baseInput);
  const minOutput = pool.outputAmount(baseInputAmount, slippage);

  return {
    baseInput: baseInputAmount,
    baseInputAmount: baseInput,
    minOutput,
  };
};
