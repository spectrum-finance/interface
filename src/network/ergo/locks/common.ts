import { mkLockParser, mkLocksHistory } from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { explorer } from '../../../services/explorer';
import { addresses$ } from '../addresses/addresses';

export const locksHistory = mkLocksHistory(explorer, mkLockParser());

export const tokenLocks$: Observable<TokenLock[]> = addresses$.pipe(
  switchMap((addresses) => locksHistory.getAllByAddresses(addresses)),
  map((locks) => locks.filter((l) => l.active)),
  publishReplay(1),
  refCount(),
);
