import { Network } from '../common';
import { addresses$ } from './addresses/addresses';
import { ammPools$ } from './ammPools/ammPools';
import { userPools$ } from './ammPools/userPools';
import { assetBalance$ } from './balance/balance';
import { networkAssetBalance$ } from './balance/networkAssetBalance';
import { locks$ } from './locks/locks';
import { networkAsset$, useNetworkAsset } from './networkAsset/networkAsset';
import { positions$ } from './positions/positions';
import { pendingTransactionsCount$ } from './transactions/pendingTransactions';
import { getTxHistory } from './transactions/transactionsHistory';

export const ergoNetwork: Network = {
  addresses$,
  pendingTransactionsCount$,
  networkAsset$,
  networkAssetBalance$,
  assetBalance$,
  locks$,
  positions$,
  userPools$,
  ammPools$,
  getTxHistory,
  useNetworkAsset,
};
