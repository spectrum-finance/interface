import { ErgoBox } from 'ergo-dex-sdk/build/module/ergo';
import { evaluate } from 'mathjs';
import { AmmPool } from 'ergo-dex-sdk';
import { AssetAmount } from 'ergo-dex-sdk/build/module/ergo';

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

export const userInputToFractions = (
  input: string | undefined,
  numDecimals: number | undefined,
): bigint => {
  if (!input) {
    return 0n;
  }
  return BigInt(evaluate(`${input}*10^${numDecimals ?? 0}`).toFixed(0));
};

export const renderFractions = (
  input: bigint,
  numDecimals: number | undefined,
): string => {
  if (!input) {
    return '';
  }
  return String(evaluate(`${input}/10^${numDecimals ?? 0}`));
};

export const getBaseInputParameters = (
  pool: AmmPool,
  {
    inputAmount,
    inputAssetAmount,
    slippage,
  }: { inputAmount: string; inputAssetAmount: AssetAmount; slippage: number },
): any => {
  const baseInputAmount = BigInt(
    evaluate(
      `${inputAmount} * 10^${inputAssetAmount.asset.decimals ?? 0}`,
    ).toFixed(0),
  );
  const baseInput = pool.x.withAmount(BigInt(baseInputAmount));
  const minOutput = pool.outputAmount(baseInput, slippage);

  return {
    baseInput,
    baseInputAmount,
    minOutput,
  };
};
