import { distinctUntilChanged, map, publishReplay, refCount } from 'rxjs';

import { Currency } from '../../../common/models/Currency';
import { normalizeAmount } from '../../../common/utils/amount';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { settings$ } from './settings';

export const minerFee$ = settings$.pipe(
  map((settings) => settings.minerFee),
  distinctUntilChanged(),
  map(
    (minerFee) =>
      new Currency(
        normalizeAmount(minerFee.toString(), networkAsset),
        networkAsset,
      ),
  ),
  publishReplay(1),
  refCount(),
);
