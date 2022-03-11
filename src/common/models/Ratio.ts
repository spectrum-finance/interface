import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import {
  math,
  parseUserInputToFractions,
  renderFractions,
} from '../../utils/math';
import { normalizeAmount } from '../utils/amount';
import { Currency } from './Currency';
export class Ratio {
  readonly baseAsset: AssetInfo;

  readonly quoteAsset: AssetInfo;

  readonly amount: bigint;

  private formatter: Intl.NumberFormat;

  private readonly decimals: number;

  constructor(amount: string, baseAsset: AssetInfo, quoteAsset: AssetInfo) {
    this.baseAsset = baseAsset;
    this.quoteAsset = quoteAsset;
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

  toAmount(): string {
    return renderFractions(this.amount, this.decimals);
  }

  toCurrency(quoteCurrency: Currency): Currency {
    if (quoteCurrency.asset.id !== this.quoteAsset.id) {
      throw new Error(`currency should be quote: ${quoteCurrency.asset.name}`);
    }

    const baseCurrencyAmount = normalizeAmount(
      math.evaluate!(
        `${quoteCurrency.toAmount()} * ${this.toAmount()}`,
      ).toString(),
      this.baseAsset,
    );

    return new Currency(baseCurrencyAmount, this.baseAsset);
  }

  invertRatio(): Ratio {
    return new Ratio(
      (1 / +this.toAmount()).toString(),
      this.quoteAsset,
      this.baseAsset,
    );
  }

  private getRelevantDecimalsCount(amount: string): number {
    const decimalsPart = amount.split('.')[1] || '';

    return Math.max(
      decimalsPart.split('').findIndex((symbol) => Number(symbol) > 0) + 1,
      this.baseAsset.decimals || 0,
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
