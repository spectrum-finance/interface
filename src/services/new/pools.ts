import {
  AmmPool as BaseAmmPool,
  makeNativePools,
  makePools,
  NetworkPools,
} from '@ergolabs/ergo-dex-sdk';
import {
  combineLatest,
  defer,
  from,
  interval,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { LOCKED_TOKEN_ID } from '../../components/common/ActionForm/ActionButton/ActionButton';
import { explorer } from '../explorer';
import { UPDATE_TIME } from './core';

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

export const pools$ = interval(UPDATE_TIME)
  .pipe(startWith(0))
  .pipe(
    switchMap(() => combineLatest([nativeNetworkPools$, networkPools$])),
    map(([nativeNetworkPools, networkPools]) =>
      nativeNetworkPools
        .concat(networkPools)
        .filter((p) => p.id != BlacklistedPoolId),
    ),
    map((pools) =>
      pools.filter(
        (p) =>
          p.x.asset.id !== LOCKED_TOKEN_ID && p.y.asset.id !== LOCKED_TOKEN_ID,
      ),
    ),
    map((pools) => pools.map((p) => new AmmPool(p))),
    publishReplay(1),
    refCount(),
  );
