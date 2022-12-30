import { Modal } from '@ergolabs/ui-kit';
import React from 'react';
import { Observable, of } from 'rxjs';

import { TxId } from '../../../../../common/types';
import { FarmWithdrawalModal } from '../../../../../pages/Farms/FarmActionModals/FarmWithdrawalModal/FarmWithdrawalModal';
import { ErgoFarm } from '../../models/ErgoFarm';
import { walletLmRedeem } from './walletLmRedeem';

const lmRedeemWithWallet = (lmPool: ErgoFarm): Observable<TxId> => {
  Modal.open(
    <FarmWithdrawalModal
      ergoLmPool={lmPool}
      redeem={walletLmRedeem}
      onClose={(res) => res.subscribe(console.log)}
    />,
  );

  return of('');
};

export const lmRedeem = (lmPool: ErgoFarm): Observable<TxId> => {
  return lmRedeemWithWallet(lmPool);
};
