import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  tap,
} from 'rxjs';

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

interface SnapshotFunction {
  (from: Currency | Currency[]): Currency;
}

export type CurrencyConverter = ((
  from: Currency | Currency[],
) => Observable<Currency>) & {
  snapshot: SnapshotFunction;
};

export const makeCurrencyConverter = (
  assetGraph$: Observable<AssetGraph>,
  networkAssetToConvenientAssetRatio$: Observable<Ratio>,
  convenientAsset: AssetInfo,
): CurrencyConverter => {
  const ratioStreamCache: Map<string, Observable<Ratio>> = new Map();

  const ratioSnapshotCache: Map<string, Ratio> = new Map();

  const emptyConvenientAssetCurrency = new Currency(0n, convenientAsset);

  const createRateStream = (fromAsset: AssetInfo): Observable<Ratio> => {
    return combineLatest([
      assetGraph$,
      networkAssetToConvenientAssetRatio$,
    ]).pipe(
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
      tap((ratio) => ratioSnapshotCache.set(fromAsset.id, ratio)),
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

  const convert: CurrencyConverter = ((
    from: Currency | Currency[],
  ): Observable<Currency> => {
    if (from instanceof Currency) {
      return rate(from.asset).pipe(
        map((convenientAssetRate) => convenientAssetRate.toQuoteCurrency(from)),
      );
    }

    if (!from.length) {
      return of(emptyConvenientAssetCurrency);
    }

    return combineLatest(
      from.map((i) =>
        rate(i.asset).pipe(
          map((convenientAssetRate) => convenientAssetRate.toQuoteCurrency(i)),
        ),
      ),
    ).pipe(
      map((currencies) =>
        currencies.reduce(
          (acc, c) => acc.plus(c),
          emptyConvenientAssetCurrency,
        ),
      ),
    );
  }) as any;

  convert.snapshot = (from: Currency | Currency[]): Currency => {
    if (from instanceof Currency && ratioSnapshotCache.has(from.asset.id)) {
      return ratioSnapshotCache.get(from.asset.id)!.toQuoteCurrency(from);
    }

    return emptyConvenientAssetCurrency;
  };

  return convert;
};
