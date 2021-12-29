import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { Currency } from '../../services/new/currency';
import { AmmPool } from '../../services/new/pools';

export interface SwapFormModel {
  readonly fromAmount?: Currency;
  readonly toAmount?: Currency;
  readonly fromAsset?: AssetInfo;
  readonly toAsset?: AssetInfo;
  readonly pool?: AmmPool;
}
