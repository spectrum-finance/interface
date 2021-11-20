import {
  AmmPool,
  makeNativePools,
  makePools,
  NetworkPools,
  PoolId,
} from '@ergolabs/ergo-dex-sdk';
import { ErgoBox } from '@ergolabs/ergo-sdk';
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
import { explorer } from '../explorer';
import { utxos$ } from './core';

export const networkPools = (): NetworkPools => makePools(explorer);
export const nativeNetworkPools = (): NetworkPools => makeNativePools(explorer);

const BlacklistedPoolId =
  'bee300e9c81e48d7ab5fc29294c7bbb536cf9dcd9c91ee3be9898faec91b11b6';

const utxosToTokenIds = (utxos: ErgoBox[]): string[] =>
  Object.values(getListAvailableTokens(utxos)).map((token) => token.tokenId);

const filterPoolsByTokenIds = (
  pools: AmmPool[],
  tokenIds: string[],
): AmmPool[] => pools.filter((p) => tokenIds.includes(p.lp.asset.id));

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

export const availablePools$: Observable<AmmPool[]> = zip([
  availableNativeNetworkPools$,
  availableNetworkPools$,
]).pipe(
  map(([nativePools, pools]) => nativePools.concat(pools)),
  startWith([]),
  publishReplay(1),
  refCount(),
);

export const getPoolById = (poolId: PoolId): Observable<AmmPool | undefined> =>
  availablePools$.pipe(
    map((pools) => pools.find((position) => position.id === poolId)),
  );

const byPair = (xId: string, yId: string) => (p: AmmPool) =>
  (p.assetX.id === xId || p.assetY.id === xId) &&
  (p.assetX.id === yId || p.assetY.id === yId);
export const getPoolByPair = (
  xId: string,
  yId: string,
): Observable<AmmPool[]> =>
  pools$.pipe(
    map((pools) => pools.filter(byPair(xId, yId))),
    publishReplay(1),
    refCount(),
  );
