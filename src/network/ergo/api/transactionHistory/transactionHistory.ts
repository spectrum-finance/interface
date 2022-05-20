import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { AugErgoTx } from '@ergolabs/ergo-sdk';
import {
  defer,
  first,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  takeUntil,
} from 'rxjs';
import TxHistoryWorker from 'worker-loader!./transactionHistory.worker';

import { tabClosing$ } from '../../../../common/streams/tabClosing';
import { Dictionary } from '../../../../common/utils/Dictionary';
import { localStorageManager } from '../../../../common/utils/localStorageManager';
import networkHistory from '../../../../services/networkHistory';
import { TxHistoryManager } from '../../../common/TxHistoryManager';
import { getAddresses } from '../addresses/addresses';
import {
  addToTabQueue,
  clearTabQueue,
  getSyncProcessTabs,
  isPrimaryTab,
  removeFromTabQueue,
  syncProcessTabs$,
} from './tabManager';
import {
  WorkerBatchMessage,
  WorkerBatchMessageData,
} from './workerMessages/workerBatchMessage';
import { WorkerStartMessage } from './workerMessages/workerStartMessage';
import { WorkerSyncEndMessage } from './workerMessages/workerSyncEndMessage';

interface TxHistoryCache {
  readonly handledTxs: Dictionary<Dictionary<boolean>>;
  readonly operations: Dictionary<AmmDexOperation[]>;
}

const TX_HISTORY_CACHE_KEY = 'tx-history-cache';

const TX_HISTORY_SYNC_CACHE_KEY = 'tx-history-sync-cache';

const TX_HISTORY_SYNCING_KEY = 'tx-history-syncing';

const txHistoryWorker = new TxHistoryWorker();

const addresses$ = getAddresses().pipe(first(), publishReplay(1), refCount());

let isWorkerActive = false;

const handleSyncEndMessage = () => {
  const historyCache = localStorageManager.get<TxHistoryCache>(
    TX_HISTORY_SYNC_CACHE_KEY,
  ) || {
    handledTxs: {},
    operations: {},
  };

  clearTabQueue();
  localStorageManager.set(TX_HISTORY_SYNCING_KEY, false);
  localStorageManager.set(TX_HISTORY_CACHE_KEY, {
    ...historyCache,
    operations: historyCache.operations,
  });
  localStorageManager.remove(TX_HISTORY_SYNC_CACHE_KEY);
  isWorkerActive = false;
};

const handleBatchMessage = ({
  handledTxs,
  address,
  operations,
}: WorkerBatchMessageData) => {
  let newHistoryCache = localStorageManager.get<TxHistoryCache>(
    TX_HISTORY_SYNC_CACHE_KEY,
  );

  if (!newHistoryCache) {
    newHistoryCache = { handledTxs: {}, operations: {} };
  }

  localStorageManager.set<TxHistoryCache>(TX_HISTORY_SYNC_CACHE_KEY, {
    handledTxs: {
      ...newHistoryCache.handledTxs,
      [address]: {
        ...((newHistoryCache.handledTxs || {})[address] || {}),
        ...handledTxs,
      },
    },
    operations: {
      ...newHistoryCache.operations,
      [address]: [
        ...((newHistoryCache.operations || {})[address] || []),
        ...operations,
      ],
    },
  });
};

txHistoryWorker.addEventListener(
  'message',
  ({ data }: MessageEvent<WorkerSyncEndMessage | WorkerBatchMessage>) => {
    switch (data.message) {
      case 'syncEnd':
        handleSyncEndMessage();
        break;
      case 'batch':
        handleBatchMessage(data.payload);
        break;
    }
  },
);

export const sync = (historyCacheKey: string = TX_HISTORY_CACHE_KEY): void => {
  localStorageManager.set(TX_HISTORY_SYNCING_KEY, true);
  addToTabQueue();
  isWorkerActive = true;
  addresses$.subscribe((addresses) => {
    const historyCache = localStorageManager.get<TxHistoryCache>(
      historyCacheKey,
    ) || { tmpOperations: {}, operations: {}, handledTxs: {} };
    const startMsg: WorkerStartMessage = {
      message: 'start',
      payload: {
        addresses,
        oldHandledTxs: historyCache.handledTxs,
        oldOperations: historyCache.operations,
      },
    };

    txHistoryWorker.postMessage(startMsg);
  });
};

tabClosing$.subscribe(() => removeFromTabQueue());

syncProcessTabs$.pipe(takeUntil(tabClosing$)).subscribe(() => {
  const isSyncing = localStorageManager.get(TX_HISTORY_SYNCING_KEY);
  const txHistory = localStorageManager.get(TX_HISTORY_CACHE_KEY);
  // TODO: FIX STREAM EVENT PRIORITY
  const tabs = getSyncProcessTabs();

  if (
    (!txHistory && !isSyncing) ||
    (isSyncing && !tabs.length) ||
    (isSyncing && isPrimaryTab() && !isWorkerActive)
  ) {
    sync(TX_HISTORY_SYNC_CACHE_KEY);
  }
  if (isSyncing && tabs.length) {
    addToTabQueue();
  }
});

export const isSyncing$ = localStorageManager
  .getStream<boolean>(TX_HISTORY_SYNCING_KEY)
  .pipe(map(Boolean));

export const transactionHistory$ = addresses$.pipe(
  switchMap((addresses) =>
    localStorageManager
      .getStream<TxHistoryCache>(TX_HISTORY_CACHE_KEY)
      .pipe(
        map<
          TxHistoryCache | undefined | null,
          [TxHistoryCache | undefined | null, string[]]
        >((txHistory) => [txHistory, addresses]),
      ),
  ),
  switchMap(([txHistory, addresses]) => {
    if (!txHistory) {
      return of([]);
    }

    return defer(() =>
      of(
        Object.entries(txHistory.operations)
          .filter(([address]) => addresses.includes(address))
          .flatMap(([, txs]) => txs),
      ),
    );
  }),
);

const toOperation = (
  tx: AugErgoTx | undefined,
): Observable<AmmDexOperation | undefined> => {
  if (!tx) {
    return of(undefined);
  }

  return addresses$.pipe(
    map((addresses) => networkHistory['parseOp'](tx, true, addresses)),
  );
};

export const getOperationByTxId = (
  txId: string,
): Observable<AmmDexOperation | undefined> =>
  from(networkHistory.network.getTx(txId)).pipe(switchMap(toOperation));

export const txHistoryManager: TxHistoryManager = {
  sync,
  transactionHistory$,
  isSyncing$,
  getOperationByTxId,
};
