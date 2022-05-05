import { FC } from 'react';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const redeemFees$: Observable<FC> = selectedNetwork$.pipe(
  map((n) => n.RedeemFees),
  publishReplay(),
  refCount(),
);
