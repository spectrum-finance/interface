import {
  ErgoTx,
  Input as TxInput,
  Prover,
  UnsignedErgoTx,
} from '@ergolabs/ergo-sdk';
import { filter, first, switchMap } from 'rxjs';

import { selectedWallet$ } from '../../api/wallet/wallet';

const sign = (tx: UnsignedErgoTx): Promise<ErgoTx> =>
  selectedWallet$
    .pipe(
      filter(Boolean),
      first(),
      switchMap((w) => w.sign(tx)),
    )
    .toPromise() as Promise<ErgoTx>;

const signInput = (tx: UnsignedErgoTx, input: number): Promise<TxInput> =>
  selectedWallet$
    .pipe(
      filter(Boolean),
      first(),
      switchMap((w) => w.signInput(tx, input)),
    )
    .toPromise() as Promise<TxInput>;

export const proverMediator: Prover = {
  sign,
  signInput,
};
