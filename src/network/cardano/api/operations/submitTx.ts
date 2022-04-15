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

import {
  cardanoNetwork,
  cardanoNetworkParams$,
} from '../common/cardanoNetwork';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const submitTx = (txCandidate: TxCandidate): Subscription =>
  zip([
    of(cardanoNetwork),
    cardanoNetworkParams$,
    connectedWalletChange$.pipe(filter(Boolean), first()),
  ])
    .pipe(
      tap((res) => console.log(res)),
      map(([cardanoNetwork, networkParams, wallet]) =>
        mkTxCompletionPipeline(
          mkTxAsm(networkParams, RustModule._wasm!),
          wallet,
          cardanoNetwork,
        ),
      ),
      switchMap((completionPipeline) =>
        from(completionPipeline.complete(txCandidate)),
      ),
    )
    .subscribe(console.log);
