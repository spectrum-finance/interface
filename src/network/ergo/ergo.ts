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
import { networkContext$ } from './api/networkContext/networkContext';
import { deposit } from './api/operations/deposit';
import { redeem } from './api/operations/redeem';
import { refund } from './api/operations/refund';
import { swap } from './api/operations/swap';
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
import { initialize, initialized$ } from './initialized';
import {
  ErgoSettings,
  setSettings,
  settings,
  settings$,
} from './settings/settings';
import { exploreAddress, exploreLastBlock, exploreTx } from './utils/utils';
import { DepositFees } from './widgets/DepositFees/DepositFees';
import { GlobalSettingsModal } from './widgets/GlobalSettings/GlobalSettingsModal';
import { RedeemFees } from './widgets/RedeemFees/RedeemFees';
import { SwapFees } from './widgets/SwapFees/SwapFees';
import { SwapInfoContent } from './widgets/SwapInfoContent/SwapInfoContent';

export const ergoNetwork: Network<ErgoWalletContract, ErgoSettings> = {
  name: 'ergo',
  label: 'ergo',
  networkAsset,
  initialized$,
  initialize,
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
  networkContext$,

  settings$,
  settings,
  setSettings,

  swap,
  deposit,
  redeem,
  refund,

  exploreAddress,
  exploreTx,
  exploreLastBlock,

  GlobalSettingsModal,
  SwapInfoContent,
  SwapFees,
  DepositFees,
  RedeemFees,
};
