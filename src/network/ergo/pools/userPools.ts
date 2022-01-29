import { AmmPool as BaseAmmPool } from '@ergolabs/ergo-dex-sdk';
import { ErgoBox } from '@ergolabs/ergo-sdk';
import {
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  zip,
} from 'rxjs';

import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { utxos$ } from '../../../services/new/core';
import { getListAvailableTokens } from '../../../utils/getListAvailableTokens';
import { nativeNetworkPools, networkPools } from './common';

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

export const userPools$: Observable<AmmPool[]> = zip([
  availableNativeNetworkPools$,
  availableNetworkPools$,
]).pipe(
  map(([nativePools, pools]) => nativePools.concat(pools)),
  map((pools) => pools.map((p) => new AmmPool(p))),
  publishReplay(1),
  refCount(),
);
