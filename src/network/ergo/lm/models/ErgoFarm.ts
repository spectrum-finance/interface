import {
  blocksToDaysCount,
  LmPool as ErgoBaseLmPool,
} from '@ergolabs/ergo-dex-sdk';
import { cache } from 'decorator-cache-getter';
import { DateTime } from 'luxon';

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

  @cache
  get id(): string {
    return this.params.lmPool.id;
  }

  get lmPool(): ErgoBaseLmPool {
    return this.params.lmPool;
  }

  get ammPool(): AmmPool {
    return this.params.ammPool;
  }

  @cache
  get totalStakedLq(): Currency {
    return new Currency(this.lmPool.lq.amount, this.assets.lq);
  }

  @cache
  get totalStakedShares(): [Currency, Currency] {
    return this.ammPool.shares(this.totalStakedLq);
  }

  @cache
  get totalStakedX(): Currency {
    return this.totalStakedShares[0];
  }

  @cache
  get totalStakedY(): Currency {
    return this.totalStakedShares[1];
  }

  @cache
  get yourStakeLq(): Currency {
    return this.stakes.reduce(
      (acc, item) => acc.plus(item.lq.amount),
      new Currency(0n, this.assets.lq),
    );
  }

  @cache
  get yourStakeShares(): [Currency, Currency] {
    return this.ammPool.shares(this.yourStakeLq);
  }

  @cache
  get yourStakeX(): Currency {
    return this.yourStakeShares[0];
  }

  @cache
  get yourStakeY(): Currency {
    return this.yourStakeShares[1];
  }

  @cache
  get availableToStakeLq(): Currency {
    return this.params.balanceLq;
  }

  @cache
  get availableToStakeShares(): [Currency, Currency] {
    return this.ammPool.shares(this.params.balanceLq);
  }

  @cache
  get availableToStakeX(): Currency {
    return this.availableToStakeShares[0];
  }

  @cache
  get availableToStakeY(): Currency {
    return this.availableToStakeShares[1];
  }

  @cache
  get reward(): Currency {
    return new Currency(this.lmPool.budget.amount, this.assets.reward);
  }

  @cache
  get programBudget(): Currency {
    return new Currency(this.lmPool.conf.programBudget, this.assets.reward);
  }

  @cache
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

  @cache
  get programStartBlock(): number {
    return this.lmPool.conf.programStart;
  }

  @cache
  get programEndBlock(): number {
    return (
      this.lmPool.conf.programStart +
      this.lmPool.conf.epochLen * this.lmPool.conf.epochNum
    );
  }

  @cache
  get startDateTime(): DateTime {
    return blockToDateTime(this.params.currentHeight, this.programStartBlock);
  }

  @cache
  get endDateTime(): DateTime {
    return blockToDateTime(this.params.currentHeight, this.programEndBlock);
  }

  @cache
  get status(): FarmStatus {
    if (this.params.currentHeight < this.programStartBlock) {
      return FarmStatus.Scheduled;
    }

    if (this.params.currentHeight > this.programEndBlock) {
      return FarmStatus.Finished;
    }

    return FarmStatus.Live;
  }

  @cache
  get distributionFrequencyInDays(): number {
    return blocksToDaysCount(this.lmPool.conf.epochLen);
  }

  @cache
  get distributionFrequencyInBlocks(): number {
    return this.lmPool.conf.epochLen;
  }

  @cache
  get apr(): number | null {
    if (this.status !== FarmStatus.Live) {
      return null;
    }
    return this.params.commonFarmAnalytics?.yearProfit
      ? Number(this.params.commonFarmAnalytics?.yearProfit.toFixed(2))
      : null;
  }

  @cache
  get fullEpochsRemain(): number {
    return this.lmPool.numEpochsRemain(this.params.currentHeight);
  }

  @cache
  get expectedEpochsRemainForStake(): number {
    const currentHeightEpochsRemain = this.lmPool.numEpochsRemain(
      this.params.currentHeight,
    );
    const nextHeightEpochsRemain = this.lmPool.numEpochsRemain(
      this.params.currentHeight + 1,
    );

    return Math.min(currentHeightEpochsRemain, nextHeightEpochsRemain);
  }

  @cache
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

  @cache
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

  constructor(
    private params: ErgoLmPoolParams,
    public assets: ErgoLmPoolAssets,
  ) {
    this.stakes = this.params.stakes.map((stake) => new Stake(stake, this));
  }
}
