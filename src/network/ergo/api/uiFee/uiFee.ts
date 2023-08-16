import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
} from 'rxjs';

import { usdAsset } from '../../../../common/constants/usdAsset';
import { Currency } from '../../../../common/models/Currency';
import { Ratio } from '../../../../common/models/Ratio';
import { convertToConvenientNetworkAsset } from '../ergoUsdRatio/ergoUsdRatio';
import { networkAsset } from '../networkAsset/networkAsset';

export interface UiFeeParams {
  readonly address: string;
  readonly minUiFee: number;
  readonly uiFeePercent: number;
  readonly uiFeeThreshold: number;
}

export const uiFeeParams$ = new BehaviorSubject<UiFeeParams>({
  address: '9fdmUutc4DhcqXAAyQeBTsw49PjEM4vuW9riQCHtXAoGEw3R11d',
  minUiFee: 0.3,
  uiFeePercent: 3,
  uiFeeThreshold: 30,
});

const _calculateUiFee = (
  usdErgRate: Ratio,
  inputInErg: Currency,
  params: UiFeeParams,
): Currency => {
  const minUiFeeInErg = usdErgRate.toBaseCurrency(
    new Currency(params.minUiFee.toString(), usdAsset),
  );
  const feeThresholdInErg = usdErgRate.toBaseCurrency(
    new Currency(params.uiFeeThreshold.toString(), usdAsset),
  );

  if (inputInErg.lte(feeThresholdInErg)) {
    return minUiFeeInErg;
  }
  const uiFeeInErg = inputInErg.percent(0.3);

  return uiFeeInErg.gte(minUiFeeInErg) ? uiFeeInErg : minUiFeeInErg;
};

export const minUiFee$: Observable<Currency> = combineLatest([
  convertToConvenientNetworkAsset.rate(networkAsset),
  uiFeeParams$,
]).pipe(
  map(([usdErgRate, params]) =>
    usdErgRate.toBaseCurrency(
      new Currency(params.minUiFee.toString(), usdAsset),
    ),
  ),
  publishReplay(1),
  refCount(),
);

export const calculateUiFeeSync = (
  input: Currency = new Currency(0n, networkAsset),
): Currency => {
  const usdErgRate = convertToConvenientNetworkAsset.rateSnapshot(networkAsset);
  const inputInErg =
    input.asset.id === networkAsset.id
      ? input
      : convertToConvenientNetworkAsset.snapshot(input, networkAsset);
  const uiFeeParams = uiFeeParams$.getValue();
  return _calculateUiFee(usdErgRate, inputInErg, uiFeeParams);
};

export const calculateUiFee = (
  input: Currency = new Currency(0n, networkAsset),
): Observable<Currency> =>
  combineLatest([
    convertToConvenientNetworkAsset.rate(networkAsset),
    input.asset.id === networkAsset.id
      ? of(input)
      : convertToConvenientNetworkAsset(input, networkAsset),
    uiFeeParams$,
  ]).pipe(
    debounceTime(200),
    map(([usdErgRate, inputInErg, params]: [Ratio, Currency, UiFeeParams]) =>
      _calculateUiFee(usdErgRate, inputInErg, params),
    ),
    distinctUntilChanged(
      (prev, current) => prev?.toAmount() === current?.toAmount(),
    ),
  );
