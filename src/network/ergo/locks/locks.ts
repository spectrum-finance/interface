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
import { networkContext$ } from '../networkContext/networkContext';
import { positions$ } from '../positions/positions';
import { tokenLocks$ } from './common';

export const locks$: Observable<AssetLock[]> = combineLatest([
  positions$,
  tokenLocks$,
  networkContext$,
]).pipe(
  map(([positions, tokenLocks, networkContext]) =>
    tokenLocks.map(
      (tl) =>
        new AssetLock(
          positions.find((p) => p.lp.asset.id === tl.lockedAsset.asset.id)!,
          tl,
          networkContext.height,
        ),
    ),
  ),
);
