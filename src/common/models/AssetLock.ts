import { blocksToMillis, millisToBlocks } from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { BoxId } from '@ergolabs/ergo-sdk';
import { DateTime } from 'luxon';

import { AmmPool } from './AmmPool';
import { Currency } from './Currency';
import { Position } from './Position';

export enum AssetLockStatus {
  LOCKED,
  UNLOCKED,
}

export class AssetLock {
  get pool(): AmmPool {
    return this.position.pool;
  }

  get deadline(): number {
    return this.tokenLock.deadline;
  }

  get active(): boolean {
    return this.tokenLock.active;
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
    if (this.currentBlock <= this.deadline) {
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

  get boxId(): BoxId {
    return this.tokenLock.boxId;
  }

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
    public position: Position,
    public tokenLock: TokenLock,
    private currentBlock: number,
  ) {}
}
