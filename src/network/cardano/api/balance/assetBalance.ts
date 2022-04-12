import { map, Observable, publishReplay, refCount, zip } from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { ammPools$ } from '../ammPools/ammPools';
import { balance$ } from './balance';

export const assetBalance$: Observable<Balance> = zip([
  balance$,
  ammPools$,
]).pipe(
  map(([balance]) => balance),
  publishReplay(1),
  refCount(),
);
