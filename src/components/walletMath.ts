import { AssetInfo, ErgoBox } from 'ergo-dex-sdk/build/module/ergo';
import { evaluate } from 'mathjs';

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
  input: string,
  inputAsset: AssetInfo
): bigint => {
  return BigInt(
    evaluate(
      `${input}*10^${inputAsset.decimals ?? 0}`,
    ).toFixed(0),
  );
};

export const renderFractions = (
  input: bigint,
  inputAsset: AssetInfo
): string => {
  return String(
    evaluate(
      `${input}/10^${inputAsset.decimals ?? 0}`,
    )
  );
};
