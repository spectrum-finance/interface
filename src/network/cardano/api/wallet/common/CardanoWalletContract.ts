import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { Balance } from '../../../../../common/models/Balance';
import { Address } from '../../../../../common/types';
import { Wallet } from '../../../../common/Wallet';

export interface CardanoWalletContract extends Wallet {
  readonly connectWallet: () => Observable<boolean | ReactNode>;
  readonly getUsedAddresses: () => Observable<Address[]>;
  readonly getAddresses: () => Observable<Address[]>;
  readonly getBalance: () => Observable<Balance>;
  readonly getUnusedAddresses: () => Observable<Address[]>;
  readonly getCtx: () => Observable<any>;
}
