import {
  extractPaymentCred,
  mkHistory,
  ScriptCredsV1,
} from '@ergolabs/cardano-dex-sdk';
import { mkOrdersParser } from '@ergolabs/cardano-dex-sdk/build/main/amm/parsers/ordersParser';
import { History } from '@ergolabs/cardano-dex-sdk/build/main/amm/services/history';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import {
  combineLatest,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { getAddresses } from '../addresses/addresses';
import { cardanoNetwork } from '../common/cardanoNetwork';
import { cardanoWasm$ } from '../common/cardanoWasm';
import { mapToOperation } from './common';

const historyRepository$: Observable<History> = cardanoWasm$.pipe(
  map((cardanoWasm) =>
    mkHistory(
      mkOrdersParser(ScriptCredsV1, cardanoWasm),
      cardanoNetwork,
      cardanoWasm,
    ),
  ),
  publishReplay(1),
  refCount(),
);

export const txHistory$ = getAddresses().pipe(
  switchMap((addresses) =>
    historyRepository$.pipe(
      switchMap((hr) =>
        from(
          hr.getAllByPCreds(
            addresses.map((a) => extractPaymentCred(a, RustModule.CardanoWasm)),
            1000,
          ),
        ).pipe(
          tap((res) => console.log(res)),
          switchMap((ammDexOperations) =>
            combineLatest(ammDexOperations.map(mapToOperation)),
          ),
          map((operations) => operations.filter(Boolean)),
          tap(console.log),
        ),
      ),
    ),
  ),
  publishReplay(1),
  refCount(),
);
