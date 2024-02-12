import { millisToBlocks } from '@ergolabs/ergo-dex-sdk';
import { BoxId, PublicKey } from '@ergolabs/ergo-sdk';
import { DateTime } from 'luxon';

import { AmmPool } from './AmmPool';
import { Currency } from './Currency';
import { Position } from './Position';

export interface AssetLockParams {
  readonly boxId: BoxId;
  readonly lockedAsset: Currency;
  readonly deadline: number;
  readonly unlockDate: DateTime;
  readonly redeemer: PublicKey;
  readonly active: boolean;
  readonly currentBlock: number;
}

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
    return this.tokenLock.lockedAsset;
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
    if (DateTime.now().toMillis() <= this.unlockDate.toMillis()) {
      return AssetLockStatus.LOCKED;
    }
    return AssetLockStatus.UNLOCKED;
  }

  get unlockDate(): DateTime {
    return this.tokenLock.unlockDate;
  }

  get boxId(): BoxId {
    return this.tokenLock.boxId;
  }

  get redeemer(): string {
    return this.tokenLock.redeemer;
  }

  getDeadline(date: DateTime): number {
    return (
      this.tokenLock.currentBlock +
      millisToBlocks(BigInt(date.toMillis() - DateTime.now().toMillis())) +
      1
    );
  }

  constructor(public position: Position, public tokenLock: AssetLockParams) {}
}
