import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { AssetLock } from '../../common/models/AssetLock';
import { Balance } from '../../common/models/Balance';
import { Currency } from '../../common/models/Currency';
import { Position } from '../../common/models/Position';
import { Address, Nitro, Percent, TxId } from '../../common/types';
import { NetworkContext } from './NetworkContext';
import { SupportedFeatures } from './SupportedFeatures';
import { TxHistoryManager } from './TxHistoryManager';
import { Wallet, WalletState } from './Wallet';

export interface NetworkData<W extends Wallet> {
  readonly networkAssetBalance$: Observable<Currency>;
  readonly assetBalance$: Observable<Balance>;
  readonly lpBalance$: Observable<Balance>;
  readonly locks$: Observable<AssetLock[]>;
  readonly ammPools$: Observable<AmmPool[]>;
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
}

interface BaseNetworkConfig {
  readonly address: Address;
  readonly slippage: Percent;
  readonly nitro: Nitro;
}

export interface NetworkSettings<T extends BaseNetworkConfig> {
  settings$: Observable<T>;
  setSettings: (value: T) => void;
}

export interface NetworkOperations {
  swap(pool: AmmPool, from: Currency, to: Currency): Observable<TxId>;
}

export interface Network<W extends Wallet>
  extends NetworkData<W>,
    NetworkOperations {
  readonly name: string;
  readonly networkAsset: AssetInfo;
}
