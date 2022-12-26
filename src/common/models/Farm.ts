import { DateTime } from 'luxon';

import { AmmPool } from './AmmPool';
import { Currency } from './Currency';

export enum LmPoolStatus {
  All = 'All',
  Live = 'Live',
  Scheduled = 'Scheduled',
  Finished = 'Finished',
}

export interface Farm<T = any> {
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
}
