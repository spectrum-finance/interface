import { DateTime } from 'luxon';

import { AmmPool } from '../../../common/models/AmmPool';
import { AssetInfo } from '../../../common/models/AssetInfo';

export interface CreateFarmModel {
  pool?: AmmPool;
  period?: [DateTime | null, DateTime | null];
  distributionInterval?: any;
  budgetAsset?: AssetInfo;
  budgetAmount?: any;
}
