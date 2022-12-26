import { DateTime } from 'luxon';

import { AmmPool } from './AmmPool';
import { Currency } from './Currency';

export enum LmPoolStatus {
  All = 'All',
  Live = 'Live',
  Scheduled = 'Scheduled',
  Finished = 'Finished',
}

export interface LmPool<T = any> {
  readonly lmPool: T;

  readonly ammPool: AmmPool;

  readonly id: string;

  readonly totalStakedLq: Currency;

  readonly totalStakedShares: [Currency, Currency];

  readonly totalStakedX: Currency;

  readonly totalStakedY: Currency;

  readonly yourStakeLq: Currency;

  readonly yourStakeShares: [Currency, Currency];

  readonly yourStakeX: Currency;

  readonly yourStakeY: Currency;

  readonly availableToStakeLq: Currency;

  readonly availableToStakeShares: [Currency, Currency];

  readonly availableToStakeX: Currency;

  readonly reward: Currency;

  readonly programBudget: Currency;

  readonly availableToStakeY: Currency;

  readonly distributed: number;

  readonly apr: number | null;

  readonly startDateTime: DateTime;

  readonly endDateTime: DateTime;

  readonly status: LmPoolStatus;

  readonly programStartBlock: number;

  readonly programEndBlock: number;

  readonly fullEpochsRemain: number;

  //
  // abstract get lq(): Currency;
  //
  // abstract get reward(): Currency;
  //
  // abstract get vlq(): Currency;
  //
  // abstract get tt(): Currency;
  //

  //
  // abstract getApr(
  //   programBudgetLeftInUsd: Currency,
  //   amountLqLockedInUsd: Currency,
  // ): number | null;
  //
  // abstract get yourStake(): [Currency, Currency];
  // abstract get availableLqShares(): [Currency, Currency];
  //
  // abstract get balanceLq(): Currency;
  //
  // abstract get balanceVlq(): Currency;
  //
  // abstract get programBudget(): string;
  //
  // abstract get fullEpochsRemain(): number;
  //
  // @cache
  // get shares(): [Currency, Currency] {
  //   return this.ammPool.shares(this.lq);
  // }
  //
  // @cache
  // get currentStatus(): FarmState {
  //   if (this.currentHeight < this.config.programStart) {
  //     return FarmState.Scheduled;
  //   }
  //
  //   if (
  //     this.currentHeight >
  //     this.config.programStart + this.config.epochLen * this.config.epochNum
  //   ) {
  //     return FarmState.Finished;
  //   }
  //
  //   return FarmState.Live;
  // }
  //
  // get startDateTime(): string {
  //   return blockToDateTime(
  //     this.currentHeight,
  //     this.config.programStart,
  //   ).toFormat('yyyy-MM-dd HH:MM');
  // }
  //
  // get endDateTime(): string {
  //   return blockToDateTime(
  //     this.currentHeight,
  //     this.config.programStart + this.config.epochLen * this.config.epochNum,
  //   ).toFormat('yyyy-MM-dd HH:MM');
  // }
  //
  // get progressInPercents(): number {
  //   if (Number(this.reward.toAmount()) === 0) {
  //     return 100;
  //   }
  //
  //   if (Number(this.programBudget) === Number(this.reward.toAmount())) {
  //     return 0;
  //   }
  //
  //   return Number(
  //     numeral(this.programBudget)
  //       .subtract(this.reward.toAmount())
  //       .divide(this.programBudget)
  //       .multiply(100)
  //       .format('00.00'),
  //   );
  // }
  //
  // get distributionFrequencyInDays(): number {
  //   return blocksToDaysCount(this.config.epochLen);
  // }
}
