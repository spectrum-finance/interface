import axios from 'axios';
import {
  exhaustMap,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
} from 'rxjs';

import { usdAsset } from '../../../../common/constants/usdAsset';
import { Currency } from '../../../../common/models/Currency';
import { PlatformStats } from '../../../common/PlatformStats';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';
import { networkContext$ } from '../networkContext/networkContext';

export const platformStats$: Observable<PlatformStats> = networkContext$.pipe(
  exhaustMap(() =>
    from(
      from(
        axios.get<{ totalValueLocked: number; volume: number }>(
          `${cardanoNetworkData.analyticUrl}platform/stats`,
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
