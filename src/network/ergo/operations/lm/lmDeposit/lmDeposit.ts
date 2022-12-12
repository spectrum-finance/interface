import { Observable } from 'rxjs';

import { TxId } from '../../../../../common/types';
import { ErgoLmPool } from '../../../api/lmPools/ErgoLmPool';

export const lmDepositWithWallet = (lmPool: ErgoLmPool): Observable<TxId> => {};

export const lmDeposit = (lmPool: ErgoLmPool): Observable<TxId> => {
  return lmDepositWithWallet(lmPool);
};
