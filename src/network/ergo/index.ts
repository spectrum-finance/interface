import { Network } from '../common';
import { addresses$ } from './addresses/addresses';
import { balance$ } from './balance/balance';
import { networkAssetBalance$ } from './balance/networkAssetBalance';
import { networkAsset$, useNetworkAsset } from './networkAsset/networkAsset';
import { pendingTransactionsCount$ } from './transactions/pendingTransactions';
import { getTxHistory } from './transactions/transactionsHistory';

export const ergoNetwork: Network = {
  addresses$,
  pendingTransactionsCount$,
  networkAsset$,
  networkAssetBalance$,
  balance$,
  getTxHistory,
  useNetworkAsset,
};
