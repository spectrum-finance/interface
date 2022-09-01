import { AmmPool as CardanoBaseAmmPool } from '@ergolabs/cardano-dex-sdk';
import { AmmPool as ErgoBaseAmmPool } from '@ergolabs/ergo-dex-sdk';
import { cache } from 'decorator-cache-getter';
import { evaluate } from 'mathjs';

import { AnalyticsData } from '../../services/new/analytics';
import { math, renderFractions } from '../../utils/math';
import { AssetInfo } from './AssetInfo';
import { Currency } from './Currency';
import { PoolChartData } from './PoolChartData';
import { Ratio } from './Ratio';

const calculatePureOutputAmount = (
  input: Currency,
  ammPool: AmmPool,
): string => {
  if (input.asset.id === ammPool.x.asset.id) {
    return math.evaluate!(
      `(${ammPool.y.toAmount()} * ${input.toAmount()}) / (${ammPool.x.toAmount()} + ${input.toAmount()})`,
    ).toString();
  } else {
    return math.evaluate!(
      `(${ammPool.x.toAmount()} * ${input.toAmount()}) / (${ammPool.y.toAmount()} + ${input.toAmount()})`,
    ).toString();
  }
};

export abstract class AmmPool {
  abstract readonly pool: CardanoBaseAmmPool | ErgoBaseAmmPool;

  abstract get tvl(): AnalyticsData | undefined;

  abstract get volume(): AnalyticsData | undefined;

  abstract get yearlyFeesPercent(): number | undefined;

  abstract get id(): string;

  abstract get feeNum(): bigint;

  abstract get poolFeeNum(): number;

  abstract get lp(): Currency;

  abstract get x(): Currency;

  abstract get y(): Currency;

  abstract shares(input: Currency): [Currency, Currency];

  abstract calculateDepositAmount(currency: Currency): Currency;

  abstract calculateInputAmount(currency: Currency): Currency;

  abstract calculateOutputAmount(currency: Currency): Currency;

  @cache
  get poolFee(): number {
    return evaluate(`(1 - ${this.feeNum} / 1000) * 100`).toFixed(1);
  }

  @cache
  get xRatio(): Ratio {
    return this.getRatio(this.x, this.y);
  }

  @cache
  get yRatio(): Ratio {
    return this.getRatio(this.y, this.x);
  }

  getAssetAmount(asset: AssetInfo): Currency {
    if (this.x.asset.id === asset.id) {
      return this.x;
    }
    if (this.y.asset.id === asset.id) {
      return this.y;
    }
    throw new Error('unknown asset');
  }

  calculateOutputPrice(inputCurrency: Currency): Ratio {
    const outputCurrency = this.calculateOutputAmount(inputCurrency);

    if (outputCurrency.amount === 0n) {
      return outputCurrency.asset.id === this.x.asset.id
        ? this.xRatio
        : this.yRatio;
    }

    if (inputCurrency.amount === 1n) {
      return new Ratio(
        outputCurrency.toAmount(),
        outputCurrency.asset,
        inputCurrency.asset,
      );
    }

    const fmtInput = inputCurrency.toAmount();
    const fmtOutput = outputCurrency.toAmount();

    const p = math.evaluate!(`${fmtOutput} / ${fmtInput}`).toString();

    return new Ratio(p, outputCurrency.asset, inputCurrency.asset);
  }

  calculateInputPrice(outputCurrency: Currency): Ratio {
    const inputCurrency = this.calculateInputAmount(outputCurrency);

    if (inputCurrency.amount === 0n) {
      return inputCurrency.asset.id === this.x.asset.id
        ? this.xRatio
        : this.yRatio;
    }

    if (outputCurrency.amount === 1n) {
      return new Ratio(
        inputCurrency.toAmount(),
        inputCurrency.asset,
        outputCurrency.asset,
      );
    }

    const fmtInput = inputCurrency.toAmount();
    const fmtOutput = outputCurrency.toAmount();

    const p = math.evaluate!(`${fmtInput} / ${fmtOutput}`).toString();

    return new Ratio(p, inputCurrency.asset, outputCurrency.asset);
  }

  calculatePriceImpact(input: Currency): number {
    const ratio =
      input.asset.id === this.x.asset.id
        ? math.evaluate!(
            `${this.y.toAmount()} / ${this.x.toAmount()}`,
          ).toString()
        : math.evaluate!(
            `${this.x.toAmount()} / ${this.y.toAmount()}`,
          ).toString();

    const outputAmount = calculatePureOutputAmount(input, this);
    const outputRatio = math.evaluate!(
      `${outputAmount} / ${input.toAmount()}`,
    ).toString();

    return Math.abs(
      math.evaluate!(`(${outputRatio} * 100 / ${ratio}) - 100`).toFixed(2),
    );
  }

  match(term?: string): boolean {
    if (!term) {
      return true;
    }
    const normalizedTerm = term.toLowerCase().replaceAll('/', '');

    return (
      this.id?.toLowerCase().includes(normalizedTerm) ||
      this.x.asset.ticker?.toLowerCase().includes(normalizedTerm) ||
      this.y.asset.ticker?.toLowerCase().includes(normalizedTerm) ||
      `${this.x.asset.ticker?.toLowerCase()}${this.y.asset.ticker?.toLowerCase()}`.includes(
        normalizedTerm,
      )
    );
  }

  private getRatio(first: Currency, second: Currency): Ratio {
    const firstAmount = renderFractions(first.amount, first.asset.decimals);
    const secondAmount = renderFractions(second.amount, second.asset.decimals);

    const ratioAmount = math.evaluate!(
      `${firstAmount} / ${secondAmount}`,
    ).toFixed();

    return new Ratio(ratioAmount, first.asset, second.asset);
  }
}
