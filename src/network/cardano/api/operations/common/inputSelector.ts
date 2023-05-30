import { FullTxIn, InputSelector } from '@spectrumlabs/cardano-dex-sdk';
import { Value } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/value';
import { filter, first, map, switchMap } from 'rxjs';

import { selectedWallet$ } from '../../wallet/wallet';

export class DefaultInputSelector implements InputSelector {
  select(target: Value): Promise<FullTxIn[] | Error> {
    return selectedWallet$
      .pipe(
        filter(Boolean),
        first(),
        switchMap((wallet) => wallet.getUtxos(target)),
        map((utxos) => utxos.map((txOut) => ({ txOut }))),
      )
      .toPromise() as Promise<FullTxIn[] | Error>;
  }
}
