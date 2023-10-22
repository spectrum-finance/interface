import { Value } from '@teddyswap/cardano-dex-sdk';
import { TxOut } from '@teddyswap/cardano-dex-sdk/build/main/cardano/entities/txOut';
import {
  first,
  from,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { COLLATERAL_AMOUNT } from '../const.ts';
import { networkContext$ } from '../networkContext/networkContext';
import { AdditionalData } from '../wallet/common/AdditionalData';
import { Wallet } from '../wallet/common/Wallet';
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
    switchMap((selectedWallet: Wallet<AdditionalData> | undefined) =>
      selectedWallet ? selectedWallet.getCollateral(amount) : of([]),
    ),
  );

export const getIsCollateralProvided = (): Observable<boolean> =>
  connectedWalletChange$.pipe(
    first(),
    switchMap((selectedWallet: Wallet<AdditionalData> | undefined) =>
      selectedWallet
        ? from(selectedWallet.getCollateral(COLLATERAL_AMOUNT.amount)).pipe(
            switchMap((txOuts) => of(txOuts.length > 0)),
          )
        : of(false),
    ),
  );
