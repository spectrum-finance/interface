import {
  AmmPool,
  mkNetworkPoolsV1,
  mkPoolsParser,
  ScriptCredsV1,
} from '@spectrumlabs/cardano-dex-sdk';
import { mkSubject } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import {
  BehaviorSubject,
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
import { comparePoolByTvl } from '../../../../common/utils/comparePoolByTvl.ts';
import { ammPoolsStats$ } from '../ammPoolsStats/ammPoolsStats';
import { mapAssetClassToAssetInfo } from '../common/cardanoAssetInfo/getCardanoAssetInfo';
import { cardanoNetwork } from '../common/cardanoNetwork';
import { cardanoWasm$ } from '../common/cardanoWasm';
import { defaultTokenList$ } from '../common/defaultTokenList';
import { networkContext$ } from '../networkContext/networkContext';
import { AnalyticPoolNetwork } from './analyticPoolNetwork';
import { CardanoAmmPool } from './CardanoAmmPool';

export const showUnverifiedPools$ = new BehaviorSubject(false);

const analyticAmmPoolsNetwork = new AnalyticPoolNetwork();

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
      from(poolsRepository.getAll({ offset: 0, limit: 500 })),
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
      from(poolsRepository.getAll({ offset: 0, limit: 500 })),
    ),
    publishReplay(1),
    refCount(),
  );

export const getUnverifiedAmmPools = () =>
  combineLatest([getPools(), getPoolsV2()]).pipe(
    catchError(() => of(undefined)),
    filter(Boolean),
    map(([[poolsV1], [poolsV2]]: [[AmmPool[], number], [AmmPool[], number]]) =>
      poolsV1.concat(poolsV2),
    ),
    switchMap((pools: AmmPool[]) =>
      defaultTokenList$.pipe(
        map((defaultTokenList) =>
          pools.filter(
            (pool) => !defaultTokenList.tokensMap.has(mkSubject(pool.y.asset)),
          ),
        ),
      ),
    ),
    switchMap((pools: AmmPool[]) =>
      combineLatest(
        pools.map((p) =>
          combineLatest(
            [p.lp.asset, p.x.asset, p.y.asset].map((asset) =>
              mapAssetClassToAssetInfo(asset),
            ),
          ).pipe(
            map(([lp, x, y]) => {
              return new CardanoAmmPool(p, { lp, x, y }, undefined, true);
            }),
          ),
        ),
      ),
    ),
  );

export const unverifiedAmmPools$ = networkContext$.pipe(
  exhaustMap(() => getUnverifiedAmmPools()),
  publishReplay(1),
  refCount(),
);

const rawAmmPools$: Observable<AmmPool[]> = networkContext$.pipe(
  exhaustMap(() => analyticAmmPoolsNetwork.getAll().then((data) => data[0])),
  catchError(() => of(undefined)),
  filter(Boolean),
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
  map((ammPools) => ammPools.sort(comparePoolByTvl)),
  publishReplay(1),
  refCount(),
);

const filterUnverifiedPools = (
  ammPools: CardanoAmmPool[],
): Observable<CardanoAmmPool[]> => {
  // return from(
  //   axios.post(
  //     'https://meta.spectrum.fi/cardano/minting/data/verifyPool/',
  //     ammPools.map((ammPool) => ({
  //       nftCs: ammPool.pool.id.policyId,
  //       nftTn: encodeHex(new TextEncoder().encode(ammPool.pool.id.name)),
  //       lqCs: ammPool.pool.lp.asset.policyId,
  //       lqTn: encodeHex(new TextEncoder().encode(ammPool.pool.lp.asset.name)),
  //     })),
  //   ),
  // ).pipe(
  //   map((res) => {
  //     return ammPools.filter(
  //       (ammPool) =>
  //         res.data.find(
  //           ([{ nftCs }]: [{ nftCs: string }, boolean]) =>
  //             nftCs === ammPool.pool.id.policyId,
  //         )?.[1] || isLbspAmmPool(ammPool.id),
  //     );
  //   }),
  //   catchError(() => of(ammPools)),
  // );
  return of(ammPools);
};

export const ammPools$ = allAmmPools$.pipe(
  switchMap(filterUnverifiedPools),
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
