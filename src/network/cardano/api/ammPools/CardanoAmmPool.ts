import {
  AmmPool as CardanoBaseAmmPool,
  AssetAmount,
  AssetClass,
} from '@ergolabs/cardano-dex-sdk';
import { mkSubject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { AssetInfo as ErgoAssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { cache } from 'decorator-cache-getter';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { AnalyticsData } from '../../../../services/new/analytics';
import { AssetInfo } from '../assetManager/AssetInfo';

export interface AssetInfoDictionary {
  readonly lp?: AssetInfo;
  readonly x?: AssetInfo;
  readonly y?: AssetInfo;
}

export class CardanoAmmPool extends AmmPool {
  constructor(
    public pool: CardanoBaseAmmPool,
    private assetInfoDictionary: AssetInfoDictionary,
  ) {
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
    const assetSubject = mkSubject(asset);
    let assetInfo: AssetInfo | undefined;

    if (assetSubject === this.assetInfoDictionary.x?.subject) {
      assetInfo = this.assetInfoDictionary.x;
    }
    if (assetSubject === this.assetInfoDictionary.y?.subject) {
      assetInfo = this.assetInfoDictionary.y;
    }
    if (assetSubject === this.assetInfoDictionary.lp?.subject) {
      assetInfo = this.assetInfoDictionary.lp;
    }

    return {
      name: asset.name,
      id: assetInfo?.subject || `${asset.policyId}-${asset.name}`,
      decimals: assetInfo?.decimals.value || 0,
    };
  }

  private toAssetClass(asset: ErgoAssetInfo): AssetClass {
    const assetSubject = asset.id;
    let assetInfo: AssetInfo | undefined;

    if (assetSubject === this.assetInfoDictionary.x?.subject) {
      assetInfo = this.assetInfoDictionary.x;
    }
    if (assetSubject === this.assetInfoDictionary.y?.subject) {
      assetInfo = this.assetInfoDictionary.y;
    }
    if (assetSubject === this.assetInfoDictionary.lp?.subject) {
      assetInfo = this.assetInfoDictionary.lp;
    }

    return {
      policyId: assetInfo?.policy || '',
      name: assetInfo?.name.value || '',
    };
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

    if (!inputAmount) {
      return new Currency(
        0n,
        currency.asset.id === this.y.asset.id ? this.x.asset : this.y.asset,
      );
    }

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
