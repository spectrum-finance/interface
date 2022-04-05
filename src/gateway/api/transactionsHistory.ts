import { first, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const transactionsHistory$ = selectedNetwork$.pipe(
  switchMap((network) => network.txHistoryManager.transactionHistory$),
);

export const isTransactionsHistorySyncing$ = selectedNetwork$.pipe(
  switchMap((network) => network.txHistoryManager.isSyncing$),
);

export const syncTransactionsHistory = (): void => {
  selectedNetwork$
    .pipe(first())
    .subscribe((network) => network.txHistoryManager.sync());
};
