import {
  AmmPool as BaseAmmPool,
  makeNativePools,
  makePools,
  NetworkPools,
  PoolId,
} from '@ergolabs/ergo-dex-sdk';
import { AssetAmount, ErgoBox } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  defer,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  zip,
} from 'rxjs';

import { getListAvailableTokens } from '../../utils/getListAvailableTokens';
import {
  math,
  parseUserInputToFractions,
  renderFractions,
} from '../../utils/math';
import { explorer } from '../explorer';
import { utxos$ } from './core';
import { Currency } from './currency';

export const networkPools = (): NetworkPools => makePools(explorer);
export const nativeNetworkPools = (): NetworkPools => makeNativePools(explorer);

const BlacklistedPoolId =
  'bee300e9c81e48d7ab5fc29294c7bbb536cf9dcd9c91ee3be9898faec91b11b6';

const utxosToTokenIds = (utxos: ErgoBox[]): string[] =>
  Object.values(getListAvailableTokens(utxos)).map((token) => token.tokenId);

const filterPoolsByTokenIds = (
  pools: BaseAmmPool[],
  tokenIds: string[],
): BaseAmmPool[] => pools.filter((p) => tokenIds.includes(p.lp.asset.id));

const nativeNetworkPools$ = defer(() =>
  from(nativeNetworkPools().getAll({ limit: 100, offset: 0 })),
).pipe(
  map(([pools]) => pools),
  publishReplay(1),
  refCount(),
);

const networkPools$ = defer(() =>
  from(networkPools().getAll({ limit: 100, offset: 0 })),
).pipe(
  map(([pools]) => pools),
  publishReplay(1),
  refCount(),
);

export const pools$ = combineLatest([nativeNetworkPools$, networkPools$]).pipe(
  map(([nativeNetworkPools, networkPools]) =>
    nativeNetworkPools
      .concat(networkPools)
      .filter((p) => p.id != BlacklistedPoolId),
  ),
  map((pools) => pools.map((p) => new AmmPool(p))),
  publishReplay(1),
  refCount(),
);

const availableNativeNetworkPools$ = utxos$.pipe(
  map(utxosToTokenIds),
  switchMap((tokensIds) =>
    from(
      nativeNetworkPools().getByTokensUnion(tokensIds, {
        limit: 500,
        offset: 0,
      }),
    ).pipe(map(([pools]) => filterPoolsByTokenIds(pools, tokensIds))),
  ),
  publishReplay(1),
  refCount(),
);

const availableNetworkPools$ = utxos$.pipe(
  map(utxosToTokenIds),
  switchMap((tokensIds) =>
    from(
      networkPools().getByTokensUnion(tokensIds, {
        limit: 500,
        offset: 0,
      }),
    ).pipe(map(([pools]) => filterPoolsByTokenIds(pools, tokensIds))),
  ),
  publishReplay(1),
  refCount(),
);

export const availablePools$: Observable<BaseAmmPool[]> = zip([
  availableNativeNetworkPools$,
  availableNetworkPools$,
]).pipe(
  map(([nativePools, pools]) => nativePools.concat(pools)),
  publishReplay(1),
  refCount(),
);

export const getPoolById = (
  poolId: PoolId,
): Observable<BaseAmmPool | undefined> =>
  availablePools$.pipe(
    map((pools) => pools.find((position) => position.id === poolId)),
  );

const byPair = (xId: string, yId: string) => (p: AmmPool) =>
  (p.x.asset.id === xId || p.y.asset.id === xId) &&
  (p.x.asset.id === yId || p.y.asset.id === yId);

export const getPoolByPair = (
  xId: string,
  yId: string,
): Observable<AmmPool[]> =>
  pools$.pipe(
    map((pools) => pools.filter(byPair(xId, yId))),
    publishReplay(1),
    refCount(),
  );

export class AmmPool {
  constructor(private pool: BaseAmmPool) {}

  get id(): PoolId {
    return this.pool.id;
  }

  get poolFeeNum(): number {
    return this.pool.poolFeeNum;
  }

  get feeNum(): bigint {
    return this.pool.feeNum;
  }

  get lp(): Currency {
    return new Currency(this.pool.lp.amount, this.pool.lp.asset);
  }

  get y(): Currency {
    return new Currency(this.pool.y.amount, this.pool.y.asset);
  }

  get x(): Currency {
    return new Currency(this.pool.x.amount, this.pool.x.asset);
  }

  calculateDepositAmount(currency: Currency): Currency {
    const depositAmount = this.pool.depositAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(depositAmount?.amount || 0n, depositAmount?.asset);
  }

  calculateInputAmount(currency: Currency): Currency {
    const inputAmount = this.pool.inputAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(inputAmount?.amount || 0n, inputAmount?.asset);
  }

  calculateOutputAmount(currency: Currency): Currency {
    const outputAmount = this.pool.outputAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(outputAmount.amount || 0n, outputAmount?.asset);
  }
}
