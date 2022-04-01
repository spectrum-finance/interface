import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';

export interface SwapFormModel {
  readonly fromAmount?: Currency;
  readonly toAmount?: Currency;
  readonly fromAsset?: AssetInfo;
  readonly toAsset?: AssetInfo;
  readonly pool?: AmmPool;
}
