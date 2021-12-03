import { AmmPool, PoolId } from '@ergolabs/ergo-dex-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Observable } from 'rxjs';

import { getAssetsByPairAsset } from './ergo/ergo';

export enum WalletState {
  NOT_CONNECTED,
  CONNECTING,
  CONNECTED,
}

export interface Network {
  readonly nativeToken$: Observable<AssetInfo>;
  readonly nativeTokenBalance$: Observable<string>;
  readonly walletState$: Observable<WalletState>;
  readonly connectWallet: () => void;
  readonly getPoolById: (poolId: PoolId) => Observable<AmmPool | undefined>;
  readonly getPoolByPair: (xId: string, yId: string) => Observable<AmmPool[]>;
  readonly isWalletLoading$: Observable<boolean>;
  readonly isWalletSetuped$: Observable<boolean>;
  readonly availablePools$: Observable<AmmPool[]>;
  readonly pools$: Observable<AmmPool[]>;
  readonly name: string;
  readonly assets$: Observable<AssetInfo[]>;
  readonly getAssetById: (id: string) => Observable<AssetInfo>;
  readonly getAssetsByPairAsset: (
    pairAssetId: string,
  ) => Observable<AssetInfo[]>;
}
