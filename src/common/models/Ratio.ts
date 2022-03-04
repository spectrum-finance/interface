import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { parseUserInputToFractions, renderFractions } from '../../utils/math';
export class Ratio {
  readonly asset: AssetInfo;

  readonly amount: bigint;

  private formatter: Intl.NumberFormat;

  private readonly decimals: number;

  constructor(amount: string, asset: AssetInfo) {
    this.asset = asset;
    this.decimals = this.getRelevantDecimalsCount(amount);
    this.amount = parseUserInputToFractions(
      Number(amount).toFixed(this.decimals),
      this.decimals,
    );
    this.formatter = this.createFormatter(this.decimals);
  }

  toString(): string {
    return this.formatter.format(+renderFractions(this.amount, this.decimals));
  }

  private getRelevantDecimalsCount(amount: string): number {
    const decimalsPart = amount.split('.')[1] || '';

    return Math.max(
      decimalsPart.split('').findIndex((symbol) => Number(symbol) > 0) + 1,
      this.asset.decimals || 0,
    );
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
