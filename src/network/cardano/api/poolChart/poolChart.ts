import type { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import { catchError, from, map, Observable, of } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { PoolChartData } from '../../../../common/models/PoolChartData';
import { PoolChartDataParams } from '../../../common/PoolChartDataParams';
import { CardanoAmmPool } from '../ammPools/CardanoAmmPool';

interface PoolChartDataRaw {
  price: { value: number };
  timestamp: number;
}

export const getPoolChartDataRaw = (
  poolId: PoolId,
  params?: PoolChartDataParams,
): Observable<PoolChartDataRaw[]> =>
  from(
    axios.get<PoolChartDataRaw[]>(
      `${applicationConfig.networksSettings.cardano.analyticUrl}pool/${poolId}/chart`,
      {
        params: {
          resolution: params?.resolution,
          from: params?.from ? Math.round(params.from / 1000) : undefined,
          to: params?.to ? Math.round(params.to / 1000) : undefined,
        },
      },
    ),
  ).pipe(
    map(({ data }) => data),
    catchError(() => of([])),
  );

export const getPoolChartData = (
  pool?: CardanoAmmPool,
  params?: PoolChartDataParams,
): Observable<PoolChartData[]> => {
  if (!pool) {
    return of([]);
  }
  return getPoolChartDataRaw(
    `${pool.pool.id.policyId}.${pool.pool.id.name}`,
    params,
  ).pipe(
    map((data) =>
      data.map(
        (d) =>
          new PoolChartData(
            { timestamp: d.timestamp, price: d.price.value },
            pool.x.asset,
            pool.y.asset,
          ),
      ),
    ),
  );
};
