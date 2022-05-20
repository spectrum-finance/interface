import { FC } from 'react';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const redeemConfirmationInfo$: Observable<FC> = selectedNetwork$.pipe(
  map((n) => n.RedeemConfirmationInfo),
  publishReplay(),
  refCount(),
);
