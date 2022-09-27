import { map, publishReplay, refCount, zip } from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { ammPools$ } from '../ammPools/ammPools';
import { balanceItems$ } from './common';
import { networkAssetBalance$ } from './networkAssetBalance';

export const assetBalance$ = zip([
  networkAssetBalance$,
  ammPools$,
  balanceItems$,
]).pipe(
  map(([networkAssetBalance, pools, balanceItems]) =>
    balanceItems
      .filter(([, info]) => !pools.some((p) => p.lp.asset.id === info.id))
      .concat([[networkAssetBalance.amount, networkAssetBalance.asset]]),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
