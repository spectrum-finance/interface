import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  publishReplay,
  refCount,
} from 'rxjs';

import { Currency } from '../../../common/models/Currency';
import { normalizeAmount } from '../../../common/utils/amount';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { settings$ } from './settings';

const minerFee$: Observable<number> = settings$.pipe(
  map((settings) => settings.minerFee),
  distinctUntilChanged(),
  publishReplay(1),
  refCount(),
);

const nitro$: Observable<number> = settings$.pipe(
  map((settings) => settings.nitro),
  distinctUntilChanged(),
  publishReplay(1),
  refCount(),
);

export const minExecutionFee$ = minerFee$.pipe(
  map(
    (minerFee) =>
      new Currency(
        normalizeAmount((minerFee * 3).toString(), networkAsset),
        networkAsset,
      ),
  ),
  distinctUntilChanged(),
  publishReplay(),
  refCount(),
);

export const maxExecutionFee$ = combineLatest([minerFee$, nitro$]).pipe(
  map(
    ([minerFee, nitro]) =>
      new Currency(
        normalizeAmount((minerFee * 3 * nitro).toString(), networkAsset),
        networkAsset,
      ),
  ),
  distinctUntilChanged(),
  publishReplay(),
  refCount(),
);
