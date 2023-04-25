import { FC } from 'react';
import { Observable } from 'rxjs';

import { TxId } from '../../../../common/types';
import { BaseAddLiquidityConfirmationModal } from '../../../../components/BaseAddLiquidityConfirmationModal/BaseAddLiquidityConfirmationModal';
import { AddLiquidityFormModel } from '../../../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { walletDeposit } from '../../operations/deposit/walletDeposit';
import { DepositConfirmationInfo } from './DepositConfirmationInfo/DepositConfirmationInfo';

export interface DepositConfirmationModalProps {
  readonly value: Required<AddLiquidityFormModel>;
  readonly onClose: (p: Observable<TxId>) => void;
}

export const DepositConfirmationModal: FC<DepositConfirmationModalProps> = ({
  value,
  onClose,
}) => (
  <BaseAddLiquidityConfirmationModal
    value={value}
    onClose={onClose}
    deposit={walletDeposit as any}
    Info={DepositConfirmationInfo}
  />
);
