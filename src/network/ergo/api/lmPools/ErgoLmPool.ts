import { LmPool as ErgoBaseLmPool, LmPoolConfig } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { cache } from 'decorator-cache-getter';

import { AmmPool } from '../../../../common/models/AmmPool';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { LmPool } from '../../../../common/models/LmPool';
import { renderFractions } from '../../../../utils/math';

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
      balanceVlq: Currency;
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

  get yourStake(): [Currency, Currency] {
    return this.ammPool.shares(
      new Currency(this.assetsInfoDictionary.balanceVlq.amount, this.lqAsset),
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

  get balanceVlq(): Currency {
    return this.assetsInfoDictionary.balanceVlq;
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
    return this.pool.epochsLeft(currentHeight);
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
    return new Currency(this.pool.reward.amount, this.rewardAsset);
  }
}
