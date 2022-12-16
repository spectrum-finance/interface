import { Modal } from '@ergolabs/ui-kit';
import React from 'react';
import { Observable, of } from 'rxjs';

import { TxId } from '../../../../../common/types';
import { FarmWithdrawalModal } from '../../../../../pages/Farm/FarmActionModals/FarmWithdrawalModal/FarmWithdrawalModal';
import { ErgoLmPool } from '../../../api/lmPools/ErgoLmPool';
import { walletLmRedeem } from './walletLmRedeem';

const lmRedeemWithWallet = (lmPool: ErgoLmPool): Observable<TxId> => {
  Modal.open(
    <FarmWithdrawalModal
      ergoLmPool={lmPool}
      redeem={walletLmRedeem}
      onClose={(res) => res.subscribe(console.log)}
    />,
  );

  return of('');
};

export const lmRedeem = (lmPool: ErgoLmPool): Observable<TxId> => {
  return lmRedeemWithWallet(lmPool);
};
