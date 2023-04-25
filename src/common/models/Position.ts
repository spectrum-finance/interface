import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';

import { math } from '../../utils/math';
import { Searchable } from '../utils/Searchable';
import { AmmPool } from './AmmPool';
import { AssetLock, AssetLockStatus } from './AssetLock';
import { Currency } from './Currency';
import { Farm } from './Farm';

export class Position implements Searchable {
  static noop(ammPool: AmmPool): Position {
    return new Position(
      ammPool,
      new Currency(0n, ammPool.lp.asset),
      true,
      [],
      0,
      [],
    );
  }

  readonly locks: AssetLock[];

  get totalLockedPercent(): number {
    const lpAmount = this.lockedLp.toAmount();
    const poolLiquidityAmount = this.totalLp.toAmount();
    return math.evaluate!(
      `${lpAmount} / (${poolLiquidityAmount}) * 100`,
    ).toFixed(2);
  }

  get availableX(): Currency {
    const [x] = this.pool.shares(this.availableLp);

    return x;
  }

  get availableY(): Currency {
    const [, y] = this.pool.shares(this.availableLp);

    return y;
  }

  get totalX(): Currency {
    return this.availableX.plus(this.lockedX).plus(this.stakedX);
  }

  get totalY(): Currency {
    return this.availableY.plus(this.lockedY).plus(this.stakedY);
  }

  get totalLp(): Currency {
    return this.availableLp.plus(this.lockedLp).plus(this.stakedLp);
  }

  match(term?: string): boolean {
    if (!term) {
      return true;
    }
    const normalizedTerm = term.toLowerCase().replaceAll('/', '');

    return (
      this.pool.x.asset.ticker?.toLowerCase().startsWith(normalizedTerm) ||
      this.pool.y.asset.ticker?.toLowerCase().startsWith(normalizedTerm) ||
      `${this.pool.x.asset.ticker?.toLowerCase()}${this.pool.x.asset.ticker?.toLowerCase()}`.startsWith(
        normalizedTerm,
      )
    );
  }

  readonly lockedX: Currency;

  readonly lockedY: Currency;

  readonly lockedLp: Currency;

  readonly withdrawableLockedX: Currency;

  readonly withdrawableLockedY: Currency;

  readonly withdrawableLockedLp: Currency;

  readonly stakedX: Currency;

  readonly stakedY: Currency;

  readonly stakedLp: Currency;

  constructor(
    public pool: AmmPool,
    public availableLp: Currency,
    public empty = false,
    tokenLocks: TokenLock[],
    networkHeight: number,
    farms: Farm[],
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

    this.lockedLp = totalLockedLp;
    this.lockedX = totalLockedX;
    this.lockedY = totalLockedY;
    this.withdrawableLockedLp = withdrawableLockedLp;
    this.withdrawableLockedY = withdrawableLockedY;
    this.withdrawableLockedX = withdrawableLockedX;

    this.stakedLp = farms.reduce<Currency>(
      (sum, f) => sum.plus(f.yourStakeLq),
      new Currency(0n, this.pool.lp.asset),
    );
    this.stakedX = this.pool.shares(this.stakedLp)[0];
    this.stakedY = this.pool.shares(this.stakedLp)[1];
  }
}
