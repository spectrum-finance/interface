import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { cache } from 'decorator-cache-getter';

import { math } from '../../utils/math';
import { AmmPool } from './AmmPool';
import { AssetLock, AssetLockStatus } from './AssetLock';
import { Currency } from './Currency';

export class Position {
  static noop(ammPool: AmmPool): Position {
    return new Position(
      ammPool,
      new Currency(0n, ammPool.lp.asset),
      true,
      [],
      0,
    );
  }

  readonly locks: AssetLock[];

  @cache
  get totalLockedPercent(): number {
    const lpAmount = this.totalLockedLp.toString({ suffix: false });
    const poolLiquidityAmount = this.lp.toString({ suffix: false });
    return math.evaluate!(
      `${lpAmount} / (${poolLiquidityAmount}) * 100`,
    ).toFixed(2);
  }

  @cache
  get x(): Currency {
    const [x] = this.pool.shares(this.lp);

    return x;
  }

  @cache
  get y(): Currency {
    const [, y] = this.pool.shares(this.lp);

    return y;
  }

  readonly totalLockedX: Currency;

  readonly totalLockedY: Currency;

  readonly totalLockedLp: Currency;

  readonly withdrawableLockedX: Currency;

  readonly withdrawableLockedY: Currency;

  readonly withdrawableLockedLp: Currency;

  constructor(
    public pool: AmmPool,
    public lp: Currency,
    public empty = false,
    tokenLocks: TokenLock[],
    networkHeight: number,
  ) {
    this.locks = tokenLocks.map((tl) => new AssetLock(this, tl, networkHeight));
    const {
      totalLockedLp,
      totalLockedY,
      totalLockedX,
      withdrawableLockedLp,
      withdrawableLockedY,
      withdrawableLockedX,
    } = this.locks.reduce<{
      totalLockedLp: Currency;
      totalLockedX: Currency;
      totalLockedY: Currency;
      withdrawableLockedLp: Currency;
      withdrawableLockedX: Currency;
      withdrawableLockedY: Currency;
    }>(
      (acc, lock) => {
        acc.totalLockedY = acc.totalLockedY.plus(lock.y);
        acc.totalLockedX = acc.totalLockedX.plus(lock.x);
        acc.totalLockedLp = acc.totalLockedLp.plus(lock.lp);

        if (lock.status === AssetLockStatus.UNLOCKED) {
          acc.withdrawableLockedY = acc.withdrawableLockedY.plus(lock.y);
          acc.withdrawableLockedX = acc.withdrawableLockedX.plus(lock.x);
          acc.withdrawableLockedLp = acc.withdrawableLockedLp.plus(lock.lp);
        }

        return acc;
      },
      {
        totalLockedX: new Currency(0n, this.pool.x.asset),
        totalLockedY: new Currency(0n, this.pool.y.asset),
        totalLockedLp: new Currency(0n, this.pool.lp.asset),
        withdrawableLockedX: new Currency(0n, this.pool.x.asset),
        withdrawableLockedY: new Currency(0n, this.pool.y.asset),
        withdrawableLockedLp: new Currency(0n, this.pool.lp.asset),
      },
    );

    this.totalLockedLp = totalLockedLp;
    this.totalLockedX = totalLockedX;
    this.totalLockedY = totalLockedY;
    this.withdrawableLockedLp = withdrawableLockedLp;
    this.withdrawableLockedY = withdrawableLockedY;
    this.withdrawableLockedX = withdrawableLockedX;
  }
}
