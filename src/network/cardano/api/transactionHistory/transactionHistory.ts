import {
  extractPaymentCred,
  mkHistory,
  ScriptCredsV1,
} from '@ergolabs/cardano-dex-sdk';
import { mkOrdersParser } from '@ergolabs/cardano-dex-sdk/build/main/amm/parsers/ordersParser';
import { History } from '@ergolabs/cardano-dex-sdk/build/main/amm/services/history';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import uniqBy from 'lodash/uniqBy';
import {
  combineLatest,
  defaultIfEmpty,
  first,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Operation } from '../../../../common/models/Operation';
import { getAddresses } from '../addresses/addresses';
import { cardanoNetwork } from '../common/cardanoNetwork';
import { cardanoWasm$ } from '../common/cardanoWasm';
import { mapToOperationOrEmpty } from './common';

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

export const getOperations = (): Observable<Operation[]> =>
  getAddresses().pipe(
    first(),
    switchMap((addresses) =>
      historyRepository$.pipe(
        switchMap((hr) =>
          from(
            hr.getAllByPCreds(
              addresses.map((a) =>
                extractPaymentCred(a, RustModule.CardanoWasm),
              ),
              1000,
            ),
          ).pipe(
            map((ammDexOperations) => uniqBy(ammDexOperations, 'txHash')),
            switchMap((ammDexOperations) =>
              combineLatest(ammDexOperations.map(mapToOperationOrEmpty)).pipe(
                defaultIfEmpty([]),
              ),
            ),
            map((operations) => operations.filter(Boolean) as Operation[]),
          ),
        ),
      ),
    ),
    publishReplay(1),
    refCount(),
  );
