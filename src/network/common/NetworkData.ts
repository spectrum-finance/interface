import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { AssetLock } from '../../common/models/AssetLock';
import { Balance } from '../../common/models/Balance';
import { Currency } from '../../common/models/Currency';
import { Farm } from '../../common/models/Farm';
import { Operation } from '../../common/models/Operation';
import { PoolChartData } from '../../common/models/PoolChartData';
import { Position } from '../../common/models/Position';
import { CurrencyConverter } from '../../common/services/CurrencyConverter';
import { Address } from '../../common/types';
import { OperationValidator } from '../../components/OperationForm/OperationForm';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { NetworkContext } from './NetworkContext';
import { PlatformStats } from './PlatformStats';
import { PoolChartDataParams } from './PoolChartDataParams';
import { SupportedFeatures } from './SupportedFeatures';
import { Wallet, WalletState } from './Wallet';

export interface NetworkData<W extends Wallet> {
  readonly platformStats$: Observable<PlatformStats>;
  readonly convertToConvenientNetworkAsset: CurrencyConverter;
  readonly networkAssetBalance$: Observable<Currency>;
  readonly assetBalance$: Observable<Balance>;
  readonly lpBalance$: Observable<Balance>;
  readonly locks$: Observable<AssetLock[]>;
  readonly ammPools$: Observable<AmmPool[]>;
  readonly farmPools$?: Observable<Farm[]>;
  readonly displayedAmmPools$: Observable<AmmPool[]>;
  readonly defaultAssets$: Observable<AssetInfo[]>;
  readonly getDefaultAssetsFor: (assetId: string) => Observable<AssetInfo[]>;
  readonly importedAssets$: Observable<AssetInfo[]>;
  readonly getImportedAssetsFor: (assetId: string) => Observable<AssetInfo[]>;
  readonly assetsToImport$: Observable<AssetInfo[]>;
  readonly getAssetsToImportFor: (assetId: string) => Observable<AssetInfo[]>;
  readonly importTokenAsset: (assetInfo: AssetInfo | AssetInfo[]) => void;
  readonly positions$: Observable<Position[]>;
  readonly getUsedAddresses: () => Observable<Address[] | undefined>;
  readonly getUnusedAddresses: () => Observable<Address[] | undefined>;
  readonly getAddresses: () => Observable<Address[] | undefined>;
  readonly connectWallet: (w: W) => Observable<boolean | ReactNode>;
  readonly disconnectWallet: () => void;
  readonly availableWallets: W[];
  readonly walletState$: Observable<WalletState>;
  readonly selectedWallet$: Observable<W | undefined>;
  readonly supportedFeatures$: Observable<SupportedFeatures>;
  readonly networkContext$: Observable<NetworkContext>;

  readonly useHandleSwapMaxButtonClick: () => (balance: Currency) => Currency;
  readonly useSwapValidators: () => OperationValidator<SwapFormModel>[];

  readonly useHandleDepositMaxButtonClick: () => (
    pct: number,
    form: AddLiquidityFormModel,
    balance: Balance,
  ) => [Currency, Currency];
  readonly useDepositValidators: () => OperationValidator<AddLiquidityFormModel>[];
  readonly useCreatePoolValidationFee: () => Currency;
  readonly useNetworkAsset: () => [AssetInfo, boolean, Error | undefined];

  readonly refundableDeposit: Currency;

  readonly getOperationByTxId: (
    txId: string,
  ) => Observable<Operation | undefined>;
  readonly getOperations: () => Observable<Operation[]>;
  readonly syncOperations?: () => void;
  readonly isOperationsSyncing$: Observable<boolean>;

  readonly pendingOperations$: Observable<Operation[]>;
  readonly queuedOperation$: Observable<Operation | undefined>;

  readonly getPoolChartData: (
    pool: AmmPool,
    params?: PoolChartDataParams,
  ) => Observable<PoolChartData[]>;
}
