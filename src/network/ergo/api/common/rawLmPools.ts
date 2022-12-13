import { LmPool } from '@ergolabs/ergo-dex-sdk';
import {
  catchError,
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
import { networkLmPools } from '../lmPools/utils';
import { networkContext$ } from '../networkContext/networkContext';

const getNetworkLmPools = () =>
  from(networkLmPools().getAll({ limit: 100, offset: 0 })).pipe(
    map(([pools]) => pools),
    retry(applicationConfig.requestRetryCount),
  );

export const rawLmPools$: Observable<LmPool[]> = networkContext$.pipe(
  switchMap(() => zip([getNetworkLmPools()])),
  map(([lmPools]) => lmPools),
  catchError(() => of(undefined)),
  filter(Boolean),
  publishReplay(1),
  refCount(),
);
