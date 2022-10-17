import React, { FC } from 'react';
import { Observable } from 'rxjs';

import { TxId } from '../../../../common/types';
import { BaseSwapConfirmationModal } from '../../../../components/BaseSwapConfirmationModal/BaseSwapConfirmationModal';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { walletSwap } from '../../api/operations/swap';
import { SwapConfirmationInfo } from './SwapConfirmationInfo/SwapConfirmationInfo';

export interface SwapConfirmationModal {
  readonly value: Required<SwapFormModel>;
  readonly onClose: (p: Observable<TxId>) => void;
}

export const SwapConfirmationModal: FC<SwapConfirmationModal> = ({
  value,
  onClose,
}) => (
  <BaseSwapConfirmationModal
    value={value}
    onClose={onClose}
    Info={SwapConfirmationInfo as any}
    swap={walletSwap}
  />
);
