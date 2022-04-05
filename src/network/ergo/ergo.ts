import { Network } from '../common/Network';
import {
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from './api/addresses/addresses';
import { ammPools$ } from './api/ammPools/ammPools';
import { assetBalance$ } from './api/balance/assetBalance';
import { lpBalance$ } from './api/balance/lpBalance';
import { networkAssetBalance$ } from './api/balance/networkAssetBalance';
import { locks$ } from './api/locks/locks';
import { networkAsset } from './api/networkAsset/networkAsset';
import { positions$ } from './api/positions/positions';
import { txHistoryManager } from './api/transactionHistory/transactionHistory';
import { ErgoWalletContract } from './api/wallet/common/ErgoWalletContract';
import {
  availableWallets,
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  supportedWalletFeatures$,
  walletState$,
} from './api/wallet/wallet';

export const ergoNetwork: Network<ErgoWalletContract> = {
  name: 'ergo',
  networkAsset,
  networkAssetBalance$,
  assetBalance$,
  lpBalance$,
  locks$,
  positions$,
  ammPools$,
  getAddresses,
  getUsedAddresses,
  getUnusedAddresses,
  txHistoryManager,
  connectWallet,
  disconnectWallet,
  availableWallets,
  walletState$,
  selectedWallet$,
  supportedFeatures$: supportedWalletFeatures$,
};
