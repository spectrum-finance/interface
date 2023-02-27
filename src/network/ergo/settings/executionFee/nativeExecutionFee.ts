import {
  combineLatest,
  distinctUntilChanged,
  map,
  publishReplay,
  refCount,
} from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { normalizeAmount } from '../../../../common/utils/amount';
import { math } from '../../../../utils/math';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { minerFee$, useMinerFee } from '../minerFee';
import { nitro$, useNitro } from '../nitro';

const toMinExFee = (minerFee: Currency): Currency =>
  new Currency(
    normalizeAmount(
      math.evaluate!(`${minerFee.toAmount()} * 3`).toFixed(),
      networkAsset,
    ),
    networkAsset,
  );

const toMaxExFee = (minerFee: Currency, nitro: number): Currency =>
  new Currency(
    normalizeAmount(
      math.evaluate!(`${minerFee.toAmount()} * 3 * ${nitro}`).toFixed(),
      networkAsset,
    ),
    networkAsset,
  );

export const minExFee$ = minerFee$.pipe(
  map(toMinExFee),
  distinctUntilChanged(),
  publishReplay(),
  refCount(),
);

export const maxExFee$ = combineLatest([minerFee$, nitro$]).pipe(
  map(([minerFee, nitro]) => toMaxExFee(minerFee, nitro)),
  distinctUntilChanged(),
  publishReplay(),
  refCount(),
);

export const useMinExFee = (): Currency => {
  const minerFee = useMinerFee();

  return toMinExFee(minerFee);
};

export const useMaxExFee = (): Currency => {
  const minerFee = useMinerFee();
  const nitro = useNitro();

  return toMaxExFee(minerFee, nitro);
};
