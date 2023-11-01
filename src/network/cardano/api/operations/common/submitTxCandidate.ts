import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import {
  mkTxAsm,
  mkTxCompletionPipeline,
  TxCandidate,
} from '@teddyswap/cardano-dex-sdk';
import { RustModule } from '@teddyswap/cardano-dex-sdk/build/main/utils/rustLoader';
import { filter, first, from, Observable, of, switchMap, zip } from 'rxjs';

import { TxId } from '../../../../../common/types';
import { cardanoNetworkData } from '../../../utils/cardanoNetworkData';
import {
  cardanoNetwork,
  cardanoNetworkParams$,
} from '../../common/cardanoNetwork';
import { connectedWalletChange$ } from '../../wallet/connectedWalletChange';

export const submitTxCandidate = (txCandidate: TxCandidate): Observable<TxId> =>
  zip([
    of(cardanoNetwork),
    cardanoNetworkParams$,
    connectedWalletChange$.pipe(filter(Boolean), first()),
  ]).pipe(
    first(),
    switchMap(([cardanoNetwork, networkParams, wallet]) =>
      from(
        mkTxCompletionPipeline(
          mkTxAsm(networkParams, RustModule.CardanoWasm),
          wallet,
          cardanoNetwork,
          RustModule.CardanoWasm,
        ).complete(txCandidate),
      ).pipe(switchMap((rawTx) => wallet.submit(rawTx))),
    ),
  );

export const submitTx = (
  transaction: Transaction,
  partial?: boolean,
): Observable<TxId> =>
  zip([
    of(cardanoNetwork),
    cardanoNetworkParams$,
    connectedWalletChange$.pipe(filter(Boolean), first()),
  ]).pipe(
    first(),
    switchMap(([cardanoNetwork, networkParams, wallet]) =>
      from(
        mkTxCompletionPipeline(
          mkTxAsm(networkParams, RustModule.CardanoWasm),
          wallet,
          cardanoNetwork,
          RustModule.CardanoWasm,
        ).completeTransaction(transaction, partial),
      ).pipe(
        switchMap((rawTx) => {
          // Making a POST request to the external service
          if (cardanoNetworkData.submitTxUrl !== undefined) {
            fetch(cardanoNetworkData.submitTxUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/cbor',
              },
              body: RustModule.CardanoWasm.Transaction.from_hex(
                rawTx,
              ).to_bytes(), // assuming rawTx is in the correct format for the body
            });
          }

          const walletSubmission = wallet.submit(rawTx);

          return walletSubmission;
        }),
      ),
    ),
  );
