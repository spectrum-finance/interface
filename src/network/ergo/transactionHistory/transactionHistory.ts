import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { defer, first, map, of, switchMap, tap } from 'rxjs';
import TxHistoryWorker from 'worker-loader!./transactionHistory.worker';

import { Dictionary } from '../../../common/utils/Dictionary';
import { localStorageManager } from '../../../common/utils/localStorageManager';
import { TxHistoryManager } from '../../common';
import { getAddresses } from '../addresses/addresses';
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

const handleSyncEndMessage = () => {
  const historyCache = localStorageManager.get<TxHistoryCache>(
    TX_HISTORY_SYNC_CACHE_KEY,
  ) || {
    handledTxs: {},
    operations: {},
  };

  localStorageManager.set(TX_HISTORY_SYNCING_KEY, false);
  localStorageManager.set(TX_HISTORY_CACHE_KEY, {
    ...historyCache,
    operations: historyCache.operations,
  });
  localStorageManager.remove(TX_HISTORY_SYNC_CACHE_KEY);
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
        ...(newHistoryCache.handledTxs[address] || {}),
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

export const sync = (): void => {
  localStorageManager.set(TX_HISTORY_SYNCING_KEY, true);

  getAddresses()
    .pipe(first())
    .subscribe((addresses) => {
      const historyCache = localStorageManager.get<TxHistoryCache>(
        TX_HISTORY_CACHE_KEY,
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

export const isSyncing$ = localStorageManager
  .getStream<boolean>(TX_HISTORY_SYNCING_KEY)
  .pipe(map(Boolean));

export const transactionHistory$ = getAddresses().pipe(
  first(),
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
  tap(([txHistory]) => {
    if (!txHistory) {
      sync();
    }
  }),
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

export const txHistoryManager: TxHistoryManager = {
  sync,
  transactionHistory$,
  isSyncing$,
};
