import { Observable, of } from 'rxjs';

import { TxId } from '../../../../../common/types';
import { ErgoFarm } from '../../models/ErgoFarm';

export const lmDepositWithWallet = (lmPool: ErgoFarm): Observable<TxId> => {
  return of('');
};

export const lmDeposit = (lmPool: ErgoFarm): Observable<TxId> => {
  return lmDepositWithWallet(lmPool);
};
