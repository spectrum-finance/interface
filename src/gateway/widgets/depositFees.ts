import { FC } from 'react';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const depositFees$: Observable<FC> = selectedNetwork$.pipe(
  map((n) => n.DepositFees),
  publishReplay(),
  refCount(),
);
