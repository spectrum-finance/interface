import { math } from '../../utils/math';
import { AmmPool } from './AmmPool';
import { AssetLock } from './AssetLock';
import { Currency } from './Currency';

export class AssetLockAccumulator {
  readonly pool: AmmPool;

  readonly lp: Currency;

  readonly x: Currency;

  readonly y: Currency;

  get share(): number {
    const lpAmount = this.lp.toString({ suffix: false });
    const poolLiquidityAmount = this.pool.lp.toString({ suffix: false });
    return math.evaluate!(
      `${lpAmount} / (${lpAmount} + ${poolLiquidityAmount}) * 100`,
    ).toFixed(2);
  }

  constructor(private locks: AssetLock[]) {
    if (!locks.length) {
      throw new Error("Locks can't be empty");
    }
    if (locks.some((l) => l.pool.id !== locks[0].pool.id)) {
      throw new Error("Can't accumulate locks with different lp id");
    }
    this.pool = this.locks[0].pool;

    const { lp, x, y } = locks.reduce<{
      x: Currency;
      y: Currency;
      lp: Currency;
    }>(
      (acc, lock) => {
        acc.y = acc.y.plus(lock.y);
        acc.x = acc.x.plus(lock.x);
        acc.lp = acc.lp.plus(lock.lp);

        return acc;
      },
      {
        x: new Currency(0n, this.pool.x.asset),
        y: new Currency(0n, this.pool.y.asset),
        lp: new Currency(0n, this.pool.lp.asset),
      },
    );

    this.lp = lp;
    this.x = x;
    this.y = y;
  }
}
