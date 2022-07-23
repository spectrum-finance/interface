import {
  mkTxAsm,
  mkTxCompletionPipeline,
  TxCandidate,
} from '@ergolabs/cardano-dex-sdk';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { filter, first, from, map, Observable, of, switchMap, zip } from 'rxjs';

import {
  TxSuccess,
  TxSuccessStatus,
} from '../../../../../common/services/submitTx';
import {
  cardanoNetwork,
  cardanoNetworkParams$,
} from '../../common/cardanoNetwork';
import { connectedWalletChange$ } from '../../wallet/connectedWalletChange';

export const submitTx = (txCandidate: TxCandidate): Observable<TxSuccess> =>
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
      ).pipe(
        switchMap((rawTx) => wallet.submit(rawTx)),
        map((txId) => ({
          txId,
          status: TxSuccessStatus.IN_PROGRESS,
        })),
      ),
    ),
  );
