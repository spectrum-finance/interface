import { Address, ErgoBox, ErgoTx, Prover } from '@ergolabs/ergo-sdk';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { AssetInfo } from '../../../../../common/models/AssetInfo';
import { TxId } from '../../../../../common/types';
import { Wallet } from '../../../../common/Wallet';

export interface ErgoWalletContract extends Wallet, Prover {
  readonly getUsedAddresses: () => Observable<Address[]>;
  readonly getUnusedAddresses: () => Observable<Address[]>;
  readonly getChangeAddress: () => Observable<Address>;
  readonly getAddresses: () => Observable<Address[]>;
  readonly getBalance: () => Observable<[bigint, AssetInfo]>;
  readonly connectWallet: () => Observable<boolean | ReactNode>;
  readonly getUtxos: () => Observable<ErgoBox[]>;
  readonly submitTx: (tx: ErgoTx) => Observable<TxId>;
}
