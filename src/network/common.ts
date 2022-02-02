import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { Address } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Observable } from 'rxjs';

import { AmmPool } from '../common/models/AmmPool';
import { AssetLock } from '../common/models/AssetLock';
import { Balance } from '../common/models/Balance';
import { Currency } from '../common/models/Currency';
import { Position } from '../common/models/Position';

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

  readonly useNetworkAsset: () => [AssetInfo, boolean, Error];
}
