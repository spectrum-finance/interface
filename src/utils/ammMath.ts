import { AssetAmount, isNative, OverallAmount } from '@ergolabs/ergo-sdk';

export function makeTarget(
  assetsIn: AssetAmount[],
  minNErgs: bigint,
): OverallAmount {
  const nativeAsset = assetsIn.filter((i) => isNative(i.asset))[0];
  const isNativePool = !!nativeAsset;

  const totalNErgs = isNativePool ? nativeAsset.amount + minNErgs : minNErgs;

  const assets = assetsIn
    .filter((i) => !isNative(i.asset))
    .map((ai) => ({
      tokenId: ai.asset.id,
      amount: ai.amount,
    }));

  return {
    nErgs: totalNErgs,
    assets,
  };
}
