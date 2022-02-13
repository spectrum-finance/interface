import { Network } from '../common';
import { addresses$ } from './addresses/addresses';
import { ammPools$ } from './ammPools/ammPools';
import { assetBalance$ } from './balance/assetBalance';
import { lpBalance$ } from './balance/lpBalance';
import { networkAssetBalance$ } from './balance/networkAssetBalance';
import { locks$ } from './locks/locks';
import { networkAsset$, useNetworkAsset } from './networkAsset/networkAsset';
import { positions$ } from './positions/positions';
import { pendingTransactionsCount$ } from './transactions/pendingTransactions';
import { getTxHistory } from './transactions/transactionsHistory';
import { connectWallet } from './wallets/connectWallet';
import { NautilusWallet } from './wallets/NautilusWallet';
import { YoroiWallet } from './wallets/YoroiWallet';

export const ergoNetwork: Network = {
  addresses$,
  pendingTransactionsCount$,
  networkAsset$,
  networkAssetBalance$,
  assetBalance$,
  lpBalance$,
  locks$,
  positions$,
  ammPools$,
  getTxHistory,
  useNetworkAsset,
  connectWallet,
  wallets: [YoroiWallet, NautilusWallet],
};
