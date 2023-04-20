import type { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import { catchError, from, map, Observable, of } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { AmmPool } from '../../../../common/models/AmmPool';
import {
  PoolChartData,
  PoolChartDataRaw,
} from '../../../../common/models/PoolChartData';
import { PoolChartDataParams } from '../../../common/PoolChartDataParams';

export const getPoolChartDataRaw = (
  poolId: PoolId,
  params?: PoolChartDataParams,
): Observable<PoolChartDataRaw[]> =>
  from(
    axios.get<PoolChartDataRaw[]>(
      `${applicationConfig.networksSettings.ergo.analyticUrl}amm/pool/${poolId}/chart`,
      {
        params: params || {},
      },
    ),
  ).pipe(
    map(({ data }) => data),
    catchError(() => of([])),
  );

export const getPoolChartData = (
  pool?: AmmPool,
  params?: PoolChartDataParams,
): Observable<PoolChartData[]> => {
  if (!pool) {
    return of([]);
  }
  return getPoolChartDataRaw(pool.id, params).pipe(
    map((data) =>
      data.map((d) => new PoolChartData(d, pool.x.asset, pool.y.asset)),
    ),
  );
};
