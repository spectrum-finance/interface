import {
  AmmPool,
  mkNetworkPoolsV1,
  ScriptCredsV1,
} from '@spectrumlabs/cardano-dex-sdk';
import { mkPoolsParser } from '@spectrumlabs/cardano-dex-sdk/build/main/amm/parsers/poolsParser';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import {
  catchError,
  combineLatest,
  exhaustMap,
  filter,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { ammPoolsStats$ } from '../ammPoolsStats/ammPoolsStats';
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
      from(poolsRepository.getAll({ offset: 0, limit: 200 })),
    ),
    publishReplay(1),
    refCount(),
  );

const getPoolsV2 = () =>
  cardanoWasm$.pipe(
    map(() =>
      mkNetworkPoolsV1(cardanoNetwork, mkPoolsParser(RustModule.CardanoWasm), {
        ...ScriptCredsV1,
        ammPool: '6b9c456aa650cb808a9ab54326e039d5235ed69f069c9664a8fe5b69',
      }),
    ),
    switchMap((poolsRepository) =>
      from(poolsRepository.getAll({ offset: 0, limit: 200 })),
    ),
    publishReplay(1),
    refCount(),
  );

const rawAmmPools$: Observable<AmmPool[]> = networkContext$.pipe(
  exhaustMap(() => combineLatest([getPools(), getPoolsV2()])),
  catchError(() => of(undefined)),
  filter(Boolean),
  map(([[poolsV1], [poolsV2]]: [[AmmPool[], number], [AmmPool[], number]]) =>
    poolsV1.concat(poolsV2),
  ),
  publishReplay(1),
  refCount(),
);

export const allAmmPools$ = combineLatest([rawAmmPools$, ammPoolsStats$]).pipe(
  switchMap(([pools, analytics]) =>
    combineLatest(
      pools.map((p) =>
        combineLatest(
          [p.lp.asset, p.x.asset, p.y.asset].map((asset) =>
            mapAssetClassToAssetInfo(asset),
          ),
        ).pipe(
          map(([lp, x, y]) => {
            return new CardanoAmmPool(
              p,
              { lp, x, y },
              analytics[`${p.id.policyId}.${p.id.name}`],
            );
          }),
        ),
      ),
    ),
  ),
  publishReplay(1),
  refCount(),
);

export const ammPools$ = allAmmPools$.pipe(
  map((ammPools) =>
    ammPools.filter(
      (ap) =>
        !applicationConfig.blacklistedPools.includes(ap.id) &&
        !applicationConfig.hiddenAssets.includes(ap.x.asset.id) &&
        !applicationConfig.hiddenAssets.includes(ap.y.asset.id) &&
        applicationConfig.lbspLiquidityPools.includes(ap.id),
    ),
  ),
  publishReplay(1),
  refCount(),
);
