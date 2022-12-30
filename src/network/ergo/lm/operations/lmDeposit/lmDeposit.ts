import { Modal } from '@ergolabs/ui-kit';
import { ReactNode } from 'react';
import { Observable, of } from 'rxjs';

import { Farm } from '../../../../../common/models/Farm';
import { TxId } from '../../../../../common/types';
import { ErgoFarm } from '../../models/ErgoFarm';

export const lmDepositWithWallet = (lmPool: ErgoFarm): Observable<TxId> => {
  return of('');
};

export const lmDeposit = (
  farm: ErgoFarm,
  createFarmModal: (
    children?: ReactNode | ReactNode[] | string,
  ) => ReactNode | ReactNode[] | string,
): Observable<TxId> => {
  Modal.open(createFarmModal());

  return lmDepositWithWallet(farm);
};
