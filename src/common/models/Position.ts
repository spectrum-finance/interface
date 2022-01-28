import { cache } from 'decorator-cache-getter';

import { AmmPool } from './AmmPool';
import { Currency } from './Currency';

export class Position {
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

  constructor(public pool: AmmPool, public lp: Currency) {}
}
