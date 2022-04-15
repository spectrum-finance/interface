import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
} from 'rxjs';

import { emptyUsdCurrency } from '../constants/usdAsset';
import { AmmPool } from '../models/AmmPool';
import { Currency } from '../models/Currency';
import { Ratio } from '../models/Ratio';

const byAssetPair = (xId: string, yId: string) => (p: AmmPool) =>
  (p.x.asset.id === xId && p.y.asset.id === yId) ||
  (p.x.asset.id === yId && p.y.asset.id === xId);

const getRatioFromPools = (
  pools: AmmPool[],
  base: AssetInfo,
  quote: AssetInfo,
): Ratio | undefined => {
  const pool = pools.find(byAssetPair(base.id, quote.id));

  if (!pool) {
    return undefined;
  }
  return pool.x.asset.id === base.id ? pool.xRatio : pool.yRatio;
};

export const makeUsdConverter = (
  pools$: Observable<AmmPool[]>,
  networkAssetToUsdRatio$: Observable<Ratio>,
): ((from: Currency | Currency[]) => Observable<Currency>) => {
  const ratioStreamCache: Map<string, Observable<Ratio>> = new Map();

  const createRateStream = (fromAsset: AssetInfo): Observable<Ratio> => {
    return combineLatest([pools$, networkAssetToUsdRatio$]).pipe(
      map(([pools, networkAssetRatio]) => {
        if (fromAsset.id === networkAssetRatio.baseAsset.id) {
          return networkAssetRatio;
        }

        const toNetworkAssetRatio: Ratio | undefined = getRatioFromPools(
          pools,
          fromAsset,
          networkAssetRatio.baseAsset,
        );

        if (!toNetworkAssetRatio) {
          return new Ratio('0', fromAsset, networkAssetRatio.quoteAsset);
        }
        return toNetworkAssetRatio.cross(networkAssetRatio);
      }),
      publishReplay(1),
      refCount(),
    );
  };

  const rate = (from: AssetInfo): Observable<Ratio> => {
    if (!ratioStreamCache.has(from.id)) {
      ratioStreamCache.set(from.id, createRateStream(from));
    }
    return ratioStreamCache.get(from.id)!;
  };

  return (from: Currency | Currency[]): Observable<Currency> => {
    if (from instanceof Currency) {
      return rate(from.asset).pipe(
        map((usdRate) => usdRate.toQuoteCurrency(from)),
      );
    }

    if (!from.length) {
      return of(emptyUsdCurrency);
    }

    return combineLatest(
      from.map((i) =>
        rate(i.asset).pipe(map((usdRate) => usdRate.toQuoteCurrency(i))),
      ),
    ).pipe(
      map((currencies) =>
        currencies.reduce((acc, c) => acc.plus(c), emptyUsdCurrency),
      ),
    );
  };
};
