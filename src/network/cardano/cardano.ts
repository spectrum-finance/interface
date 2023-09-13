import { map, Observable, of } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { TxId } from '../../common/types';
import { Network, SupportedNetworks } from '../common/Network';
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
import { networkAsset, useNetworkAsset } from './api/networkAsset/networkAsset';
import { networkContext$ } from './api/networkContext/networkContext';
import {
  deposit,
  useDepositValidators,
  useHandleDepositMaxButtonClick,
} from './api/operations/deposit';
import { redeem } from './api/operations/redeem';
import { refund } from './api/operations/refund';
import {
  swap,
  useHandleSwapMaxButtonClick,
  useSwapValidators,
} from './api/operations/swap';
import { platformStats$ } from './api/platformStats/platformStats';
import { getPoolChartData } from './api/poolChart/poolChart';
import { positions$ } from './api/positions/positions';
import {
  defaultTokenAssets$,
  getDefaultAssetsFor,
  importTokenAsset,
  tokenAssetsToImport$,
} from './api/tokens/tokens';
import {
  getOperationByTxId,
  getOperations,
  hasNeedRefundOperations$,
  pendingOperationsCount$,
} from './api/transactionHistory/operationsHistory';
import { AdditionalData } from './api/wallet/common/AdditionalData';
import { Wallet } from './api/wallet/common/Wallet';
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
  exploreAddress,
  exploreLastBlock,
  exploreToken,
  exploreTx,
} from './utils/utils';
import { OperationsSettings } from './widgets/OperationSettings/OperationsSettings';
import { SwapCollapse } from './widgets/SwapCollapse/SwapCollapse.tsx';

const makeCardanoNetwork = (
  name: SupportedNetworks,
  label: string,
): Network<Wallet<AdditionalData>, CardanoSettings, CardanoAmmPool> => {
  return {
    name,
    label,
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
    displayedAmmPools$: ammPools$.pipe(
      map((aps) =>
        aps.filter((ap) => !applicationConfig.deprecatedPools.includes(ap.id)),
      ),
    ),
    ammPools$,
    getAddresses: getAddresses,
    getUsedAddresses: getUsedAddresses,
    getUnusedAddresses: getUnusedAddresses,

    platformStats$,
    connectWallet: connectWallet,
    disconnectWallet: disconnectWallet,
    availableWallets: availableWallets,
    walletState$: walletState$,
    selectedWallet$: selectedWallet$,
    supportedFeatures$: supportedWalletFeatures$,
    networkContext$,
    defaultAssets$: defaultTokenAssets$,
    assetsToImport$: tokenAssetsToImport$,
    // TODO: Implement assets fns
    getDefaultAssetsFor,
    getImportedAssetsFor: () => of([]),
    getAssetsToImportFor: () => of([]),
    importedAssets$: of([]),
    importTokenAsset,

    settings,
    settings$,
    setSettings,

    SwapCollapse,
    OperationsSettings,

    exploreTx,
    exploreAddress,
    exploreLastBlock,
    exploreToken,
    swap,
    deposit,
    redeem,
    refund,
    lmRedeem(): Observable<TxId> {
      return of('');
    },
    lmDeposit(): Observable<TxId> {
      return of('');
    },

    convertToConvenientNetworkAsset,

    useSwapValidators,
    useHandleSwapMaxButtonClick,
    useDepositValidators,
    useHandleDepositMaxButtonClick,
    useCreatePoolValidationFee: (() => {}) as any,
    useNetworkAsset,

    getPoolChartData: getPoolChartData as any,

    getOperations,
    getOperationByTxId,
    pendingOperationsCount$,
    queuedOperation$: of(undefined),
    hasNeedRefundOperations$,
  };
};

export const cardanoPreview = makeCardanoNetwork(
  'cardano_preview',
  'Cardano (Preview)',
);

export const cardanoMainnet = makeCardanoNetwork('cardano', 'Cardano');
