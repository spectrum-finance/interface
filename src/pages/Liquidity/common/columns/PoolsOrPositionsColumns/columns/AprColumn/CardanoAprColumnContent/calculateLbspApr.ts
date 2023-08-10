import axios from 'axios';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  filter,
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
import { Currency } from '../../../../../../../../common/models/Currency';
import { appTick$ } from '../../../../../../../../common/streams/appTick';
import { spfAsset } from '../../../../../../../../network/ergo/api/networkAsset/networkAsset';
import {
  isBoostedLbspAmmPool,
  isLbspAmmPool,
} from '../../../../../../../../utils/lbsp.ts';
import { math } from '../../../../../../../../utils/math';

const LBSP_COEFFICIENT = 0.006;
const EPOCHS_PER_YEAR = 73;
const LBSP_MULTIPLIER = 2.25;
const LBSP_BOOSTED_MULTIPLIER = 3.5;

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
  filter(Boolean),
  publishReplay(1),
  refCount(),
);
adaUsdRate$.subscribe();

const getLbspMultiplier = (ammPool: AmmPool) => {
  if (isLbspAmmPool(ammPool.id)) {
    return LBSP_MULTIPLIER;
  }

  if (isBoostedLbspAmmPool(ammPool.id)) {
    return LBSP_BOOSTED_MULTIPLIER;
  }

  return 0;
};

export const calculateLbspApr = (ammPool: AmmPool): Observable<number> => {
  return combineLatest([spfUsdRate$, adaUsdRate$]).pipe(
    map(([spfUsdRate, adaUsdRate]) => {
      const lbspMult = getLbspMultiplier(ammPool);
      return math.evaluate!(
        `(${LBSP_COEFFICIENT} * ${lbspMult} * ${spfUsdRate}) / ${adaUsdRate} * ${EPOCHS_PER_YEAR} * 100`,
      ).toFixed(2);
    }),
    map((res) => (res ? Number(res) : 0)),
  );
};

export const calculateLbspReward = (
  adaAmount: Currency,
  ammPool: AmmPool,
  duration: number,
): Currency => {
  const lbspMult = getLbspMultiplier(ammPool);

  const spfAmount = math.evaluate!(
    `${LBSP_COEFFICIENT} * ${lbspMult} * ${adaAmount.toAmount()} * ${duration}`,
  );

  return new Currency(spfAmount.toFixed(spfAsset.decimals), spfAsset);
};
