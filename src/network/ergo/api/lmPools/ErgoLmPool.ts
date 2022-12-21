import {
  blocksToDaysCount,
  LmPool as ErgoBaseLmPool,
  LmPoolConfig,
} from '@ergolabs/ergo-dex-sdk';
import { cache } from 'decorator-cache-getter';
import numeral from 'numeral';

import { AmmPool } from '../../../../common/models/AmmPool';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { LmPool } from '../../../../common/models/LmPool';
import { renderFractions } from '../../../../utils/math';
import { ExtendedStake } from '../lmStake/lmStake';

export class ErgoLmPool extends LmPool {
  constructor(
    public pool: ErgoBaseLmPool,
    private assetsInfoDictionary: {
      lq: AssetInfo;
      vlq: AssetInfo;
      reward: AssetInfo;
      tt: AssetInfo;
      ammPool: AmmPool;
      balanceLq: Currency;
      stakes: ExtendedStake[];
      currentHeight: number;
    },
  ) {
    super();
  }

  private get lqAsset(): AssetInfo {
    return this.assetsInfoDictionary.lq;
  }

  private get vlqAsset(): AssetInfo {
    return this.assetsInfoDictionary.vlq;
  }

  private get rewardAsset(): AssetInfo {
    return this.assetsInfoDictionary.reward;
  }

  private get ttAsset(): AssetInfo {
    return this.assetsInfoDictionary.tt;
  }

  get redeemerKey(): Currency {
    return this.assetsInfoDictionary.stakes[0]?.redeemerKey;
  }

  get stakes(): ExtendedStake[] {
    return this.assetsInfoDictionary.stakes;
  }

  get yourStake(): [Currency, Currency] {
    return this.ammPool.shares(
      new Currency(this.balanceVlq.amount, this.lqAsset),
    );
  }

  getApr(
    programBudgetLeftInUsd: Currency,
    amountLqLockedInUsd: Currency,
  ): number | null {
    const interestsRelation = numeral(programBudgetLeftInUsd.toAmount()).divide(
      amountLqLockedInUsd.toAmount(),
    );
    const { programStart, epochLen, epochNum } = this.config;
    const lmProgramLeftInBlocks =
      programStart + epochLen * epochNum - this.currentHeight;
    const lmProgramLeftInDays = blocksToDaysCount(lmProgramLeftInBlocks);

    return interestsRelation
      .divide(lmProgramLeftInDays)
      .multiply(365)
      .multiply(100)
      .value();
  }

  stakeShares(stake: ExtendedStake): [Currency, Currency] {
    return this.ammPool.shares(
      new Currency(stake.lockedLq.amount, this.lqAsset),
    );
  }

  get balanceVlq(): Currency {
    return this.assetsInfoDictionary.stakes.reduce(
      (acc, item) => acc.plus(item.lockedLq.amount),
      new Currency(0n, this.lqAsset),
    );
  }

  get availableLqShares(): [Currency, Currency] {
    return this.ammPool.shares(this.balanceLq);
  }

  get ammPool(): AmmPool {
    return this.assetsInfoDictionary.ammPool;
  }

  get epochAlloc(): bigint {
    return this.pool.epochAlloc;
  }

  get balanceLq(): Currency {
    return this.assetsInfoDictionary.balanceLq;
  }

  get currentHeight(): number {
    return this.assetsInfoDictionary.currentHeight;
  }

  get programBudget(): string {
    return renderFractions(
      this.config.programBudget,
      this.reward.asset.decimals,
    );
  }

  epochsLeft(currentHeight: number): number {
    return this.pool.numEpochsRemain(currentHeight);
  }

  @cache
  get config(): LmPoolConfig {
    return this.pool.conf;
  }

  @cache
  get id(): string {
    return this.pool.id;
  }

  @cache
  get lq(): Currency {
    return new Currency(this.pool.lq.amount, this.lqAsset);
  }

  @cache
  get vlq(): Currency {
    return new Currency(this.pool.vlq.amount, this.vlqAsset);
  }

  @cache
  get tt(): Currency {
    return new Currency(this.pool.tt.amount, this.ttAsset);
  }

  @cache
  get reward(): Currency {
    return new Currency(this.pool.budget.amount, this.rewardAsset);
  }

  @cache
  get fullEpochsRemain(): number {
    return this.pool.numEpochsRemain(this.currentHeight);
  }
}
