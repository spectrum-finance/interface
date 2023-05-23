import { FC } from 'react';
import { Observable } from 'rxjs';

import { AmmPool } from '../../../../common/models/AmmPool';
import { TxId } from '../../../../common/types';
import { BaseRedeemConfirmationModal } from '../../../../components/BaseRedeemConfirmationModal/BaseRedeemConfirmationModal';
import { RemoveLiquidityFormModel } from '../../../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { walletRedeem } from '../../api/operations/redeem';
import { RedeemConfirmationInfo } from './RedeemConfirmationInfo/RedeemConfirmationInfo';

export interface RedeemConfirmationModalProps {
  readonly pool: AmmPool;
  readonly value: Required<RemoveLiquidityFormModel>;
  readonly onClose: (r: Observable<TxId>) => void;
}

export const RedeemConfirmationModal: FC<RedeemConfirmationModalProps> = ({
  pool,
  value,
  onClose,
}) => (
  <BaseRedeemConfirmationModal
    value={value}
    pool={pool}
    onClose={onClose}
    Info={RedeemConfirmationInfo as any}
    redeem={walletRedeem as any}
  />
);
