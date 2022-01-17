import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { Currency } from './Currency';

export class Balance {
  private mapAssetIdToBalance = new Map<string, Currency>();

  constructor(assetAmount: [bigint, AssetInfo][]) {
    this.mapAssetIdToBalance = new Map(
      assetAmount.map(([amount, info]) => [
        info.id,
        new Currency(amount, info),
      ]),
    );
  }

  get(asset: AssetInfo): Currency {
    return this.mapAssetIdToBalance.get(asset.id) || new Currency(0n, asset);
  }

  entries(): [string, Currency][] {
    return Array.from(this.mapAssetIdToBalance.entries());
  }

  values(): Currency[] {
    return Array.from(this.mapAssetIdToBalance.values());
  }
}
