import axios from 'axios';
import { from, map, Observable, publishReplay, refCount } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig.ts';
import { PoolId } from '../../../../common/types.ts';

export const lbspWhitelist$: Observable<string[]> = from(
  axios.get(applicationConfig.networksSettings.cardano.lbspWhitelistUrl),
).pipe(
  map((res) => res.data.data),
  publishReplay(1),
  refCount(),
);

export const isLbspPool = (poolId: PoolId): Observable<boolean> =>
  lbspWhitelist$.pipe(
    map((lbspPools) => lbspPools.includes(poolId)),
    publishReplay(1),
    refCount(),
  );
