import {
  extractPaymentCred,
  mkHistory,
  ScriptCredsV1,
} from '@ergolabs/cardano-dex-sdk';
import { mkOrdersParser } from '@ergolabs/cardano-dex-sdk/build/main/amm/parsers/ordersParser';
import { History } from '@ergolabs/cardano-dex-sdk/build/main/amm/services/history';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import {
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { getAddresses } from '../addresses/addresses';
import { cardanoNetwork } from '../common/cardanoNetwork';
import { cardanoWasm$ } from '../common/cardanoWasm';

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

export const txHistory = getAddresses().pipe(
  switchMap((addresses) =>
    historyRepository$.pipe(
      switchMap((hr) =>
        from(
          hr.getAllByPCreds(
            addresses.map((a) => extractPaymentCred(a, RustModule.CardanoWasm)),
            20,
          ),
        ),
      ),
    ),
  ),
  publishReplay(1),
  refCount(),
);
