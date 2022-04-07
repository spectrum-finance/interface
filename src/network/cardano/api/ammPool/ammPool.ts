import {
  mkNetworkPoolsV1,
  Quickblue,
  ScriptCredsV1,
} from '@ergolabs/cardano-dex-sdk';
import { mkPoolsParser } from '@ergolabs/cardano-dex-sdk/build/main/amm/parsers/poolsParser';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { of } from 'rxjs';

RustModule.load()
  .then((wasm) => {
    const cardanoNetwork = new Quickblue('https://testnet-api.quickblue.io/v1');
    const poolsParser = mkPoolsParser(wasm);
    const poolsRepository = mkNetworkPoolsV1(
      cardanoNetwork,
      poolsParser,
      ScriptCredsV1,
    );

    return poolsRepository.getAll({ offset: 0, limit: 100 });
  })
  .then((pools) => console.log(pools));

export const ammPools$ = of([]);
