import { Prover } from '@ergolabs/cardano-dex-sdk';
import { TxOut } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { Balance } from '../../../../../common/models/Balance';
import { Address } from '../../../../../common/types';
import { Wallet } from '../../../../common/Wallet';

export interface CardanoWalletContract extends Wallet, Prover {
  readonly connectWallet: () => Observable<boolean | ReactNode>;
  readonly getUsedAddresses: () => Observable<Address[]>;
  readonly getAddresses: () => Observable<Address[]>;
  readonly getUnusedAddresses: () => Observable<Address[]>;
  readonly getBalance: () => Observable<Balance>;
  readonly getUtxos: () => Observable<TxOut[]>;
}
