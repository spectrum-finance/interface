import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import {
  combineLatest,
  defaultIfEmpty,
  defer,
  first,
  map,
  of,
  publishReplay,
  refCount,
  switchMap,
  takeUntil,
} from 'rxjs';
import TxHistoryWorker from 'worker-loader!./transactionHistory.worker';

import { Operation } from '../../../../../common/models/Operation';
import { tabClosing$ } from '../../../../../common/streams/tabClosing';
import { Dictionary } from '../../../../../common/utils/Dictionary';
import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { getAddresses } from '../../addresses/addresses';
import { mapToOperationOrEmpty } from '../common/mapToOperationOrEmpty';
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

const TX_HISTORY_CACHE_KEY = 'tx-transactionHistory-cache';

const TX_HISTORY_SYNC_CACHE_KEY = 'tx-transactionHistory-sync-cache';

const TX_HISTORY_SYNCING_KEY = 'tx-transactionHistory-syncing';

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

export const operationsHistory$ = addresses$.pipe(
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
  switchMap((operations) =>
    combineLatest(operations.map(mapToOperationOrEmpty)).pipe(
      defaultIfEmpty([]),
    ),
  ),
  map((operations) => operations.filter(Boolean) as Operation[]),
  publishReplay(1),
  refCount(),
);
