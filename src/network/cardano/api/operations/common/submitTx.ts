import {
  HexString,
  mkTxAsm,
  mkTxCompletionPipeline,
  TxCandidate,
} from '@ergolabs/cardano-dex-sdk';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import {
  filter,
  first,
  from,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
  zip,
} from 'rxjs';

import { TxId } from '../../../../../common/types';
import {
  cardanoNetwork,
  cardanoNetworkParams$,
} from '../../common/cardanoNetwork';
import { connectedWalletChange$ } from '../../wallet/connectedWalletChange';

export const submitTx = (txCandidate: TxCandidate): Observable<TxId> =>
  zip([
    of(cardanoNetwork),
    cardanoNetworkParams$,
    connectedWalletChange$.pipe(filter(Boolean), first()),
  ]).pipe(
    first(),
    tap((res) => console.log(res)),
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
