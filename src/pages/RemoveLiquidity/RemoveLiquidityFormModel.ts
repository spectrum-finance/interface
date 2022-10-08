import { Currency } from '../../common/models/Currency';

export interface RemoveLiquidityFormModel {
  readonly percent: number;
  readonly xAmount?: Currency;
  readonly yAmount?: Currency;
  readonly lpAmount?: Currency;
}
