import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { cache } from 'decorator-cache-getter';

import { AmmPool } from './AmmPool';
import { AssetLock } from './AssetLock';
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
    tokenLocks: TokenLock[],
    networkHeight: number,
  ) {
    this.locks = tokenLocks.map((tl) => new AssetLock(this, tl, networkHeight));
  }
}
