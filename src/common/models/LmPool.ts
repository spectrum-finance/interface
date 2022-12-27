import {
  blocksToDaysCount,
  LmPool as ErgoBaseLmPool,
  LmPoolConfig as ErgoBaseLmPoolConfig,
} from '@ergolabs/ergo-dex-sdk';
import { cache } from 'decorator-cache-getter';
import numeral from 'numeral';

import { FarmState } from '../../pages/Farm/types/FarmState';
import { blockToDateTime } from '../utils/blocks';
import { AmmPool } from './AmmPool';
import { Currency } from './Currency';

export abstract class LmPool {
  abstract readonly pool: ErgoBaseLmPool;

  abstract get id(): string;

  abstract get lq(): Currency;

  abstract get reward(): Currency;

  abstract get vlq(): Currency;

  abstract get tt(): Currency;
  abstract get config(): ErgoBaseLmPoolConfig;
  abstract get epochAlloc(): bigint;
  abstract get ammPool(): AmmPool;

  abstract epochsLeft(currentHeight: number): number;
  abstract getApr(
    programBudgetLeftInUsd: Currency,
    amountLqLockedInUsd: Currency,
  ): number | null;

  abstract getUserNextRewards(
    userAmountLqLockedInUsd: Currency,
    amountLqLockedInUsd: Currency,
  ): number | null;

  abstract get yourStake(): [Currency, Currency];
  abstract get availableLqShares(): [Currency, Currency];

  abstract get balanceLq(): Currency;

  abstract get balanceVlq(): Currency;

  abstract get currentHeight(): number;

  abstract get programBudget(): string;

  abstract get fullEpochsRemain(): number;

  @cache
  get shares(): [Currency, Currency] {
    return this.ammPool.shares(this.lq);
  }

  @cache
  get currentStatus(): FarmState {
    if (this.currentHeight < this.config.programStart) {
      return FarmState.Scheduled;
    }

    if (
      this.currentHeight >
      this.config.programStart + this.config.epochLen * this.config.epochNum
    ) {
      return FarmState.Finished;
    }

    return FarmState.Live;
  }

  get startDateTime(): string {
    return blockToDateTime(
      this.currentHeight,
      this.config.programStart,
    ).toFormat('yyyy-MM-dd HH:MM');
  }

  get endDateTime(): string {
    return blockToDateTime(
      this.currentHeight,
      this.config.programStart + this.config.epochLen * this.config.epochNum,
    ).toFormat('yyyy-MM-dd HH:MM');
  }

  get progressInPercents(): number {
    if (Number(this.reward.toAmount()) === 0) {
      return 100;
    }

    if (Number(this.programBudget) === Number(this.reward.toAmount())) {
      return 0;
    }

    return Number(
      numeral(this.programBudget)
        .subtract(this.reward.toAmount())
        .divide(this.programBudget)
        .multiply(100)
        .format('00.00'),
    );
  }

  get distributionFrequencyInDays(): number {
    return blocksToDaysCount(this.config.epochLen);
  }
}
