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
import { Currency } from '../models/Currency';
import { Ratio } from '../models/Ratio';
import { AssetGraph } from './AssetGraph';

const getRatioFromGraph = (
  graph: AssetGraph,
  base: AssetInfo,
  quote: AssetInfo,
): Ratio | undefined => {
  const path = graph.getPath(base, quote);

  return path.reduce<Ratio | undefined>((ratio, pool) => {
    if (!ratio) {
      return pool.x.asset.id === base.id ? pool.xRatio : pool.yRatio;
    }

    return ratio.cross(
      pool.x.asset.id === ratio.baseAsset.id ? pool.xRatio : pool.yRatio,
    );
  }, undefined);
};

export const makeUsdConverter = (
  assetGraph$: Observable<AssetGraph>,
  networkAssetToUsdRatio$: Observable<Ratio>,
): ((from: Currency | Currency[]) => Observable<Currency>) => {
  const ratioStreamCache: Map<string, Observable<Ratio>> = new Map();

  const createRateStream = (fromAsset: AssetInfo): Observable<Ratio> => {
    return combineLatest([assetGraph$, networkAssetToUsdRatio$]).pipe(
      map(([graph, networkAssetRatio]) => {
        if (fromAsset.id === networkAssetRatio.baseAsset.id) {
          return networkAssetRatio;
        }

        const toNetworkAssetRatio: Ratio | undefined = getRatioFromGraph(
          graph,
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
