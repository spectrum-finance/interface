import {
  blocksToDaysCount,
  LmPool as ErgoBaseLmPool,
} from '@ergolabs/ergo-dex-sdk';
import { cache } from 'decorator-cache-getter';
import { DateTime } from 'luxon';
import numeral from 'numeral';

import { AmmPool } from '../../../../common/models/AmmPool';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { Farm, FarmStatus } from '../../../../common/models/Farm';
import { blockToDateTime } from '../../../../common/utils/blocks';
import { convertToConvenientNetworkAsset } from '../../api/ergoUsdRatio/ergoUsdRatio';
import { RawStakeWithRedeemerKey } from '../api/stakes/stakes';
import { Stake } from './Stake';

export interface ErgoLmPoolParams {
  readonly lmPool: ErgoBaseLmPool;
  readonly ammPool: AmmPool;
  readonly balanceLq: Currency;
  readonly stakes: RawStakeWithRedeemerKey[];
  readonly currentHeight: number;
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
    const rewardAmount = Number(this.reward.toAmount());
    const programBudget = Number(this.programBudget.toAmount());
    const minimalPct = 0.01;

    if (rewardAmount === 0) {
      return 100;
    }

    if (programBudget === rewardAmount) {
      return 0;
    }

    const pct = Number(
      numeral(programBudget)
        .subtract(rewardAmount)
        .divide(programBudget)
        .multiply(100)
        .format('00.00'),
    );

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

    const rewardUsd = convertToConvenientNetworkAsset.snapshot(this.reward);
    const totalStakedUsd = convertToConvenientNetworkAsset.snapshot(
      this.totalStakedShares,
    );

    if (!rewardUsd.isPositive() || !totalStakedUsd.isPositive()) {
      return null;
    }

    const interestsRelation = numeral(rewardUsd.toAmount()).divide(
      totalStakedUsd.toAmount(),
    );
    const { programStart, epochLen, epochNum } = this.lmPool.conf;
    const lmProgramLeftInBlocks =
      programStart + epochLen * epochNum - this.params.currentHeight;
    const lmProgramLeftInDays = blocksToDaysCount(lmProgramLeftInBlocks);

    return interestsRelation
      .divide(lmProgramLeftInDays)
      .multiply(365)
      .multiply(100)
      .value();
  }

  @cache
  get fullEpochsRemain(): number {
    return this.lmPool.numEpochsRemain(this.params.currentHeight);
  }

  @cache
  get nextReward(): Currency | null {
    if (this.status === FarmStatus.Finished) {
      return null;
    }

    if (!this.yourStakeLq.isPositive()) {
      return null;
    }

    const totalStackedAmount = Number(this.totalStakedLq.toAmount());
    const userStackedAmount = Number(this.yourStakeLq.toAmount());
    const relation = numeral(userStackedAmount)
      .divide(totalStackedAmount)
      .value();

    const totalRewardAmount = Number(this.programBudget.toAmount());
    const rewardForEpoch = numeral(totalRewardAmount).divide(
      this.lmPool.conf.epochNum,
    );

    const userRewardForNextEpoch = BigInt(
      Math.floor(rewardForEpoch.multiply(relation).value()!),
    );

    return new Currency(userRewardForNextEpoch, this.assets.reward);
  }

  constructor(
    private params: ErgoLmPoolParams,
    public assets: ErgoLmPoolAssets,
  ) {
    this.stakes = this.params.stakes.map((stake) => new Stake(stake, this));
  }
}
