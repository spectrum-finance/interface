import { FC } from 'react';

import { AmmPool } from '../../common/models/AmmPool';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';

export interface NetworkWidgets<P extends AmmPool = AmmPool> {
  SwapInfoContent: FC<{ value: SwapFormModel<P> }>;
  OperationsSettings: FC;
  RefundConfirmationInfo?: FC;
}
