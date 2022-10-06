import { FC } from 'react';
import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { TxId } from '../../common/types';
import { Operation } from '../../components/ConfirmationModal/ConfirmationModal';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';

export interface NetworkWidgets<P extends AmmPool = AmmPool> {
  GlobalSettingsModal?: FC<{ onClose: () => void }>;
  SwapInfoContent: FC<{ value: SwapFormModel<P> }>;
  swapConfirmationModal$: Observable<
    FC<{
      value: Required<SwapFormModel>;
      onClose: (p: Observable<TxId>) => void;
    }> & { operation: Operation }
  >;
  OperationsSettings: FC;
  DepositConfirmationInfo: FC;
  RedeemConfirmationInfo: FC;
  RefundConfirmationInfo?: FC;
}
