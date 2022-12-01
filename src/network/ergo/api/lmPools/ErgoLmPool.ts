import { LmPool as ErgoBaseLmPool, LmPoolConfig } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { cache } from 'decorator-cache-getter';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { LmPool } from '../../../../common/models/LmPool';

export class ErgoLmPool extends LmPool {
  constructor(
    public pool: ErgoBaseLmPool,
    private assetsInfoDictionary: {
      lq: AssetInfo;
      vlq: AssetInfo;
      reward: AssetInfo;
      tt: AssetInfo;
      assetX: AssetInfo;
      assetY: AssetInfo;
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

  @cache
  get assetX(): AssetInfo {
    return this.assetsInfoDictionary.assetY;
  }

  @cache
  get assetY(): AssetInfo {
    return this.assetsInfoDictionary.assetX;
  }

  // cache?
  get epochAlloc(): bigint {
    return this.pool.epochAlloc;
  }

  // cache?
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
