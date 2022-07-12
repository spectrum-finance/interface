import { Network } from '../common/Network';
import {
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from './api/addresses/addresses';
import { ammPools$, possibleAmmPools$ } from './api/ammPools/ammPools';
import { ErgoAmmPool } from './api/ammPools/ErgoAmmPool';
import { assetBalance$ } from './api/balance/assetBalance';
import { lpBalance$ } from './api/balance/lpBalance';
import { networkAssetBalance$ } from './api/balance/networkAssetBalance';
import { importTokenAsset } from './api/common/availablePoolsOrTokens';
import { convertToConvenientNetworkAsset } from './api/ergoUsdRatio/ergoUsdRatio';
import { locks$ } from './api/locks/locks';
import { networkAsset } from './api/networkAsset/networkAsset';
import { networkContext$ } from './api/networkContext/networkContext';
import { deposit } from './api/operations/deposit';
import { redeem } from './api/operations/redeem';
import { refund } from './api/operations/refund';
import { swap } from './api/operations/swap';
import { getPoolChartData } from './api/poolChart/poolChart';
import { positions$ } from './api/positions/positions';
import {
  availableTokenAssets$,
  tokenAssetsToImport$,
} from './api/tokens/tokens';
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
import {
  useDepositValidationFee,
  useRedeemValidationFee,
  useSwapValidationFee,
} from './settings/totalFees';
import { exploreAddress, exploreLastBlock, exploreTx } from './utils/utils';
import { DepositConfirmationInfo } from './widgets/DepositConfirmationInfo/DepositConfirmationInfo';
import { GlobalSettingsModal } from './widgets/GlobalSettings/GlobalSettingsModal';
import { RedeemConfirmationInfo } from './widgets/RedeemConfirmationInfo/RedeemConfirmationInfo';
import { SwapConfirmationInfo } from './widgets/SwapConfirmationInfo/SwapConfirmationInfo';
import { SwapInfoContent } from './widgets/SwapInfoContent/SwapInfoContent';

export const ergoNetwork: Network<
  ErgoWalletContract,
  ErgoSettings,
  ErgoAmmPool
> = {
  name: 'ergo',
  label: 'ergo',
  favicon: '/favicon-ergo.svg',
  convenientAssetDefaultPreview: '$0.00',
  networkAsset,
  initialized$,
  initialize,
  networkAssetBalance$,
  assetBalance$,
  lpBalance$,
  locks$,
  positions$,
  ammPools$,
  possibleAmmPools$,
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
  availableTokenAssets$,
  tokenAssetsToImport$,
  importTokenAsset,

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
  SwapConfirmationInfo,
  DepositConfirmationInfo,
  RedeemConfirmationInfo,

  convertToConvenientNetworkAsset,

  useSwapValidationFee,
  useDepositValidationFee,
  useRedeemValidationFee,

  getPoolChartData,
};
