import axios from 'axios';
import { DateTime } from 'luxon';
import {
  exhaustMap,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { usdAsset } from '../../../../common/constants/usdAsset';
import { Currency } from '../../../../common/models/Currency';
import { PlatformStats } from '../../../common/PlatformStats';
import { AnalyticsData } from '../common/AnalyticsData';
import { networkContext$ } from '../networkContext/networkContext';

export const platformStats$: Observable<PlatformStats> = networkContext$.pipe(
  exhaustMap(() =>
    from(
      axios.get<{ tvl: AnalyticsData; volume: AnalyticsData }>(
        `${applicationConfig.networksSettings.ergo.analyticUrl}amm/platform/stats`,
        {
          params: {
            from: DateTime.now().minus({ day: 1 }).toMillis(),
          },
        },
      ),
    ),
  ),
  map((res) => ({
    tvl: new Currency(BigInt(res.data.tvl.value.toFixed(0)) || 0n, usdAsset),
    volume: new Currency(
      BigInt(res.data.volume.value.toFixed(0)) || 0n,
      usdAsset,
    ),
  })),
  publishReplay(1),
  refCount(),
);
