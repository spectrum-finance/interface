import { AmmPool as BaseAmmPool } from '@ergolabs/ergo-dex-sdk/build/main/amm/common/entities/ammPool';
import {
  catchError,
  combineLatest,
  filter,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  retry,
  switchMap,
  zip,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { nativeNetworkPools, networkPools } from '../ammPools/utils';
import { availableTokensData$ } from '../balance/common';
import { networkContext$ } from '../networkContext/networkContext';
import { tokenLocksGroupedByLpAsset$ } from './tokenLocks';

const getNativeNetworkAmmPools = () =>
  from(nativeNetworkPools().getAll({ limit: 500, offset: 0 })).pipe(
    map(([pools]) => pools),
    retry(applicationConfig.requestRetryCount),
  );

const getNetworkAmmPools = () =>
  from(networkPools().getAll({ limit: 500, offset: 0 })).pipe(
    map(([pools]) => pools),
    retry(applicationConfig.requestRetryCount),
  );

export const rawAmmPools$: Observable<BaseAmmPool[]> = networkContext$.pipe(
  switchMap(() => zip([getNativeNetworkAmmPools(), getNetworkAmmPools()])),
  map(([nativeNetworkPools, networkPools]) =>
    nativeNetworkPools.concat(networkPools),
  ),
  catchError(() => of(undefined)),
  filter(Boolean),
  publishReplay(1),
  refCount(),
);

export const rawAmmPoolsWithLiquidity$ = combineLatest([
  rawAmmPools$,
  availableTokensData$,
  tokenLocksGroupedByLpAsset$,
]).pipe(
  map(([rawAmmPools, availableTokensData, tokenLocksGroupedByLpAsset]) =>
    rawAmmPools.filter(
      (p) =>
        tokenLocksGroupedByLpAsset[p.lp.asset.id]?.length > 0 ||
        availableTokensData.some(
          ([value, info]) => info.id === p.lp.asset.id && value > 0n,
        ),
    ),
  ),
  publishReplay(1),
  refCount(),
);
