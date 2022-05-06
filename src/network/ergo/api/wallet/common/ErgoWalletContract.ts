import { Address, ErgoBox, ErgoTx, Prover } from '@ergolabs/ergo-sdk';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { TxId } from '../../../../../common/types';
import { Wallet } from '../../../../common/Wallet';

export interface ErgoWalletContract extends Wallet, Prover {
  readonly getUsedAddresses: () => Observable<Address[]>;
  readonly getUnusedAddresses: () => Observable<Address[]>;
  readonly getAddresses: () => Observable<Address[]>;
  readonly connectWallet: () => Observable<boolean | ReactNode>;
  readonly getUtxos: () => Observable<ErgoBox[]>;
  readonly submitTx: (tx: ErgoTx) => Observable<TxId>;
}
