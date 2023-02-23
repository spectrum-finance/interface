import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  debounceTime,
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
  (from: Currency | Currency[], to?: AssetInfo): Currency;
}

interface RateFunction {
  (from: AssetInfo): Observable<Ratio>;
}

export type CurrencyConverter = ((
  from: Currency | Currency[],
  to?: AssetInfo,
) => Observable<Currency>) & {
  snapshot: SnapshotFunction;
  rate: RateFunction;
};

export const makeCurrencyConverter = (
  assetGraph$: Observable<AssetGraph>,
  networkAssetToConvenientAssetRatio$: Observable<Ratio>,
  convenientAsset: AssetInfo,
): CurrencyConverter => {
  const ratioStreamCache: Map<string, Observable<Ratio>> = new Map();

  const ratioSnapshotCache: Map<string, Ratio> = new Map();

  const emptyConvenientAssetCurrency = new Currency(0n, convenientAsset);

  const toHash = (from: AssetInfo, to?: AssetInfo): string =>
    to ? `${from.id}-${to.id}` : from.id;

  const createRateStream = (
    fromAsset: AssetInfo,
    to?: AssetInfo,
  ): Observable<Ratio> => {
    return combineLatest([
      assetGraph$,
      networkAssetToConvenientAssetRatio$,
    ]).pipe(
      debounceTime(100),
      map(([graph, networkAssetRatio]) => {
        if (
          fromAsset.id === networkAssetRatio.baseAsset.id &&
          (!to || to.id === networkAssetRatio.quoteAsset.id)
        ) {
          return networkAssetRatio;
        }

        const toNetworkAssetRatio: Ratio | undefined = getRatioFromGraph(
          graph,
          fromAsset,
          to || networkAssetRatio.baseAsset,
        );
        if (!toNetworkAssetRatio) {
          return new Ratio('0', fromAsset, networkAssetRatio.quoteAsset);
        }
        if (to) {
          return toNetworkAssetRatio;
        }
        return toNetworkAssetRatio.cross(networkAssetRatio);
      }),
      tap((ratio) => ratioSnapshotCache.set(toHash(fromAsset, to), ratio)),
      publishReplay(1),
      refCount(),
    );
  };

  const rate = (from: AssetInfo, to?: AssetInfo): Observable<Ratio> => {
    const hash = toHash(from, to);

    if (!ratioStreamCache.has(hash)) {
      ratioStreamCache.set(hash, createRateStream(from, to));
    }
    return ratioStreamCache.get(hash)!;
  };

  const convert: CurrencyConverter = ((
    from: Currency | Currency[],
    to?: AssetInfo,
  ): Observable<Currency> => {
    if (from instanceof Currency) {
      return rate(from.asset, to).pipe(
        map((convenientAssetRate) => convenientAssetRate.toQuoteCurrency(from)),
      );
    }

    if (!from.length) {
      return of(emptyConvenientAssetCurrency);
    }

    return combineLatest(
      from.map((i) =>
        rate(i.asset, to).pipe(
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

  const convertSnapshotWithSingleCurrency = (
    from: Currency,
    to?: AssetInfo,
  ): Currency => {
    const hash = toHash(from.asset, to);

    if (ratioSnapshotCache.has(hash)) {
      return ratioSnapshotCache.get(hash)!.toQuoteCurrency(from);
    }
    return to ? new Currency(0n, to) : emptyConvenientAssetCurrency;
  };

  const convertSnapshotWithMultipleCurrencies = (
    from: Currency[],
    to?: AssetInfo,
  ): Currency => {
    if (from.some((i) => !ratioSnapshotCache.has(toHash(i.asset, to)))) {
      return to ? new Currency(0n, to) : emptyConvenientAssetCurrency;
    }
    return from.reduce<Currency>(
      (sum, i) => {
        return sum.plus(
          ratioSnapshotCache.get(toHash(i.asset, to))!.toQuoteCurrency(i),
        );
      },
      to ? new Currency(0n, to) : emptyConvenientAssetCurrency,
    );
  };

  convert.snapshot = (
    from: Currency | Currency[],
    to?: AssetInfo,
  ): Currency => {
    if (from instanceof Array) {
      return convertSnapshotWithMultipleCurrencies(from, to);
    } else {
      return convertSnapshotWithSingleCurrency(from, to);
    }
  };

  convert.rate = rate;

  return convert;
};
