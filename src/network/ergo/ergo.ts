import { Network } from '../common/Network';
import {
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
import { txHistoryManager } from './transactionHistory/transactionHistory';
import { ErgoWalletContract } from './wallet/common/ErgoWalletContract';
import {
  availableWallets,
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  supportedWalletFeatures$,
  walletState$,
} from './wallet/wallet';

export const ergoNetwork: Network<ErgoWalletContract> = {
  networkAsset$,
  networkAssetBalance$,
  assetBalance$,
  lpBalance$,
  locks$,
  positions$,
  ammPools$,
  useNetworkAsset,
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
