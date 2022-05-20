import { mkLockParser, mkLocksHistory } from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { explorer } from '../../../../services/explorer';
import { getAddresses } from '../addresses/addresses';
import { networkContext$ } from '../networkContext/networkContext';

export const locksHistory = mkLocksHistory(explorer, mkLockParser());

export const tokenLocks$: Observable<TokenLock[]> = networkContext$.pipe(
  switchMap(() => getAddresses()),
  switchMap((addresses) => locksHistory.getAllByAddresses(addresses)),
  map((locks) => locks.filter((l) => l.active)),
  publishReplay(1),
  refCount(),
);

export const tokenLocksGroupedByLpAsset$: Observable<{
  [key: string]: TokenLock[];
}> = tokenLocks$.pipe(
  map((locks) => locks.filter((l) => l.active)),
  map((locks) =>
    locks.reduce<{ [key: string]: TokenLock[] }>((acc, lock) => {
      if (!acc[lock.lockedAsset.asset.id]) {
        acc[lock.lockedAsset.asset.id] = [];
      }

      acc[lock.lockedAsset.asset.id].push(lock);

      return acc;
    }, {}),
  ),
);
