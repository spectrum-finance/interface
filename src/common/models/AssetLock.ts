import { blocksToMillis } from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { DateTime } from 'luxon';

import { AmmPool } from './AmmPool';
import { Currency } from './Currency';

export enum AssetLockStatus {
  LOCKED,
  UNLOCKED,
}

export class AssetLock {
  get deadline(): number {
    return this.tokenLock.deadline;
  }

  get lp(): Currency {
    return new Currency(
      this.tokenLock.lockedAsset.amount,
      this.tokenLock.lockedAsset.asset,
    );
  }

  get x(): Currency {
    const [x] = this.pool.shares(this.lp);

    return x;
  }

  get y(): Currency {
    const [, y] = this.pool.shares(this.lp);

    return y;
  }

  get status(): AssetLockStatus {
    if (this.currentBlock < this.deadline) {
      return AssetLockStatus.LOCKED;
    }
    return AssetLockStatus.UNLOCKED;
  }

  get unlockDate(): DateTime {
    return DateTime.now().plus({
      millisecond: Number(
        blocksToMillis(this.deadline - this.currentBlock - 1),
      ),
    });
  }

  constructor(
    public pool: AmmPool,
    public tokenLock: TokenLock,
    private currentBlock: number,
  ) {}
}
