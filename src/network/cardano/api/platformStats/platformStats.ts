import axios from 'axios';
import {
  exhaustMap,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
} from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { PlatformStats } from '../../../common/PlatformStats';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';
import { networkAsset } from '../networkAsset/networkAsset.ts';
import { networkContext$ } from '../networkContext/networkContext';

export const platformStats$: Observable<PlatformStats> = networkContext$.pipe(
  exhaustMap(() =>
    from(
      from(
        axios.get<{
          tvlAda: number;
          volumeAda: number;
          tvlUsd: number;
          volumeUsd: number;
          lpFeesAda: number;
          lpFeeUsd: number;
        }>(`${cardanoNetworkData.analyticUrl}platform/stats`),
      ),
    ),
  ),
  map((res) => ({
    tvl: new Currency(
      res.data.tvlAda.toFixed(networkAsset.decimals),
      networkAsset,
    ),
    volume: new Currency(
      res.data.volumeAda.toFixed(networkAsset.decimals),
      networkAsset,
    ),
  })),
  publishReplay(1),
  refCount(),
);
