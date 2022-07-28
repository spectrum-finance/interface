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
import { isSyncing$, sync } from './api/operations/history/transactionHistory';
import { getOperationByTxId, getOperations } from './api/operations/operations';
import { pendingOperations$ } from './api/operations/pending/pendingOperations';
import { queuedOperation$ } from './api/operations/pending/queuedOperation';
import { getPoolChartData } from './api/poolChart/poolChart';
import { positions$ } from './api/positions/positions';
import {
  defaultTokenAssets$,
  importedTokenAssets$,
  tokenAssetsToImport$,
} from './api/tokens/tokens';
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
import { deposit } from './operations/deposit';
import { redeem } from './operations/redeem';
import { refund } from './operations/refund';
import { swap } from './operations/swap';
import {
  ErgoSettings,
  setSettings,
  settings,
  settings$,
} from './settings/settings';
import {
  useCreatePoolValidationFee,
  useDepositValidationFee,
  useRedeemValidationFee,
  useSwapValidationFee,
} from './settings/totalFees';
import {
  exploreAddress,
  exploreLastBlock,
  exploreToken,
  exploreTx,
} from './utils/utils';
import { DepositConfirmationInfo } from './widgets/DepositConfirmationInfo/DepositConfirmationInfo';
import { GlobalSettingsModal } from './widgets/GlobalSettings/GlobalSettingsModal';
import { OperationsSettings } from './widgets/OperationSettings/OperationsSettings';
import { RedeemConfirmationInfo } from './widgets/RedeemConfirmationInfo/RedeemConfirmationInfo';
import { RefundConfirmationInfo } from './widgets/RefundConfirmationInfo/RefundConfirmationInfo';
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
  convenientAssetDefaultPreview: '<$0.01',
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
  connectWallet,
  disconnectWallet,
  availableWallets,
  walletState$,
  selectedWallet$,
  supportedFeatures$: supportedWalletFeatures$,
  networkContext$,
  defaultTokenAssets$,
  tokenAssetsToImport$,
  importedTokenAssets$,
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
  exploreToken,

  GlobalSettingsModal,
  SwapInfoContent,
  SwapConfirmationInfo,
  DepositConfirmationInfo,
  RedeemConfirmationInfo,
  RefundConfirmationInfo,
  OperationsSettings,

  convertToConvenientNetworkAsset,

  useSwapValidationFee,
  useDepositValidationFee,
  useRedeemValidationFee,
  useCreatePoolValidationFee,

  getPoolChartData,
  getOperationByTxId,
  getOperations,
  syncOperations: sync,
  isOperationsSyncing$: isSyncing$,
  pendingOperations$,
  queuedOperation$,
};
