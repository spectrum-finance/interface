import {
  AmmPool,
  mkNetworkPoolsV1,
  ScriptCredsV1,
} from '@ergolabs/cardano-dex-sdk';
import { mkPoolsParser } from '@ergolabs/cardano-dex-sdk/build/main/amm/parsers/poolsParser';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import {
  catchError,
  combineLatest,
  exhaustMap,
  filter,
  from,
  map,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { mapAssetClassToAssetInfo } from '../common/cardanoAssetInfo/getCardanoAssetInfo';
import { cardanoNetwork } from '../common/cardanoNetwork';
import { cardanoWasm$ } from '../common/cardanoWasm';
import { networkContext$ } from '../networkContext/networkContext';
import { CardanoAmmPool } from './CardanoAmmPool';

const getPools = () =>
  cardanoWasm$.pipe(
    map(() =>
      mkNetworkPoolsV1(
        cardanoNetwork,
        mkPoolsParser(RustModule.CardanoWasm),
        ScriptCredsV1,
      ),
    ),
    switchMap((poolsRepository) =>
      from(poolsRepository.getAll({ offset: 0, limit: 100 })),
    ),
    publishReplay(1),
    refCount(),
  );

export const ammPools$ = networkContext$.pipe(
  exhaustMap(() => getPools()),
  catchError(() => of(undefined)),
  filter(Boolean),
  switchMap(([pools]: [AmmPool[], number]) =>
    combineLatest(
      pools.map((p) =>
        combineLatest(
          [p.lp.asset, p.x.asset, p.y.asset].map((asset) =>
            mapAssetClassToAssetInfo(asset),
          ),
        ).pipe(map(([lp, x, y]) => new CardanoAmmPool(p, { lp, x, y }))),
      ),
    ),
  ),
  map((ammPools) =>
    ammPools.filter(
      (ap) =>
        !applicationConfig.blacklistedPools.includes(ap.id) &&
        !applicationConfig.hiddenAssets.includes(ap.x.asset.id) &&
        !applicationConfig.hiddenAssets.includes(ap.y.asset.id),
    ),
  ),
  publishReplay(1),
  refCount(),
);
