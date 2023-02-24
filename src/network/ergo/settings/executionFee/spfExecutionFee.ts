import {
  combineLatest,
  distinctUntilChanged,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { useObservable } from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { normalizeAmount } from '../../../../common/utils/amount';
import { math } from '../../../../utils/math';
import { convertToConvenientNetworkAsset } from '../../api/ergoUsdRatio/ergoUsdRatio';
import { feeAsset } from '../../api/networkAsset/networkAsset';
import { minerFee$ } from '../minerFee';
import { nitro$, useNitro } from '../nitro';

const MIN_EX_FEE_WITHOUT_OFF_CHAIN_FEE = 100000n;

const toMaxExFee = (minExFee: Currency, nitro: number): Currency =>
  new Currency(
    normalizeAmount(
      math.evaluate!(`${minExFee.toAmount()} * ${nitro}`).toFixed(),
      feeAsset,
    ),
    feeAsset,
  );

export const minExFee$ = minerFee$.pipe(
  switchMap((minerFee) => convertToConvenientNetworkAsset(minerFee, feeAsset)),
  map((minerFeeInSpf) => minerFeeInSpf.plus(MIN_EX_FEE_WITHOUT_OFF_CHAIN_FEE)),
  distinctUntilChanged(),
  publishReplay(),
  refCount(),
);

export const maxExFee$ = combineLatest([minExFee$, nitro$]).pipe(
  map(([minExFee, nitro]) => toMaxExFee(minExFee, nitro)),
  distinctUntilChanged(),
  publishReplay(),
  refCount(),
);

export const useMinExFee = (): Currency => {
  const [minExFee] = useObservable(minExFee$);

  return minExFee || new Currency(MIN_EX_FEE_WITHOUT_OFF_CHAIN_FEE, feeAsset);
};

export const useMaxExFee = (): Currency => {
  const [maxExFee] = useObservable(maxExFee$);
  const nitro = useNitro();

  return (
    maxExFee ||
    toMaxExFee(new Currency(MIN_EX_FEE_WITHOUT_OFF_CHAIN_FEE, feeAsset), nitro)
  );
};
