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
import { networkContext$ } from '../networkContext/networkContext';

export const platformStats$: Observable<PlatformStats> = networkContext$.pipe(
  exhaustMap(() =>
    from(
      from(
        axios.get<{ totalValueLocked: number; volume: number }>(
          `${applicationConfig.networksSettings.cardano.analyticUrl}platform/stats`,
        ),
      ),
    ),
  ),
  map((res) => ({
    tvl: new Currency(res.data.totalValueLocked.toString(), usdAsset),
    volume: new Currency(res.data.volume.toString(), usdAsset),
  })),
  publishReplay(1),
  refCount(),
);
