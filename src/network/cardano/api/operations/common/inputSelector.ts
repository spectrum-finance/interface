import { FullTxIn, InputSelector } from '@spectrumlabs/cardano-dex-sdk';
import { Value } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/value';
import { CollateralSelector } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/wallet/collateralSelector';
import { catchError, filter, first, map, of, switchMap } from 'rxjs';

import { selectUtxos } from '../../wallet/common/BoxSelector';
import { selectedWallet$ } from '../../wallet/wallet';

export class DefaultInputSelector implements InputSelector {
  select(
    target: Value,
    excludedInputs: FullTxIn[] = [],
  ): Promise<FullTxIn[] | Error> {
    return selectedWallet$
      .pipe(
        first(),
        switchMap((wallet) => {
          if (wallet) {
            return wallet.getUtxos();
          }
          throw new Error('insufficient funds');
        }),
        map((utxos) =>
          target
            ? selectUtxos(
                utxos,
                target,
                excludedInputs.map((ei) => ei.txOut),
              )
            : utxos,
        ),
        map((utxos) => utxos.map((txOut) => ({ txOut }))),
      )
      .toPromise() as Promise<FullTxIn[] | Error>;
  }
}

export class DefaultCollateralSelector implements CollateralSelector {
  getCollateral(amount: bigint): Promise<FullTxIn[]> {
    return selectedWallet$
      .pipe(
        filter(Boolean),
        first(),
        switchMap((wallet) => wallet.getCollateral(amount)),
        map((utxos) => utxos.map((txOut) => ({ txOut }))),
        catchError(() => {
          return of([]);
        }),
      )
      .toPromise() as Promise<FullTxIn[]>;
  }
}
