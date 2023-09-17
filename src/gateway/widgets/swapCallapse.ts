import { FC } from 'react';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { selectedNetwork$ } from '../common/network';

export const swapCollapse$: Observable<FC<{ value: SwapFormModel }>> =
  selectedNetwork$.pipe(
    map((n) => n.SwapCollapse),
    publishReplay(),
    refCount(),
  );
