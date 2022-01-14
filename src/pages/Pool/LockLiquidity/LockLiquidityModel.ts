import { AssetInfo } from '@ergolabs/ergo-sdk';

import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';

export interface LockLiquidityModel {
  xAmount?: Currency;
  yAmount?: Currency;
  lpAmount?: Currency;
  locktime?: number;
  pool?: AmmPool;
}
