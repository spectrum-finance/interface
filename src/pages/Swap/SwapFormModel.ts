import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { Currency } from '../../common/models/Currency';

export interface SwapFormModel {
  readonly fromAmount?: Currency;
  readonly toAmount?: Currency;
  readonly fromAsset?: AssetInfo;
  readonly toAsset?: AssetInfo;
  readonly pool?: AmmPool;
}
