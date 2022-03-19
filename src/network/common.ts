import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { Address, ErgoBox } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { AmmPool } from '../common/models/AmmPool';
import { AssetLock } from '../common/models/AssetLock';
import { Balance } from '../common/models/Balance';
import { Currency } from '../common/models/Currency';
import { Position } from '../common/models/Position';
import { ArgsProps } from '../ergodex-cdk';

export interface Network {
  readonly networkAsset$: Observable<AssetInfo>;
  readonly networkAssetBalance$: Observable<Currency>;
  readonly assetBalance$: Observable<Balance>;
  readonly lpBalance$: Observable<Balance>;
  readonly addresses$: Observable<Address[]>;
  readonly locks$: Observable<AssetLock[]>;
  readonly ammPools$: Observable<AmmPool[]>;
  readonly positions$: Observable<Position[]>;
  readonly pendingTransactionsCount$: Observable<number>;
  readonly getTxHistory: (limit: number) => Observable<AmmDexOperation[]>;
  readonly wallets$: Observable<Wallet[]>;
  readonly selectedWallet$: Observable<Wallet | undefined>;
  readonly selectedWalletState$: Observable<WalletState>;
  readonly connectWallet: (w: Wallet) => Observable<any>;
  readonly disconnectWallet: () => void;
  readonly useNetworkAsset: () => [AssetInfo, boolean, Error];
}

export enum WalletState {
  NOT_CONNECTED,
  CONNECTING,
  CONNECTED,
}

export interface SupportedFeatures {
  createPool: boolean;
}

export interface Wallet {
  readonly name: string;
  readonly icon: ReactNode;
  readonly experimental: boolean;
  readonly extensionLink: string;
  readonly getAddresses: () => Observable<Address[]>;
  readonly connectWallet: () => Observable<boolean | ReactNode>;
  readonly getUtxos: () => Observable<ErgoBox[]>;
  readonly getNotification?: () => ArgsProps | undefined;
  readonly onDisconnect?: () => void;
  readonly supportedFeatures: SupportedFeatures;
}
