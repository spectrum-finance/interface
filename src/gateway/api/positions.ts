import { map, Observable, of, publishReplay, refCount, switchMap } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Position } from '../../common/models/Position';
import { selectedNetwork$ } from '../common/network';
import { ammPools$ } from './ammPools';

export const positions$ = selectedNetwork$.pipe(
  switchMap((network) => network.positions$),
  publishReplay(1),
  refCount(),
);
positions$.subscribe();

export const getPositionByAmmPoolId = (
  ammPoolId: string,
): Observable<Position | undefined> =>
  positions$.pipe(
    switchMap((positions) => {
      const position = positions.find((p) => p.pool.id === ammPoolId);

      if (position) {
        return of(position);
      }
      return ammPools$.pipe(
        map<AmmPool[], Position | undefined>((ammPools) => {
          const pool = ammPools.find((p) => p.id === ammPoolId);

          return pool ? Position.noop(pool) : undefined;
        }),
      );
    }),
  );
