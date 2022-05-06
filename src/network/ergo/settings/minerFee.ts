import {
  distinctUntilChanged,
  map,
  Observable,
  publishReplay,
  refCount,
} from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { normalizeAmount } from '../../../common/utils/amount';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { settings, settings$ } from './settings';

const toMinerFee = (minerFee: number): Currency =>
  new Currency(
    normalizeAmount(minerFee.toString(), networkAsset),
    networkAsset,
  );

export const minerFee$: Observable<Currency> = settings$.pipe(
  map((settings) => settings.minerFee),
  distinctUntilChanged(),
  map(toMinerFee),
  publishReplay(1),
  refCount(),
);

export const useMinerFee = (): Currency => {
  const [minerFee] = useObservable(
    minerFee$,
    [],
    toMinerFee(settings.minerFee),
  );

  return minerFee;
};
