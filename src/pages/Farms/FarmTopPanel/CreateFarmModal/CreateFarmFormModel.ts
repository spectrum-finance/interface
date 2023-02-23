import { AmmPool } from '../../../../common/models/AmmPool';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { IntervalType } from './FarmDistributionIntervalInput/FarmDistributionIntervalInput';

export interface CreateFarmFormModel {
  pool?: AmmPool;
  period?: [number | undefined, number | undefined];
  distributionInterval?: { type: IntervalType; value: number };
  budgetAsset?: AssetInfo;
  budgetAmount?: any;
}
