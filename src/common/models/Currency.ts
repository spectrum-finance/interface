import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import {
  math,
  parseUserInputToFractions,
  renderFractions,
} from '../../utils/math';
import { getDecimalsCount, normalizeAmount } from '../utils/amount';

const createUnknownAsset = (decimals = 0): AssetInfo => ({
  id: '-1',
  name: 'unknown',
  decimals,
});

const isUnknownAsset = (asset: AssetInfo): boolean => asset.name === 'unknown';

export class Currency {
  private formatter: Intl.NumberFormat;

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
    this.formatter = this.createFormatter(this._asset?.decimals || 0);
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

  isPositive(): boolean {
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

  lt(currency: Currency): boolean {
    this.checkComparisonErrors(currency);
    return this.amount < currency.amount;
  }

  gte(currency: Currency): boolean {
    this.checkComparisonErrors(currency);
    return this.amount >= currency.amount;
  }

  lte(currency: Currency): boolean {
    this.checkComparisonErrors(currency);
    return this.amount <= currency.amount;
  }

  plus(currency: Currency | bigint): Currency {
    if (typeof currency === 'bigint') {
      return new Currency(this.amount + currency, this.asset);
    }

    if (isUnknownAsset(this.asset)) {
      throw new Error("can't sum unknown asset");
    }
    if (this.asset.id !== currency.asset.id) {
      throw new Error("can't sum currencies with different assets");
    }

    return new Currency(this.amount + currency.amount, this.asset);
  }

  minus(currency: Currency | bigint): Currency {
    if (typeof currency === 'bigint') {
      return new Currency(this.amount - currency, this.asset);
    }

    if (isUnknownAsset(this.asset)) {
      throw new Error("can't subtract unknown asset");
    }
    if (this.asset.id !== currency.asset.id) {
      throw new Error("can't subtract currencies with different assets");
    }

    return new Currency(this.amount - currency.amount, this.asset);
  }

  percent(percent: number | string): Currency {
    if (this.amount === 0n) {
      return this;
    }
    const fmtAmount = this.toString();
    const newAmount = math.evaluate!(
      `${fmtAmount} / 100 * ${percent}`,
    ).toString();

    return new Currency(normalizeAmount(newAmount, this.asset), this.asset);
  }

  toAmount(): string {
    return renderFractions(this.amount, this.asset.decimals);
  }

  toString(): string {
    return this.formatter.format(
      +renderFractions(this.amount, this.asset.decimals),
    );
  }

  toCurrencyString(): string {
    return `${this.toString()} ${
      isUnknownAsset(this.asset) ? '' : this.asset.name
    }`;
  }

  toUsd(): void {}

  private checkComparisonErrors(currency: Currency): void {
    if (isUnknownAsset(this.asset)) {
      throw new Error("can't compare unknown asset");
    }
    if (this.asset.id !== currency.asset.id) {
      throw new Error("can't compare currencies with different assets");
    }
  }

  private checkAmountErrors(amount: string, asset: AssetInfo): void {
    const decimalsCount = getDecimalsCount(amount);

    if (isUnknownAsset(asset)) {
      this._asset = createUnknownAsset(decimalsCount);
      return;
    }
    if (decimalsCount > (asset?.decimals || 0)) {
      throw new Error('amount has to many fractions');
    }
  }

  private normalizeAmount(
    amount: bigint,
    currentAsset: AssetInfo,
    newAsset: AssetInfo,
  ): string {
    const amountString = renderFractions(amount, currentAsset.decimals);

    return normalizeAmount(amountString, newAsset);
  }

  private createFormatter(decimals: number): Intl.NumberFormat {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
      currencySign: undefined,
      currency: undefined,
    });
  }
}
