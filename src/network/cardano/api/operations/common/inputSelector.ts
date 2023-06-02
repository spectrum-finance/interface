import { FullTxIn, InputSelector } from '@spectrumlabs/cardano-dex-sdk';
import { Value } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/value';
import { catchError, filter, first, map, of, switchMap } from 'rxjs';

import { selectUtxos } from '../../wallet/common/BoxSelector';
import { selectedWallet$ } from '../../wallet/wallet';

export class DefaultInputSelector implements InputSelector {
  select(target: Value): Promise<FullTxIn[] | Error> {
    return selectedWallet$
      .pipe(
        filter(Boolean),
        first(),
        switchMap((wallet) => wallet.getUtxos()),
        map((utxos) => (target ? selectUtxos(utxos, target) : utxos)),
        map((utxos) => utxos.map((txOut) => ({ txOut }))),
        catchError(() => {
          return of([]);
        }),
      )
      .toPromise() as Promise<FullTxIn[] | Error>;
  }
}
