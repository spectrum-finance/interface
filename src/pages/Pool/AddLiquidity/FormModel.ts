import { AmmPool } from '@ergolabs/ergo-dex-sdk';

import { TokenAmountInputValue } from '../../../components/common/TokenControl/TokenAmountInput/TokenAmountInput';
import { TokenControlValue } from '../../../components/common/TokenControl/TokenControl';

export interface AddLiquidityFormModel {
  readonly x?: TokenControlValue['asset'];
  readonly y?: TokenControlValue['asset'];
  readonly xAmount?: TokenAmountInputValue;
  readonly yAmount?: TokenAmountInputValue;
  readonly activePool?: AmmPool;
}
