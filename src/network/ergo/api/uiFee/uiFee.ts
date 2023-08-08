import { BehaviorSubject, first, map, Observable, of, zip } from 'rxjs';

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

export const calculateUiFee = (
  input: Currency = new Currency(0n, networkAsset),
): Observable<Currency> =>
  zip([
    convertToConvenientNetworkAsset.rate(networkAsset),
    input.asset.id === networkAsset.id
      ? of(input)
      : convertToConvenientNetworkAsset(input, networkAsset),
    uiFeeParams$,
  ]).pipe(
    first(),
    map(([usdErgRate, inputInErg, params]: [Ratio, Currency, UiFeeParams]) => {
      const minUiFeeInErg = usdErgRate.toBaseCurrency(
        new Currency(params.minUiFee.toString(), usdAsset),
      );
      const feeThresholdInErg = usdErgRate.toBaseCurrency(
        new Currency(params.uiFeeThreshold.toString(), usdAsset),
      );

      if (inputInErg.lte(feeThresholdInErg)) {
        return minUiFeeInErg;
      }
      return inputInErg.percent(0.3).plus(minUiFeeInErg);
    }),
  );
