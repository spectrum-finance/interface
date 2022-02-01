import { cache } from 'decorator-cache-getter';
import { sumBy } from 'lodash';
import { map, Observable, of, switchMap } from 'rxjs';

import { getPositionByAmmPoolId } from '../../api/positions';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetLock } from '../../common/models/AssetLock';
import { Currency } from '../../common/models/Currency';
import { Position } from '../../common/models/Position';
import {
  AmmPoolLocksAnalytics,
  getPoolLocksAnalyticsById,
} from '../../services/new/analytics';

export interface LocksAnalyticAccumulator {
  readonly deadline: number;
  readonly percent: number;
  readonly x: Currency;
  readonly y: Currency;
}

const MIN_RELEVANT_LOCK_PERCENT = 0.01;

export class PositionWithLocksAnalytic implements Position {
  @cache
  get lp(): Currency {
    return this.position.lp;
  }

  @cache
  get x(): Currency {
    return this.position.x;
  }

  @cache
  get y(): Currency {
    return this.position.y;
  }

  @cache
  get pool(): AmmPool {
    return this.position.pool;
  }

  @cache
  get empty(): boolean {
    return this.position.empty;
  }

  @cache
  get totalAmmPoolLockedLp(): Currency {
    const sum = this.locksAnalytics.reduce(
      (acc, l) => acc + BigInt(l.amount),
      0n,
    );

    return new Currency(sum, this.pool.lp.asset);
  }

  @cache
  get totalAmmPoolLockedX(): Currency {
    const [x] = this.pool.shares(this.totalAmmPoolLockedLp);

    return x;
  }

  @cache
  get totalAmmPoolLockedY(): Currency {
    const [, y] = this.pool.shares(this.totalAmmPoolLockedLp);

    return y;
  }

  @cache
  get totalAmmPoolLockedPercent(): number {
    return sumBy(this.locksAnalytics, (l) => l.percent);
  }

  @cache
  get locksAnalyticAccumulators(): LocksAnalyticAccumulator[] {
    return Object.values(
      this.locksAnalytics.reduce<{ [key: number]: LocksAnalyticAccumulator }>(
        (acc, la) => {
          if (la.percent < MIN_RELEVANT_LOCK_PERCENT) {
            return acc;
          }

          const [x, y] = this.pool.shares(
            new Currency(la.amount, this.pool.lp.asset),
          );

          if (!acc[la.deadline]) {
            acc[la.deadline] = {
              deadline: la.deadline,
              percent: la.percent,
              x: x,
              y: y,
            };
          } else {
            acc[la.deadline] = {
              ...acc[la.deadline],
              percent: acc[la.deadline].percent + la.percent,
              x: acc[la.deadline].x.plus(x),
              y: acc[la.deadline].y.plus(y),
            };
          }

          return acc;
        },
        {},
      ),
    );
  }

  readonly locks: AssetLock[] = [];

  constructor(
    private position: Position,
    private locksAnalytics: AmmPoolLocksAnalytics[] = [],
  ) {}
}

export const getPositionWithAnalyticByAmmPoolId = (
  ammPoolId: string,
): Observable<PositionWithLocksAnalytic | undefined> =>
  getPositionByAmmPoolId(ammPoolId).pipe(
    switchMap((position) => {
      if (!position) {
        return of(undefined);
      }
      return getPoolLocksAnalyticsById(ammPoolId).pipe(
        map((analytic) => new PositionWithLocksAnalytic(position, analytic)),
      );
    }),
  );
