import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { AmmPool as BaseAmmPool } from '@ergolabs/ergo-dex-sdk/build/main/amm/entities/ammPool';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { cache } from 'decorator-cache-getter';
import { evaluate } from 'mathjs';

import { AnalyticsData } from '../../services/new/analytics';
import { math, renderFractions } from '../../utils/math';
import { AmmPoolAnalytics } from '../streams/poolAnalytic';
import { Searchable } from '../utils/Searchable';
import { Currency } from './Currency';
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

export class AmmPool implements Searchable {
  constructor(
    private pool: BaseAmmPool,
    private poolAnalytics?: AmmPoolAnalytics,
  ) {}

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
  get id(): PoolId {
    return this.pool.id;
  }

  @cache
  get poolFee(): number {
    return evaluate(`(1 - ${this.pool.feeNum} / 1000) * 100`).toFixed(1);
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
  get xRatio(): Ratio {
    return this.getRatio(this.x, this.y);
  }

  @cache
  get yRatio(): Ratio {
    return this.getRatio(this.y, this.x);
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

  getAssetAmount(asset: AssetInfo): Currency {
    if (this.pool.x.asset.id === asset.id) {
      return this.x;
    }
    if (this.pool.y.asset.id === asset.id) {
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

  calculateDepositAmount(currency: Currency): Currency {
    const depositAmount = this.pool.depositAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(depositAmount?.amount, depositAmount?.asset);
  }

  calculateInputAmount(currency: Currency): Currency {
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
      this.pool.id?.toLowerCase().includes(normalizedTerm) ||
      this.x.asset.name?.toLowerCase().includes(normalizedTerm) ||
      this.y.asset.name?.toLowerCase().includes(normalizedTerm) ||
      `${this.x.asset.name?.toLowerCase()}${this.y.asset.name?.toLowerCase()}`.includes(
        normalizedTerm,
      )
    );
  }

  private getRatio(first: Currency, second: Currency): Ratio {
    const firstAmount = renderFractions(first.amount, first.asset.decimals);
    const secondAmount = renderFractions(second.amount, second.asset.decimals);

    const ratioAmount = math.evaluate!(
      `${firstAmount} / ${secondAmount}`,
    ).toString();

    return new Ratio(ratioAmount, first.asset, second.asset);
  }
}
