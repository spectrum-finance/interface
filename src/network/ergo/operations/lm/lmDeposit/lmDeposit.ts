import { Observable, of } from 'rxjs';

import { TxId } from '../../../../../common/types';
import { ErgoLmPool } from '../../../api/lmPools/ErgoLmPool';

export const lmDepositWithWallet = (lmPool: ErgoLmPool): Observable<TxId> => {
  return of('');
};

export const lmDeposit = (lmPool: ErgoLmPool): Observable<TxId> => {
  return lmDepositWithWallet(lmPool);
};
