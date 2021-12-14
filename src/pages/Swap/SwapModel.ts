import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { TokenAmountInputValue } from '../../components/common/TokenControl/TokenAmountInput/TokenAmountInput';

export interface SwapFormModel {
  readonly fromAmount?: TokenAmountInputValue;
  readonly toAmount?: TokenAmountInputValue;
  readonly fromAsset?: AssetInfo;
  readonly toAsset?: AssetInfo;
  readonly pool?: AmmPool;
}
