import {
  combineLatest,
  debounceTime,
  map,
  publishReplay,
  refCount,
} from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { ammPools$ } from '../ammPools/ammPools';
import { availableTokensData$ } from './common';
import { networkAssetBalance$ } from './networkAssetBalance';

export const assetBalance$ = combineLatest([
  networkAssetBalance$,
  ammPools$,
  availableTokensData$,
]).pipe(
  debounceTime(100),
  map(([networkAssetBalance, pools, availableTokensData]) =>
    availableTokensData
      .filter(([, info]) => !pools.some((p) => p.lp.asset.id === info.id))
      .concat([[networkAssetBalance.amount, networkAssetBalance.asset]]),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
