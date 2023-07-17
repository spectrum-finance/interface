import axios from 'axios';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../../../../../applicationConfig';
import { AmmPool } from '../../../../../../../../common/models/AmmPool';
import { appTick$ } from '../../../../../../../../common/streams/appTick';
import { math } from '../../../../../../../../utils/math';

const LBSP_COEFFICIENT = 0.006;

const EPOCHS_PER_YEAR = 73;

const spfUsdRate$ = appTick$.pipe(
  switchMap(() =>
    from(axios.get<{ price: number }>(applicationConfig.spfUsdRateUrl)),
  ),
  map((res) => res.data.price),
  catchError(() => of(0)),
  distinctUntilChanged(),
  publishReplay(1),
  refCount(),
);
spfUsdRate$.subscribe();

const adaUsdRate$ = appTick$.pipe(
  switchMap(() =>
    from(
      axios.get<{ market_data: { current_price: { usd: number } } }>(
        'https://api.coingecko.com/api/v3/coins/cardano',
      ),
    ),
  ),
  map((res) => res.data.market_data.current_price.usd),
  catchError(() => of(0)),
  distinctUntilChanged(),
  publishReplay(1),
  refCount(),
);
adaUsdRate$.subscribe();

const getLbspMultiplier = () => 2;

export const calculateLbspApr = (ammPool: AmmPool): Observable<number> => {
  return combineLatest([spfUsdRate$, adaUsdRate$]).pipe(
    map(([spfUsdRate, adaUsdRate]) => {
      const lbspMult = getLbspMultiplier();
      const adaQuantity = ammPool.y.toAmount();

      const totalLiquidityInUsd = math.evaluate!(
        `${adaUsdRate} * ${adaQuantity} * 2`,
      ).toFixed();

      return math.evaluate!(
        `(${adaQuantity} * ${LBSP_COEFFICIENT} * ${lbspMult} * ${spfUsdRate} / ${totalLiquidityInUsd}) * ${EPOCHS_PER_YEAR}`,
      ).toFixed(2);
    }),
    map((res) => (res ? Number(res) : 0)),
  );
};
