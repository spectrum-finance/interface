import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { Currency } from '../../../services/new/currency';
import { AmmPool } from '../../../services/new/pools';

export interface AddLiquidityFormModel {
  readonly x?: AssetInfo;
  readonly y?: AssetInfo;
  readonly xAmount?: Currency;
  readonly yAmount?: Currency;
  readonly pool?: AmmPool;
}
