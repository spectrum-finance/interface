import {
  AmmPool,
  mkNetworkPoolsV1,
  Quickblue,
  ScriptCredsV1,
} from '@ergolabs/cardano-dex-sdk';
import { mkPoolsParser } from '@ergolabs/cardano-dex-sdk/build/main/amm/parsers/poolsParser';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import {
  catchError,
  filter,
  from,
  map,
  of,
  publishReplay,
  refCount,
  tap,
} from 'rxjs';

import { CardanoAmmPool } from './CardanoAmmPool';

const req = RustModule.load().then((wasm) => {
  const cardanoNetwork = new Quickblue('https://testnet-api.quickblue.io/v1');
  const poolsParser = mkPoolsParser(wasm);
  const poolsRepository = mkNetworkPoolsV1(
    cardanoNetwork,
    poolsParser,
    ScriptCredsV1,
  );

  return poolsRepository.getAll({ offset: 0, limit: 100 });
});

export const ammPools$ = from(req).pipe(
  catchError(() => of(undefined)),
  filter(Boolean),
  tap((res) => console.log(res)),
  map(([pools]: [AmmPool[], number]) =>
    pools.map((p) => new CardanoAmmPool(p)),
  ),
  publishReplay(1),
  refCount(),
);
