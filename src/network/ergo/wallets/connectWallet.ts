import { Observable } from 'rxjs';

import { Wallet } from '../../common';

export const connectWallet = (wallet: Wallet): Observable<any> =>
  wallet.connectWallet();
