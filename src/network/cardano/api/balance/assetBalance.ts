import { map, Observable, publishReplay, refCount, tap, zip } from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { ammPools$ } from '../ammPools/ammPools';
import { balanceItems$ } from './balance';

export const assetBalance$: Observable<Balance> = zip([
  balanceItems$,
  ammPools$,
]).pipe(
  map(([balanceItems, pools]) => {
    return balanceItems.filter(
      ([, info]) => !pools.some((p) => p.lp.asset.id === info.id),
    );
  }),
  map((data) => new Balance(data)),
  tap((res) => console.log(res)),
  publishReplay(1),
  refCount(),
);
