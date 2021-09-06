import { MIN_BOX_VALUE } from '../constants/erg';
import { MinPoolBoxValue } from 'ergo-dex-sdk/build/main/amm/constants';
import { MinBoxValue } from 'ergo-dex-sdk/build/main/ergo/constants';
import { AssetAmount } from 'ergo-dex-sdk/build/module/ergo';
import { OverallAmount } from 'ergo-dex-sdk/build/main';
import { isNative } from 'ergo-dex-sdk';

export function minSufficientValueForOrder(
  minerFee: bigint,
  dexFee: bigint,
): bigint {
  const min = minerFee * 2n + MIN_BOX_VALUE * 2n;
  const actual = minerFee + dexFee;
  return actual > min ? actual : min;
}

export function minSufficientValueForSetup(minerFee: bigint): bigint {
  return minerFee * 2n + MinPoolBoxValue + MinBoxValue;
}

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
