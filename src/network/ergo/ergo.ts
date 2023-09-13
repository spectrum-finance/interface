import { of } from 'rxjs';

import { Network } from '../common/Network';
import {
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from './api/addresses/addresses';
import { ammPools$, displayedAmmPools$ } from './api/ammPools/ammPools';
import { ErgoAmmPool } from './api/ammPools/ErgoAmmPool';
import {
  assetsToImport$,
  defaultAssets$,
  getAssetsToImportFor,
  getDefaultAssetsFor,
  getImportedAssetsFor,
  importedAssets$,
} from './api/assets/assets';
import { assetBalance$ } from './api/balance/assetBalance';
import { lpBalance$ } from './api/balance/lpBalance';
import { networkAssetBalance$ } from './api/balance/networkAssetBalance';
import { importTokenAsset } from './api/common/availablePoolsOrTokens';
import { convertToConvenientNetworkAsset } from './api/ergoUsdRatio/ergoUsdRatio';
import { locks$ } from './api/locks/locks';
import { networkAsset, useNetworkAsset } from './api/networkAsset/networkAsset';
import { networkContext$ } from './api/networkContext/networkContext';
import {
  getOperationByTxId,
  getOperations,
  pendingOperationsCount$,
} from './api/operations/history/v2/operationsHistory';
import { queuedOperation$ } from './api/operations/pending/queuedOperation';
import { platformStats$ } from './api/platformStats/platformStats';
import { getPoolChartData } from './api/poolChart/poolChart';
import { positions$ } from './api/positions/positions';
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
import { farms$ } from './lm/api/farms/farms';
import { lmDeposit } from './lm/operations/lmDeposit/lmDeposit';
import { lmRedeem } from './lm/operations/lmRedeem/lmRedeem';
import { createPool } from './operations/createPool/createPool';
import { useCreatePoolValidators } from './operations/createPool/useCreatePoolValidators';
import { deposit } from './operations/deposit/deposit';
import { useDepositValidators } from './operations/deposit/useDepositValidators';
import { useHandleCreatePoolMaxButtonClick } from './operations/deposit/useHandleCreatePoolMaxButtonClick';
import { useHandleDepositMaxButtonClick } from './operations/deposit/useHandleDepositMaxButtonClick';
import { redeem } from './operations/redeem/redeem';
import { refund } from './operations/refund/refund';
import { swap } from './operations/swap/swap';
import { useHandleSwapMaxButtonClick } from './operations/swap/useHandleSwapMaxButtonClick';
import { useSwapValidators } from './operations/swap/useSwapValidators';
import {
  ErgoSettings,
  getSettings,
  setSettings,
  settings$,
} from './settings/settings';
import {
  exploreAddress,
  exploreLastBlock,
  exploreToken,
  exploreTx,
} from './utils/utils';
import { OperationsSettings } from './widgets/OperationSettings/OperationsSettings';
import { RefundConfirmationInfo } from './widgets/RefundConfirmationModal/RefundConfirmationInfo/RefundConfirmationInfo';
import { SwapInfoContent } from './widgets/SwapInfoContent/SwapInfoContent';

export const ergoNetwork: Network<
  ErgoWalletContract,
  ErgoSettings,
  ErgoAmmPool
> = {
  name: 'ergo',
  label: 'Ergo',
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
  displayedAmmPools$,
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
  defaultAssets$,
  getDefaultAssetsFor,
  assetsToImport$,
  getAssetsToImportFor,
  importedAssets$,
  getImportedAssetsFor,
  importTokenAsset,

  platformStats$,
  settings$,
  get settings() {
    return getSettings();
  },
  setSettings,

  swap,
  deposit,
  redeem,
  refund,
  lmDeposit,
  lmRedeem,
  createPool,

  exploreAddress,
  exploreTx,
  exploreLastBlock,
  exploreToken,

  SwapInfoContent,
  RefundConfirmationInfo,
  OperationsSettings,

  convertToConvenientNetworkAsset,
  useNetworkAsset,

  useSwapValidators,
  useHandleSwapMaxButtonClick,
  useDepositValidators,
  useCreatePoolValidators,
  useHandleDepositMaxButtonClick,
  useHandleCreatePoolMaxButtonClick,
  getPoolChartData,

  getOperations,
  getOperationByTxId,
  pendingOperationsCount$,
  queuedOperation$,
  hasNeedRefundOperations$: of(false),

  farmPools$: farms$,
};
