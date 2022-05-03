import {
  combineLatest,
  map,
  Observable,
  publishReplay,
  refCount,
  zip,
} from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { ammPools$ } from '../ammPools/ammPools';
import { balanceItems$ } from './balance';

export const assetBalance$: Observable<Balance> = combineLatest([
  balanceItems$,
  ammPools$,
]).pipe(
  map(([balanceItems, pools]) => {
    return balanceItems.filter(
      ([, info]) => !pools.some((p) => p.lp.asset.id === info.id),
    );
  }),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
