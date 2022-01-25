import { math } from '../../utils/math';
import { AmmPool } from './AmmPool';
import { AssetLock, AssetLockStatus } from './AssetLock';
import { Currency } from './Currency';

export class AssetLockAccumulator {
  readonly pool: AmmPool;

  readonly lp: Currency;

  readonly withdrawableLp: Currency;

  readonly x: Currency;

  readonly withdrawableX: Currency;

  readonly y: Currency;

  readonly withdrawableY: Currency;

  get share(): number {
    const lpAmount = this.lp.toString({ suffix: false });
    const poolLiquidityAmount = this.pool.lp.toString({ suffix: false });
    return math.evaluate!(
      `${lpAmount} / (${lpAmount} + ${poolLiquidityAmount}) * 100`,
    ).toFixed(2);
  }

  constructor(public locks: AssetLock[]) {
    if (!locks.length) {
      throw new Error("Locks can't be empty");
    }
    if (locks.some((l) => l.pool.id !== locks[0].pool.id)) {
      throw new Error("Can't accumulate locks with different lp id");
    }
    this.pool = this.locks[0].pool;

    const { lp, x, y, withdrawableLp, withdrawableY, withdrawableX } =
      locks.reduce<{
        x: Currency;
        y: Currency;
        lp: Currency;
        withdrawableLp: Currency;
        withdrawableX: Currency;
        withdrawableY: Currency;
      }>(
        (acc, lock) => {
          acc.y = acc.y.plus(lock.y);
          acc.x = acc.x.plus(lock.x);
          acc.lp = acc.lp.plus(lock.lp);

          if (lock.status === AssetLockStatus.UNLOCKED) {
            acc.withdrawableY = acc.withdrawableY.plus(lock.y);
            acc.withdrawableX = acc.withdrawableX.plus(lock.x);
            acc.withdrawableLp = acc.withdrawableLp.plus(lock.lp);
          }

          return acc;
        },
        {
          x: new Currency(0n, this.pool.x.asset),
          y: new Currency(0n, this.pool.y.asset),
          lp: new Currency(0n, this.pool.lp.asset),
          withdrawableX: new Currency(0n, this.pool.x.asset),
          withdrawableY: new Currency(0n, this.pool.y.asset),
          withdrawableLp: new Currency(0n, this.pool.lp.asset),
        },
      );

    this.lp = lp;
    this.x = x;
    this.y = y;
    this.withdrawableLp = withdrawableLp;
    this.withdrawableY = withdrawableY;
    this.withdrawableX = withdrawableX;
  }
}
