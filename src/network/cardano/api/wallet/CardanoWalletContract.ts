import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { Wallet } from '../../../common/Wallet';

export interface CardanoWalletContract extends Wallet {
  readonly connectWallet: () => Observable<boolean | ReactNode>;
}
