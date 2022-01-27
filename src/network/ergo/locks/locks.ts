import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import {
  combineLatest,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AssetLock } from '../../../common/models/AssetLock';
import { addresses$ } from '../addresses/addresses';
import { networkContext$ } from '../networkContext/networkContext';
import { pools$ } from '../pools/pools';
import { locksHistory } from './common';

const tokenLocks$: Observable<TokenLock[]> = addresses$.pipe(
  switchMap((addresses) => locksHistory.getAllByAddresses(addresses)),
  publishReplay(1),
  refCount(),
);

export const locks$: Observable<AssetLock[]> = combineLatest([
  pools$,
  tokenLocks$,
  networkContext$,
]).pipe(
  map(([pools, tokenLocks, networkContext]) =>
    tokenLocks.map(
      (tl) =>
        new AssetLock(
          pools.find((p) => p.lp.asset.id === tl.lockedAsset.asset.id)!,
          tl,
          networkContext.height,
        ),
    ),
  ),
);
