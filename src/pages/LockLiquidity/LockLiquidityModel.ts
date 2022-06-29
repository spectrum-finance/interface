import { DateTime } from 'luxon';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';

export interface LockLiquidityModel {
  xAmount?: Currency;
  yAmount?: Currency;
  lpAmount?: Currency;
  locktime?: DateTime;
  percent: number;
  pool?: AmmPool;
}
