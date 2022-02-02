import { blocksToMillis, PoolId } from '@ergolabs/ergo-dex-sdk';
import { cache } from 'decorator-cache-getter';
import { DateTime } from 'luxon';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';

import { getAmmPoolById } from '../../api/ammPools';
import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { Dictionary } from '../../common/utils/Dictionary';
import { networkContext$ } from '../../network/ergo/networkContext/networkContext';
import {
  AmmPoolLocksAnalytic,
  getPoolLocksAnalyticsById,
} from '../../services/new/analytics';
import { math } from '../../utils/math';

const MIN_RELEVANT_PCT_VALUE = 0.01;

export class LocksGroup {
  @cache
  get deadline(): number {
    return this.locksAnalytic[0].deadline;
  }

  @cache
  get lockedPercent(): number {
    return this.locksAnalytic.reduce((pct, la) => pct + la.percent, 0);
  }

  @cache
  get lockedLp(): Currency {
    return this.locksAnalytic.reduce(
      (lp, la) => lp.plus(new Currency(BigInt(la.amount), this.pool.lp.asset)),
      new Currency(0n, this.pool.lp.asset),
    );
  }

  @cache
  get lockedX(): Currency {
    const [lockedX] = this.pool.shares(this.lockedLp);

    return lockedX;
  }

  @cache
  get lockedY(): Currency {
    const [, lockedY] = this.pool.shares(this.lockedLp);

    return lockedY;
  }

  @cache
  get unlockDate(): DateTime {
    return DateTime.now().plus({
      millisecond: Number(
        blocksToMillis(this.deadline - this.networkHeight - 1),
      ),
    });
  }

  @cache
  get share(): Currency {
    const lpAmount = this.lockedLp.toString({ suffix: false });
    const poolLiquidityAmount = this.pool.lp.toString({ suffix: false });
    return math.evaluate!(
      `${lpAmount} / (${poolLiquidityAmount}) * 100`,
    ).toFixed(2);
  }

  constructor(
    public readonly pool: AmmPool,
    private locksAnalytic: AmmPoolLocksAnalytic[],
    private networkHeight: number,
  ) {}
}

export class AmmPoolConfidenceAnalytic {
  readonly locksGroups: LocksGroup[];

  @cache
  get lockedPercent(): number {
    return this.locksGroups.reduce((pct, lg) => pct + lg.lockedPercent, 0);
  }

  @cache
  get lockedLp(): Currency {
    return this.locksGroups.reduce(
      (lp, lg) => lp.plus(lg.lockedLp),
      new Currency(0n, this.pool.lp.asset),
    );
  }

  @cache
  get share(): Currency {
    const lpAmount = this.lockedLp.toString({ suffix: false });
    const poolLiquidityAmount = this.pool.lp.toString({ suffix: false });
    return math.evaluate!(
      `${lpAmount} / (${poolLiquidityAmount}) * 100`,
    ).toFixed(2);
  }

  @cache
  get lockedX(): Currency {
    const [lockedX] = this.pool.shares(this.lockedLp);

    return lockedX;
  }

  @cache
  get lockedY(): Currency {
    const [, lockedY] = this.pool.shares(this.lockedLp);

    return lockedY;
  }

  constructor(
    public readonly pool: AmmPool,
    locksAnalytic: AmmPoolLocksAnalytic[],
    networkHeight: number,
  ) {
    this.locksGroups = Object.values(
      locksAnalytic.reduce(this.groupByDeadline, {}),
    ).map(
      (items) =>
        new LocksGroup(
          this.pool,
          items.filter((item) => item.percent >= MIN_RELEVANT_PCT_VALUE),
          networkHeight,
        ),
    );
  }

  private groupByDeadline(
    acc: Dictionary<AmmPoolLocksAnalytic[]>,
    lockAnalytic: AmmPoolLocksAnalytic,
  ) {
    if (!acc[lockAnalytic.deadline]) {
      acc[lockAnalytic.deadline] = [];
    }
    acc[lockAnalytic.deadline].push(lockAnalytic);

    return acc;
  }
}

export const getAmmPoolConfidenceAnalyticByAmmPoolId = (
  ammPoolId: PoolId,
): Observable<AmmPoolConfidenceAnalytic | undefined> =>
  getAmmPoolById(ammPoolId).pipe(
    switchMap((pool) => {
      if (!pool) {
        return of(undefined);
      }

      return combineLatest([
        networkContext$,
        getPoolLocksAnalyticsById(ammPoolId),
      ]).pipe(
        map(
          ([networkContext, poolLocksAnalytics]) =>
            new AmmPoolConfidenceAnalytic(
              pool,
              poolLocksAnalytics,
              networkContext.height,
            ),
        ),
      );
    }),
  );
