import { blocksToMillis, millisToBlocks } from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { BoxId } from '@ergolabs/ergo-sdk';
import { cache } from 'decorator-cache-getter';
import { DateTime } from 'luxon';

import { AmmPool } from './AmmPool';
import { Currency } from './Currency';

export enum AssetLockStatus {
  LOCKED,
  UNLOCKED,
}

export class AssetLock {
  @cache
  get deadline(): number {
    return this.tokenLock.deadline;
  }

  @cache
  get active(): boolean {
    return this.tokenLock.active;
  }

  @cache
  get lp(): Currency {
    return new Currency(
      this.tokenLock.lockedAsset.amount,
      this.tokenLock.lockedAsset.asset,
    );
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

  @cache
  get status(): AssetLockStatus {
    if (this.currentBlock <= this.deadline) {
      return AssetLockStatus.LOCKED;
    }
    return AssetLockStatus.UNLOCKED;
  }

  @cache
  get unlockDate(): DateTime {
    return DateTime.now().plus({
      millisecond: Number(
        blocksToMillis(this.deadline - this.currentBlock - 1),
      ),
    });
  }

  @cache
  get boxId(): BoxId {
    return this.tokenLock.boxId;
  }

  @cache
  get redeemer(): string {
    return this.tokenLock.redeemer;
  }

  getDeadline(date: DateTime): number {
    return (
      this.currentBlock +
      millisToBlocks(BigInt(date.toMillis() - DateTime.now().toMillis())) +
      1
    );
  }

  constructor(
    public pool: AmmPool,
    public tokenLock: TokenLock,
    private currentBlock: number,
  ) {}
}
