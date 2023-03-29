import { Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { PoolChartData } from '../../common/models/PoolChartData';
import { PoolChartDataParams } from '../../network/common/PoolChartDataParams';
import { selectedNetwork$ } from '../common/network';

export const getPoolChartData = (
  pool?: AmmPool,
  params?: PoolChartDataParams,
): Observable<PoolChartData[]> =>
  selectedNetwork$.pipe(
    switchMap((n) => n.getPoolChartData(pool, params)),
    publishReplay(1),
    refCount(),
  );
