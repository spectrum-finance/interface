import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { Currency } from '../../../common/models/Currency';
import { Ratio } from '../../../common/models/Ratio';

export interface CreatePoolFormModel {
  readonly initialPrice?: Ratio;
  readonly x?: Currency;
  readonly y?: Currency;
  readonly xAsset: AssetInfo;
  readonly yAsset: AssetInfo;
  readonly fee?: number;
}
