import { switchMap } from 'rxjs';

import { selectedNetwork$ } from '../network/network';

export const transactionsHistory$ = selectedNetwork$.pipe(
  switchMap((network) => network.getTxHistory(50)),
);
