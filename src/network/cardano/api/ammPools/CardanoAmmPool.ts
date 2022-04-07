import {
  AmmPool as CardanoBaseAmmPool,
  AssetAmount,
  AssetClass,
} from '@ergolabs/cardano-dex-sdk';
import { AssetInfo as ErgoAssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { cache } from 'decorator-cache-getter';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { AnalyticsData } from '../../../../services/new/analytics';

export class CardanoAmmPool extends AmmPool {
  constructor(public pool: CardanoBaseAmmPool) {
    super();
  }

  @cache
  get id(): string {
    return `${this.pool.id.policyId}${this.pool.id.name}`;
  }

  @cache
  get feeNum(): bigint {
    return this.pool.feeNum;
  }

  get verified(): boolean {
    return true;
  }

  @cache
  get poolFeeNum(): number {
    return this.pool.poolFeeNum;
  }

  get tvl(): AnalyticsData | undefined {
    return undefined;
  }

  get volume(): AnalyticsData | undefined {
    return undefined;
  }

  get yearlyFeesPercent(): number | undefined {
    return undefined;
  }

  @cache
  get lp(): Currency {
    return new Currency(
      this.pool.lp.amount,
      this.toAssetInfo(this.pool.lp.asset),
    );
  }

  @cache
  get x(): Currency {
    return new Currency(
      this.pool.x.amount,
      this.toAssetInfo(this.pool.x.asset),
    );
  }

  @cache
  get y(): Currency {
    return new Currency(
      this.pool.y.amount,
      this.toAssetInfo(this.pool.y.asset),
    );
  }

  private toAssetInfo(
    asset: AssetClass | undefined,
  ): ErgoAssetInfo | undefined {
    if (!asset) {
      return undefined;
    }
    return {
      name: asset.name,
      id: `${asset.policyId}-${asset.name}`,
      decimals: 0,
    };
  }

  private toAssetClass(asset: ErgoAssetInfo): AssetClass {
    const [policyId, name] = asset.id.split('-');

    return { policyId, name };
  }

  calculateDepositAmount(currency: Currency): Currency {
    const depositAmount = this.pool.depositAmount(
      new AssetAmount(this.toAssetClass(currency.asset), currency.amount),
    );

    return new Currency(
      depositAmount?.amount,
      this.toAssetInfo(depositAmount?.asset),
    );
  }

  calculateInputAmount(currency: Currency): Currency {
    const inputAmount = this.pool.inputAmount(
      new AssetAmount(this.toAssetClass(currency.asset), currency.amount),
    );

    return new Currency(
      inputAmount?.amount,
      this.toAssetInfo(inputAmount?.asset),
    );
  }

  calculateOutputAmount(currency: Currency): Currency {
    const outputAmount = this.pool.outputAmount(
      new AssetAmount(this.toAssetClass(currency.asset), currency.amount),
    );

    return new Currency(
      outputAmount?.amount,
      this.toAssetInfo(outputAmount?.asset),
    );
  }

  shares(input: Currency): [Currency, Currency] {
    const [assetX, assetY] = this.pool.shares(
      new AssetAmount(this.toAssetClass(input.asset), input.amount),
    );

    return [
      new Currency(assetX.amount, this.toAssetInfo(assetX.asset)),
      new Currency(assetY.amount, this.toAssetInfo(assetY.asset)),
    ];
  }
}
