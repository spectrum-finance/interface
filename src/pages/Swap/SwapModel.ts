import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { TokenAmountInputValue } from '../../components/common/TokenControl/TokenAmountInput/TokenAmountInput';
import { Currency } from '../../services/new/currency';
import { Pool } from '../../services/new/pools';

export interface SwapFormModel {
  readonly fromAmount?: Currency;
  readonly toAmount?: Currency;
  readonly fromAsset?: AssetInfo;
  readonly toAsset?: AssetInfo;
  readonly pool?: Pool;
}
