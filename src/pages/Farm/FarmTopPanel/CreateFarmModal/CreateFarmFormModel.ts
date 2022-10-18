import { AmmPool } from '../../../../common/models/AmmPool';
import { AssetInfo } from '../../../../common/models/AssetInfo';

export interface CreateFarmFormModel {
  pool?: AmmPool;
  period?: [number | undefined, number | undefined];
  distributionInterval?: number;
  budgetAsset?: AssetInfo;
  budgetAmount?: any;
}
