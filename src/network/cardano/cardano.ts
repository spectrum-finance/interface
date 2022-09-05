import { Observable, of } from 'rxjs';

import { TxId } from '../../common/types';
import { Network } from '../common/Network';
import { convertToConvenientNetworkAsset } from './api/adaRatio/adaRatio';
import {
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from './api/addresses/addresses';
import { ammPools$ } from './api/ammPools/ammPools';
import { CardanoAmmPool } from './api/ammPools/CardanoAmmPool';
import { assetBalance$ } from './api/balance/assetBalance';
import { lpBalance$ } from './api/balance/lpBalance';
import { networkAssetBalance$ } from './api/balance/networkAssetBalance';
import { networkAsset } from './api/networkAsset/networkAsset';
import { networkContext$ } from './api/networkContext/networkContext';
import { deposit } from './api/operations/deposit';
import { redeem } from './api/operations/redeem';
import { swap } from './api/operations/swap';
import { positions$ } from './api/positions/positions';
import {
  defaultTokenAssets$,
  importTokenAsset,
  tokenAssetsToImport$,
} from './api/tokens/tokens';
import { getOperations } from './api/transactionHistory/transactionHistory';
import { CardanoWalletContract } from './api/wallet/common/CardanoWalletContract';
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
  CardanoSettings,
  setSettings,
  settings,
  settings$,
} from './settings/settings';
import {
  useCreatePoolValidationFee,
  useDepositValidationFee,
  useRedeemValidationFee,
  useSwapValidationFee,
} from './settings/totalFee';
import {
  exploreAddress,
  exploreLastBlock,
  exploreToken,
  exploreTx,
} from './utils/utils';
import { DepositConfirmationInfo } from './widgets/DepositConfirmationInfo/DepositConfirmationInfo';
import { OperationsSettings } from './widgets/OperationSettings/OperationsSettings';
import { RedeemConfirmationInfo } from './widgets/RedeemConfirmationInfo/RedeemConfirmationInfo';
import { SwapConfirmationInfo } from './widgets/SwapConfirmationInfo/SwapConfirmationInfo';
import { SwapInfoContent } from './widgets/SwapInfoContent/SwapInfoContent';

export const cardanoNetwork: Network<
  CardanoWalletContract,
  CardanoSettings,
  CardanoAmmPool
> = {
  name: 'cardano',
  label: 'cardano (Testnet)',
  favicon: '/favicon-cardano.svg',
  convenientAssetDefaultPreview: '0 ADA',
  networkAsset,
  initialized$,
  initialize,
  networkAssetBalance$,
  assetBalance$,
  lpBalance$,
  locks$: of([]),
  positions$,
  ammPools$,
  allAmmPools$: ammPools$,
  possibleAmmPools$: of([]),
  getAddresses: getAddresses,
  getUsedAddresses: getUsedAddresses,
  getUnusedAddresses: getUnusedAddresses,
  getOperationByTxId: null as any,
  getOperations,
  isOperationsSyncing$: of(false),

  connectWallet: connectWallet,
  disconnectWallet: disconnectWallet,
  availableWallets: availableWallets,
  walletState$: walletState$,
  selectedWallet$: selectedWallet$,
  supportedFeatures$: supportedWalletFeatures$,
  networkContext$,
  defaultTokenAssets$,
  tokenAssetsToImport$,
  importedTokenAssets$: of([]),
  importTokenAsset,

  settings,
  settings$,
  setSettings,

  SwapInfoContent,
  SwapConfirmationInfo,
  DepositConfirmationInfo,
  RedeemConfirmationInfo,
  OperationsSettings,

  exploreTx,
  exploreAddress,
  exploreLastBlock,
  exploreToken,

  swap,
  deposit,
  redeem,
  refund(): Observable<TxId> {
    return of('');
  },
  convertToConvenientNetworkAsset,
  useSwapValidationFee,
  useDepositValidationFee,
  useRedeemValidationFee,
  useCreatePoolValidationFee,

  getPoolChartData: () => of([]),
  pendingOperations$: of([]),
  queuedOperation$: of(undefined),
};
