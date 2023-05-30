import { Value } from '@spectrumlabs/cardano-dex-sdk';
import { TxOut } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import {
  first,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { networkContext$ } from '../networkContext/networkContext';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const utxos$ = connectedWalletChange$.pipe(
  switchMap((selectedWallet) => networkContext$.pipe(mapTo(selectedWallet))),
  switchMap((selectedWallet) =>
    selectedWallet ? selectedWallet.getUtxos() : of([]),
  ),
  publishReplay(1),
  refCount(),
);

export const getUtxosByAmount = (amount: Value): Observable<TxOut[]> =>
  connectedWalletChange$.pipe(
    first(),
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getUtxos(amount) : of([]),
    ),
  );

export const getCollateralByAmount = (amount: bigint): Observable<TxOut[]> =>
  connectedWalletChange$.pipe(
    first(),
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getCollateral(amount) : of([]),
    ),
  );
