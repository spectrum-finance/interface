import { Network } from '../common';
import { addresses$ } from './addresses/addresses';
import { ammPools$ } from './ammPools/ammPools';
import { assets$ } from './assets/assets';
import { lpAssets$ } from './assets/lpAssets';
import { assetBalance$ } from './balance/assetBalance';
import { lpBalance$ } from './balance/lpBalance';
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
  assets$,
  lpAssets$,
  networkAssetBalance$,
  assetBalance$,
  lpBalance$,
  locks$,
  positions$,
  ammPools$,
  getTxHistory,
  useNetworkAsset,
};
