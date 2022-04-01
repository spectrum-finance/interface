import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { first, Observable, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../network/network';

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

export const getOperationByTxId = (
  txId: string,
): Observable<AmmDexOperation | undefined> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((network) => network.txHistoryManager.getOperationByTxId(txId)),
  );
