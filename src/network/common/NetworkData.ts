import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { AssetLock } from '../../common/models/AssetLock';
import { Balance } from '../../common/models/Balance';
import { Currency } from '../../common/models/Currency';
import { PoolChartData } from '../../common/models/PoolChartData';
import { Position } from '../../common/models/Position';
import { Address } from '../../common/types';
import { NetworkContext } from './NetworkContext';
import { PoolChartDataParams } from './PoolChartDataParams';
import { SupportedFeatures } from './SupportedFeatures';
import { TxHistoryManager } from './TxHistoryManager';
import { Wallet, WalletState } from './Wallet';

export interface NetworkData<W extends Wallet> {
  readonly convertToConvenientNetworkAsset: (
    from: Currency | Currency[],
  ) => Observable<Currency>;
  readonly networkAssetBalance$: Observable<Currency>;
  readonly assetBalance$: Observable<Balance>;
  readonly lpBalance$: Observable<Balance>;
  readonly locks$: Observable<AssetLock[]>;
  readonly ammPools$: Observable<AmmPool[]>;
  readonly possibleAmmPools$: Observable<AmmPool[]>;
  readonly availableTokenAssets$: Observable<AssetInfo[]>;
  readonly tokenAssetsToImport$: Observable<AssetInfo[]>;
  readonly importTokenAsset: (assetInfo: AssetInfo | AssetInfo[]) => void;
  readonly positions$: Observable<Position[]>;
  readonly txHistoryManager: TxHistoryManager;
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

  readonly useSwapValidationFee: () => Currency;
  readonly useDepositValidationFee: () => Currency;
  readonly useRedeemValidationFee: () => Currency;

  readonly getPoolChartData: (
    pool: AmmPool,
    params?: PoolChartDataParams,
  ) => Observable<PoolChartData[]>;
}
