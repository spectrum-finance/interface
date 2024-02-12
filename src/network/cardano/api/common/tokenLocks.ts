import { extractPaymentCred } from '@spectrumlabs/cardano-dex-sdk';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';
import {
  first,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { PoolId } from '../../../../common/types.ts';
import { getAddresses } from '../addresses/addresses.ts';

export interface CardanoTokenLock {
  readonly entityId: string;
  readonly poolId: PoolId;
  readonly deadline: number;
  readonly amount: string;
  readonly redeemer: string;
}

export const getTokenLocksByPoolId = (
  poolId: PoolId,
): Observable<CardanoTokenLock[]> =>
  getAddresses().pipe(
    first(),
    map((addresses) =>
      addresses.map((addr) => extractPaymentCred(addr, RustModule.CardanoWasm)),
    ),
    switchMap((creds) => {
      return axios
        .get<CardanoTokenLock[]>(
          `http://195.201.9.29:8091/v1/pools/locks?poolId=${poolId}`,
        )
        .then((res) => res.data)
        .then((data) => data.filter((i) => creds.includes(i.redeemer) && i.deadline > 1707733079010))
        .catch(() => []);
    }),
    publishReplay(1),
    refCount(),
  );
