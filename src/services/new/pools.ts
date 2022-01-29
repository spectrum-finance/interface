import {
  AmmPool as BaseAmmPool,
  makeNativePools,
  makePools,
  NetworkPools,
  PoolId,
} from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { ErgoBox } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  defer,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  zip,
} from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { tokenLocks$ } from '../../network/ergo/locks/common';
import { getListAvailableTokens } from '../../utils/getListAvailableTokens';
import { explorer } from '../explorer';
import { lpWalletBalance$ } from './balance';
import { utxos$ } from './core';

export const networkPools = (): NetworkPools => makePools(explorer);
export const nativeNetworkPools = (): NetworkPools => makeNativePools(explorer);

const BlacklistedPoolId =
  'bee300e9c81e48d7ab5fc29294c7bbb536cf9dcd9c91ee3be9898faec91b11b6';

export interface PoolData {
  readonly pool: AmmPool;
  readonly lpAmount: Currency;
  readonly xAmount: Currency;
  readonly yAmount: Currency;
}

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
    ).pipe(map(([pools]) => pools)),
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
    ).pipe(map(([pools]) => pools)),
  ),
  publishReplay(1),
  refCount(),
);

export const availablePools$: Observable<AmmPool[]> = utxos$.pipe(
  map(utxosToTokenIds),
  switchMap((tokenIds) =>
    combineLatest([
      tokenLocks$,
      zip([availableNativeNetworkPools$, availableNetworkPools$]),
    ]).pipe(
      map(
        ([tokenLocks, [nativePools, pools]]) =>
          [nativePools, pools, tokenLocks] as any,
      ),
      map(
        ([nativePools, pools, tokenLocks]: [
          BaseAmmPool[],
          BaseAmmPool[],
          TokenLock[],
        ]) => {
          const allPools = nativePools.concat(pools);
          const filteredPools = filterPoolsByTokenIds(allPools, tokenIds).map(
            (bap) => {
              return tokenLocks
                .filter((l) => l.lockedAsset.asset.id === bap.lp.asset.id)
                .reduce<BaseAmmPool>((bap, l) => {
                  //@ts-ignore
                  bap.lp.amount += l.lockedAsset.amount;
                  return bap;
                }, bap);
            },
          );
          const lockedPools = tokenLocks
            .filter(
              (l) =>
                !filteredPools.some(
                  (fp) => fp.lp.asset.id === l.lockedAsset.asset.id,
                ),
            )
            .map((l) => {
              const pool = allPools.find(
                (p) => p.lp.asset.id === l.lockedAsset.asset.id,
              )!;
              //@ts-ignore
              pool.lp.amount += l.lockedAsset.amount;

              return pool;
            });

          return filteredPools.concat(lockedPools as any);
        },
      ),
    ),
  ),
  map((pools) => pools.map((p) => new AmmPool(p))),
  publishReplay(1),
  refCount(),
);

export const getPoolById = (poolId: PoolId): Observable<AmmPool | undefined> =>
  pools$.pipe(map((pools) => pools.find((position) => position.id === poolId)));

export const getAvailablePoolById = (
  poolId: PoolId,
): Observable<AmmPool | undefined> =>
  pools$.pipe(map((pools) => pools.find((position) => position.id === poolId)));

export const getAvailablePoolDataById = (
  poolId: PoolId,
): Observable<PoolData | undefined> =>
  !poolId
    ? of(undefined)
    : combineLatest([getPoolById(poolId), lpWalletBalance$]).pipe(
        map(([pool, balance]) => {
          if (!pool) {
            return undefined;
          }
          const lpAmount = balance.get(pool.lp.asset);
          const [xAmount, assetY] = pool.shares(lpAmount);

          return { pool, lpAmount, xAmount: xAmount, yAmount: assetY };
        }),
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
