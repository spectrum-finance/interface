import { cache } from 'decorator-cache-getter';

import { AmmPool } from './AmmPool';
import { Currency } from './Currency';

export class Position {
  static noop(pool: AmmPool): Position {
    return new Position(pool, new Currency(0n, pool.lp.asset), true);
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

  constructor(
    public pool: AmmPool,
    public lp: Currency,
    public empty = false,
  ) {}
}
