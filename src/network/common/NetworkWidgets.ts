import { FC } from 'react';

import { AmmPool } from '../../common/models/AmmPool';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';

export interface NetworkWidgets<P extends AmmPool = AmmPool> {
  GlobalSettingsModal?: FC<{ onClose: () => void }>;
  SwapInfoContent: FC<{ value: SwapFormModel<P> }>;
  OperationsSettings: FC;
  DepositConfirmationInfo: FC;
  RedeemConfirmationInfo: FC;
  RefundConfirmationInfo?: FC;
}
