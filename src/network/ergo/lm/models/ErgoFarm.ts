import {
  blocksToDaysCount,
  LmPool as ErgoBaseLmPool,
} from '@ergolabs/ergo-dex-sdk';
import { DateTime } from 'luxon';

import { applicationConfig } from '../../../../applicationConfig';
import { AmmPool } from '../../../../common/models/AmmPool';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { Farm, FarmStatus } from '../../../../common/models/Farm';
import { blockToDateTime } from '../../../../common/utils/blocks';
import {
  CommonFarmAnalyticsItem,
  UserFarmAnalyticsCompoundResult,
  UserFarmAnalyticsNextStakeReward,
} from '../api/farms/analytics';
import { RawStakeWithRedeemerKey } from '../api/stakes/stakes';
import { Stake } from './Stake';

export interface ErgoLmPoolParams {
  readonly lmPool: ErgoBaseLmPool;
  readonly ammPool: AmmPool;
  readonly balanceLq: Currency;
  readonly stakes: RawStakeWithRedeemerKey[];
  readonly currentHeight: number;
  readonly commonFarmAnalytics?: CommonFarmAnalyticsItem;
  readonly userFarmAnalytics: {
    userInterests?: UserFarmAnalyticsCompoundResult;
    userNextStakesReward?: UserFarmAnalyticsNextStakeReward;
  };
}

export interface ErgoLmPoolAssets {
  readonly lq: AssetInfo;
  readonly vlq: AssetInfo;
  readonly reward: AssetInfo;
  readonly tt: AssetInfo;
}

export class ErgoFarm implements Farm<ErgoBaseLmPool> {
  readonly stakes: Stake[];

  get id(): string {
    return this.params.lmPool.id;
  }

  get lmPool(): ErgoBaseLmPool {
    return this.params.lmPool;
  }

  get ammPool(): AmmPool {
    return this.params.ammPool;
  }

  get totalStakedLq(): Currency {
    return new Currency(this.lmPool.lq.amount, this.assets.lq);
  }

  get totalStakedShares(): [Currency, Currency] {
    return this.ammPool.shares(this.totalStakedLq);
  }

  get totalStakedX(): Currency {
    return this.totalStakedShares[0];
  }

  get totalStakedY(): Currency {
    return this.totalStakedShares[1];
  }

  get yourStakeLq(): Currency {
    return this.stakes.reduce(
      (acc, item) => acc.plus(item.lq.amount),
      new Currency(0n, this.assets.lq),
    );
  }

  get yourStakeShares(): [Currency, Currency] {
    return this.ammPool.shares(this.yourStakeLq);
  }

  get yourStakeX(): Currency {
    return this.yourStakeShares[0];
  }

  get yourStakeY(): Currency {
    return this.yourStakeShares[1];
  }

  get availableToStakeLq(): Currency {
    return this.params.balanceLq;
  }

  get availableToStakeShares(): [Currency, Currency] {
    return this.ammPool.shares(this.params.balanceLq);
  }

  get availableToStakeX(): Currency {
    return this.availableToStakeShares[0];
  }

  get availableToStakeY(): Currency {
    return this.availableToStakeShares[1];
  }

  get reward(): Currency {
    return new Currency(this.lmPool.budget.amount, this.assets.reward);
  }

  get programBudget(): Currency {
    return new Currency(this.lmPool.conf.programBudget, this.assets.reward);
  }

  get distributed(): number {
    const pct = this.params.commonFarmAnalytics?.compoundedReward || 0;
    const minimalPct = 0.01;

    if (pct === 0) {
      return 0;
    }

    if (pct < minimalPct) {
      return minimalPct;
    }
    return pct;
  }

  get programStartBlock(): number {
    return this.lmPool.conf.programStart;
  }

  get programEndBlock(): number {
    return (
      this.lmPool.conf.programStart +
      this.lmPool.conf.epochLen * this.lmPool.conf.epochNum
    );
  }

  get startDateTime(): DateTime {
    return blockToDateTime(this.params.currentHeight, this.programStartBlock);
  }

  get endDateTime(): DateTime {
    return blockToDateTime(this.params.currentHeight, this.programEndBlock);
  }

  get status(): FarmStatus {
    if (this.params.currentHeight < this.programStartBlock) {
      return FarmStatus.Scheduled;
    }

    if (this.params.currentHeight > this.programEndBlock) {
      return FarmStatus.Finished;
    }

    return FarmStatus.Live;
  }

  get distributionFrequencyInDays(): number {
    return blocksToDaysCount(this.lmPool.conf.epochLen);
  }

  get distributionFrequencyInBlocks(): number {
    return this.lmPool.conf.epochLen;
  }

  get apr(): number | null {
    if (this.status !== FarmStatus.Live) {
      return null;
    }
    return this.params.commonFarmAnalytics?.yearProfit
      ? Number(this.params.commonFarmAnalytics?.yearProfit.toFixed(2))
      : null;
  }

  get fullEpochsRemain(): number {
    return this.lmPool.numEpochsRemain(this.params.currentHeight);
  }

  get expectedEpochsRemainForStake(): number {
    const currentHeightEpochsRemain = this.lmPool.numEpochsRemain(
      this.params.currentHeight,
    );
    const nextHeightEpochsRemain = this.lmPool.numEpochsRemain(
      this.params.currentHeight + 1,
    );

    return Math.min(currentHeightEpochsRemain, nextHeightEpochsRemain);
  }

  get collectedRewards(): Currency | null {
    if (!this.yourStakeLq.isPositive()) {
      return null;
    }

    if (!this.params.userFarmAnalytics.userInterests?.reward?.amount) {
      return new Currency(0n, this.assets.reward);
    }
    return new Currency(
      BigInt(this.params.userFarmAnalytics.userInterests?.reward?.amount),
      this.assets.reward,
    );
  }

  get nextReward(): Currency | null {
    if (this.status === FarmStatus.Finished) {
      return null;
    }

    if (!this.yourStakeLq.isPositive()) {
      return null;
    }

    if (!this.params.userFarmAnalytics.userNextStakesReward?.nextReward) {
      return null;
    }

    return new Currency(
      BigInt(this.params.userFarmAnalytics.userNextStakesReward.nextReward),
      this.assets.reward,
    );
  }

  get isTest(): boolean {
    return applicationConfig.testFarms.includes(this.id);
  }

  constructor(
    private params: ErgoLmPoolParams,
    public assets: ErgoLmPoolAssets,
  ) {
    this.stakes = this.params.stakes.map((stake) => new Stake(stake, this));
  }
}
