import { AmmPool as ErgoBaseAmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { cache } from 'decorator-cache-getter';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { PoolChartData } from '../../../../common/models/PoolChartData';
import { AmmPoolAnalytics } from '../../../../common/streams/poolAnalytic';
import { AnalyticsData } from '../../../../services/new/analytics';
import { PoolChartDataRaw } from '../poolChart/poolChart';

export class ErgoAmmPool extends AmmPool {
  constructor(
    public pool: ErgoBaseAmmPool,
    private poolAnalytics?: AmmPoolAnalytics,
    private _dayRatioTrend: PoolChartDataRaw[] = [],
    public verified: boolean = false,
  ) {
    super();
  }

  get dayRatioTrend(): PoolChartData[] {
    return this._dayRatioTrend.map(
      (d) => new PoolChartData(d, this.x.asset, this.y.asset),
    );
  }

  @cache
  get tvl(): AnalyticsData | undefined {
    return this.poolAnalytics?.tvl;
  }

  @cache
  get volume(): AnalyticsData | undefined {
    return this.poolAnalytics?.volume;
  }

  @cache
  get yearlyFeesPercent(): number | undefined {
    return this.poolAnalytics?.yearlyFeesPercent;
  }

  @cache
  get id(): string {
    return this.pool.id;
  }

  @cache
  get poolFeeNum(): number {
    return this.pool.poolFeeNum;
  }

  @cache
  get feeNum(): bigint {
    return this.pool.feeNum;
  }

  @cache
  get lp(): Currency {
    return new Currency(this.pool.lp.amount, this.pool.lp.asset);
  }

  @cache
  get y(): Currency {
    return new Currency(this.pool.y.amount, this.pool.y.asset);
  }

  @cache
  get x(): Currency {
    return new Currency(this.pool.x.amount, this.pool.x.asset);
  }

  shares(input: Currency): [Currency, Currency] {
    const [assetX, assetY] = this.pool.shares(
      new AssetAmount(input.asset, input.amount),
    );

    return [
      new Currency(assetX.amount, assetX.asset),
      new Currency(assetY.amount, assetY.asset),
    ];
  }

  calculateDepositAmount(currency: Currency): Currency {
    const depositAmount = this.pool.depositAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(depositAmount?.amount, depositAmount?.asset);
  }

  calculateInputAmount(currency: Currency): Currency {
    if (currency.eq(this.getAssetAmount(currency.asset))) {
      return new Currency(
        0n,
        currency.asset.id === this.pool.y.asset.id
          ? this.pool.x.asset
          : this.pool.y.asset,
      );
    }

    const inputAmount = this.pool.inputAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    if (!inputAmount) {
      return new Currency(
        0n,
        currency.asset.id === this.pool.y.asset.id
          ? this.pool.x.asset
          : this.pool.y.asset,
      );
    }

    return new Currency(inputAmount?.amount, inputAmount?.asset);
  }

  calculateOutputAmount(currency: Currency): Currency {
    const outputAmount = this.pool.outputAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(outputAmount.amount, outputAmount?.asset);
  }

  calculatePureOutputAmount(currency: Currency): Currency {
    const outputAmount = this.pool.pureOutputAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(outputAmount.amount, outputAmount?.asset);
  }
}
