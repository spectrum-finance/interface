import { FC } from 'react';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const depositConfirmationInfo$: Observable<FC> = selectedNetwork$.pipe(
  map((n) => n.DepositConfirmationInfo),
  publishReplay(),
  refCount(),
);
