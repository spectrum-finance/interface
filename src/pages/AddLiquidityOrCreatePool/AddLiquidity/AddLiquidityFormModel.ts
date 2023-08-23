import { AmmPool } from '../../../common/models/AmmPool';
import { AssetInfo } from '../../../common/models/AssetInfo';
import { Currency } from '../../../common/models/Currency';

export interface AddLiquidityFormModel {
  readonly x?: Currency;
  readonly y?: Currency;
  readonly xAsset?: AssetInfo;
  readonly yAsset?: AssetInfo;
  readonly pool?: AmmPool;
}
