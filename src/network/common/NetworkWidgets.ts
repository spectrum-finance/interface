import { FC } from 'react';

import { AmmPool } from '../../common/models/AmmPool';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';

export interface NetworkWidgets<P extends AmmPool = AmmPool> {
  SwapCollapse: FC<{ value: SwapFormModel<P> }>;
  OperationsSettings: FC<{ hideNitro?: boolean; hideSlippage?: boolean }>;
  RefundConfirmationInfo?: FC;
}
