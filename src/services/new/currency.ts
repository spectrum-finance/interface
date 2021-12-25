import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { parseUserInputToFractions, renderFractions } from '../../utils/math';

const createUnknownAsset = (decimals = 0) => ({
  id: '-1',
  name: 'unknown',
  decimals,
});

const isUnknownAsset = (asset: AssetInfo): boolean => asset.name === 'unknown';

export class Currency {
  private _amount = 0n;

  private _asset: AssetInfo = createUnknownAsset(0);

  constructor(amount?: bigint | string, asset?: AssetInfo) {
    if (!!asset) {
      this._asset = asset;
    }
    if (typeof amount === 'bigint') {
      this._amount = amount;
    }
    if (typeof amount === 'string') {
      this.checkAmountErrors(amount, this._asset);
      this._amount = parseUserInputToFractions(amount, this._asset.decimals);
    }
  }

  get amount(): bigint {
    return this._amount;
  }

  get asset(): AssetInfo {
    return this._asset;
  }

  fromAmount(amount: bigint | string): Currency {
    return this.changeAmount(amount);
  }

  isUnknownAsset(): boolean {
    return isUnknownAsset(this.asset);
  }

  isAssetEquals(a: AssetInfo): boolean {
    return a.id === this.asset.id;
  }

  isPositive() {
    return this.amount > 0n;
  }

  changeAmount(amount: bigint | string): Currency {
    return new Currency(amount, this.asset);
  }

  changeAsset(asset: AssetInfo): Currency {
    return new Currency(
      this.normalizeAmount(this.amount, this.asset, asset),
      asset,
    );
  }

  gt(currency: Currency): boolean {
    this.checkComparisonErrors(currency);
    return this.amount > currency.amount;
  }

  lt(currency: Currency) {
    this.checkComparisonErrors(currency);
    return this.amount < currency.amount;
  }

  gte(currency: Currency) {
    this.checkComparisonErrors(currency);
    return this.amount >= currency.amount;
  }

  lte(currency: Currency) {
    this.checkComparisonErrors(currency);
    return this.amount <= currency.amount;
  }

  plus(currency: Currency): Currency {
    if (isUnknownAsset(this.asset)) {
      throw new Error("can't sum unknown asset");
    }
    if (this.asset.id !== currency.asset.id) {
      throw new Error("can't sum currencies with different assets");
    }

    return new Currency(this.amount + currency.amount, this.asset);
  }

  minus(currency: Currency) {
    if (isUnknownAsset(this.asset)) {
      throw new Error("can't subtract unknown asset");
    }
    if (this.asset.id !== currency.asset.id) {
      throw new Error("can't subtract currencies with different assets");
    }

    return new Currency(this.amount - currency.amount, this.asset);
  }

  toString(config?: { suffix: boolean }): string {
    if ((!config || !!config?.suffix) && !isUnknownAsset(this.asset)) {
      return `${renderFractions(this.amount, this.asset.decimals)} ${
        this.asset.name
      }`;
    }

    return `${renderFractions(this.amount, this.asset.decimals)}`;
  }

  toUsd() {}

  private checkComparisonErrors(currency: Currency): void {
    if (isUnknownAsset(this.asset)) {
      throw new Error("can't compare unknown asset");
    }
    if (this.asset.id !== currency.asset.id) {
      throw new Error("can't compare currencies with different assets");
    }
  }

  private checkAmountErrors(amount: string, asset: AssetInfo): void {
    const decimalsCount = this.getDecimalsCount(amount);

    if (isUnknownAsset(asset)) {
      this._asset = createUnknownAsset(decimalsCount);
      return;
    }
    if (decimalsCount > (asset?.decimals || 0)) {
      throw new Error('amount has to many fractions');
    }
  }

  private getDecimalsCount(amount: string) {
    const decimals = amount.split('.')[1];

    if (decimals) {
      return decimals.length;
    }
    return 0;
  }

  private normalizeAmount(
    amount: bigint,
    currentAsset: AssetInfo,
    newAsset: AssetInfo,
  ): string {
    const amountString = renderFractions(amount, currentAsset.decimals);
    const currentDecimalsCount = this.getDecimalsCount(amountString);

    if (currentDecimalsCount <= (newAsset.decimals || 0)) {
      return amountString;
    }

    return amountString.slice(
      0,
      amountString.length - currentDecimalsCount + (newAsset.decimals || 0),
    );
  }
}
