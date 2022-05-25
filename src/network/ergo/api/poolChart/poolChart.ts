import type { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import { from, map, Observable } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { AmmPool } from '../../../../common/models/AmmPool';
import { PoolChartData } from '../../../../common/models/PoolChartData';
import { PoolChartDataParams } from '../../../common/PoolChartDataParams';

interface PoolChartDataRaw {
  price: number;
  timestamp: number;
}

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
  ).pipe(map(({ data }) => data));

export const getPoolChartData = (
  pool: AmmPool,
  params?: PoolChartDataParams,
): Observable<PoolChartData[]> => {
  return getPoolChartDataRaw(pool.id, params).pipe(
    map((data) =>
      data.map((d) => new PoolChartData(d, pool.x.asset, pool.y.asset)),
    ),
  );
};
