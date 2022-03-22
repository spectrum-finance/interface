import { Network } from '../common';
import {
  addresses$,
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from './addresses/addresses';
import { ammPools$ } from './ammPools/ammPools';
import { assetBalance$ } from './balance/assetBalance';
import { lpBalance$ } from './balance/lpBalance';
import { networkAssetBalance$ } from './balance/networkAssetBalance';
import { locks$ } from './locks/locks';
import { networkAsset$, useNetworkAsset } from './networkAsset/networkAsset';
import { positions$ } from './positions/positions';
import { pendingTransactionsCount$ } from './transactions/pendingTransactions';
import { getTxHistory } from './transactions/transactionsHistory';
import {
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  selectedWalletState$,
  wallets$,
} from './wallets';

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
  wallets$,
  selectedWallet$,
  selectedWalletState$,
  disconnectWallet,
  getAddresses,
  getUsedAddresses,
  getUnusedAddresses,
};
