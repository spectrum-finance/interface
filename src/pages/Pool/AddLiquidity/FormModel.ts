import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';

export interface AddLiquidityFormModel {
  readonly x?: AssetInfo;
  readonly y?: AssetInfo;
  readonly xAmount?: Currency;
  readonly yAmount?: Currency;
  readonly pool?: AmmPool;
}
