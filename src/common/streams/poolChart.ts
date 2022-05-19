import type { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import { DateTime } from 'luxon';
import { from, map, Observable } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { AmmPool } from '../models/AmmPool';
import { PoolChartData } from '../models/PoolChartData';

interface PoolChartDataRaw {
  price: number;
  timestamp: number;
}

interface getPoolChartDataParams {
  from?: number;
  to?: number;
  resolution?: number;
}

export const getPoolChartDataRaw = (
  poolId: PoolId,
  params?: getPoolChartDataParams,
): Observable<PoolChartDataRaw[]> =>
  from(
    axios.get<PoolChartDataRaw[]>(
      `${applicationConfig.networksSettings.ergo.analyticUrl}amm/pool/${poolId}/chart`,
      {
        params: params || {},
      },
    ),
  ).pipe(map(({ data }) => data));

export const getPoolChartData = (
  pool: AmmPool,
  params?: getPoolChartDataParams,
): Observable<PoolChartData[]> => {
  return getPoolChartDataRaw(pool.id, params).pipe(
    map((data) =>
      data.map((d) => new PoolChartData(d, pool.x.asset, pool.y.asset)),
    ),
  );
};
