import { LmPool } from '@ergolabs/ergo-dex-sdk';
import { from, map, Observable, retry } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { networkLmPools } from '../lmPools/utils';

const getNetworkLmPools = () =>
  from(networkLmPools().getAll({ limit: 100, offset: 0 })).pipe(
    map(([pools]) => pools),
    retry(applicationConfig.requestRetryCount),
  );

export const rawLmPools$: Observable<LmPool[]> = getNetworkLmPools();
