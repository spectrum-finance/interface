import { AssetAmount, isNative, OverallAmount } from '@ergolabs/ergo-sdk';

export function makeTarget(
  assetsIn: AssetAmount[],
  minFeeForOrder: bigint,
): OverallAmount {
  const nativeAsset = assetsIn.filter((i) => isNative(i.asset))[0];
  const isNativePool = !!nativeAsset;

  const totalNErgs = isNativePool
    ? nativeAsset.amount + minFeeForOrder
    : minFeeForOrder;

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
