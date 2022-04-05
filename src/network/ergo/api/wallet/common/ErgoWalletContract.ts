import { Address, ErgoBox } from '@ergolabs/ergo-sdk';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { Wallet } from '../../../../common/Wallet';

export interface ErgoWalletContract extends Wallet {
  readonly getUsedAddresses: () => Observable<Address[]>;
  readonly getUnusedAddresses: () => Observable<Address[]>;
  readonly getAddresses: () => Observable<Address[]>;
  readonly connectWallet: () => Observable<boolean | ReactNode>;
  readonly getUtxos: () => Observable<ErgoBox[]>;
}
