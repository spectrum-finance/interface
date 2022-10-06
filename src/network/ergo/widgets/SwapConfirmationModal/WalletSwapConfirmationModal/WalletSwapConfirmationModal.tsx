import React, { FC } from 'react';
import { Observable } from 'rxjs';

import { TxId } from '../../../../../common/types';
import { BaseSwapConfirmationModal } from '../../../../../components/BaseSwapConfirmationModal/BaseSwapConfirmationModal';
import { Operation } from '../../../../../components/ConfirmationModal/ConfirmationModal';
import { SwapFormModel } from '../../../../../pages/Swap/SwapFormModel';
import { swap } from '../../../operations/swap';
import { SwapConfirmationInfo } from '../common/SwapConfirmationInfo/SwapConfirmationInfo';

export interface SwapConfirmationModal {
  readonly value: Required<SwapFormModel>;
  readonly onClose: (p: Observable<TxId>) => void;
}

export const WalletSwapConfirmationModal: FC<SwapConfirmationModal> & {
  operation: Operation;
} = ({ value, onClose }) => (
  <BaseSwapConfirmationModal
    value={value}
    onClose={onClose}
    Info={SwapConfirmationInfo}
    swap={swap}
  />
);
WalletSwapConfirmationModal.operation = Operation.SWAP;
