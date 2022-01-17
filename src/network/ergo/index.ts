import { Network } from '../common';
import { addresses$ } from './addresses/addresses';
import { assetBalance$ } from './balance/balance';
import { networkAssetBalance$ } from './balance/networkAssetBalance';
import { networkAsset$, useNetworkAsset } from './networkAsset/networkAsset';
import { userPools$ } from './pools/userPools';
import { pendingTransactionsCount$ } from './transactions/pendingTransactions';
import { getTxHistory } from './transactions/transactionsHistory';

export const ergoNetwork: Network = {
  addresses$,
  pendingTransactionsCount$,
  networkAsset$,
  networkAssetBalance$,
  assetBalance$,
  userPools$,
  getTxHistory,
  useNetworkAsset,
};
