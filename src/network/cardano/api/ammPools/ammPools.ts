import { AmmPool } from '@teddyswap/cardano-dex-sdk';
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
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';
import { ammPoolsStats$ } from '../ammPoolsStats/ammPoolsStats';
import { mapAssetClassToAssetInfo } from '../common/cardanoAssetInfo/getCardanoAssetInfo';
import { networkContext$ } from '../networkContext/networkContext';
import { AnalyticPoolNetwork } from './analyticPoolNetwork';
import { CardanoAmmPool } from './CardanoAmmPool';

const analyticAmmPoolsNetwork = new AnalyticPoolNetwork();
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
  publishReplay(1),
  refCount(),
);

export const fetchVerifiedPoolIds = (): Observable<string[]> => {
  const poolUrl = cardanoNetworkData.verifiedPoolListUrl;
  return from(fetch(poolUrl).then((response: any) => response.json())).pipe(
    catchError((error) => {
      console.error('Error fetching verified pool list', error);
      return of([]); // In case of error, return an empty array
    }),
  );
};

const filterUnverifiedPools = (
  ammPools: CardanoAmmPool[],
): Observable<CardanoAmmPool[]> => {
  return fetchVerifiedPoolIds().pipe(
    switchMap((verifiedPoolIds) => {
      return of(ammPools.filter((pool) => verifiedPoolIds.includes(pool.id)));
    }),
  );
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
