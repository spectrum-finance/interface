import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { AmmPool as BaseAmmPool } from '@ergolabs/ergo-dex-sdk/build/main/amm/entities/ammPool';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { math } from '../../utils/math';
import { normalizeAmount } from '../utils/amount';
import { Currency } from './Currency';

export class AmmPool {
  constructor(private pool: BaseAmmPool) {}

  get id(): PoolId {
    return this.pool.id;
  }

  get poolFeeNum(): number {
    return this.pool.poolFeeNum;
  }

  get feeNum(): bigint {
    return this.pool.feeNum;
  }

  get lp(): Currency {
    return new Currency(this.pool.lp.amount, this.pool.lp.asset);
  }

  get y(): Currency {
    return new Currency(this.pool.y.amount, this.pool.y.asset);
  }

  get x(): Currency {
    return new Currency(this.pool.x.amount, this.pool.x.asset);
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

  calculateOutputPrice(inputCurrency: Currency): Currency {
    const outputCurrency = this.calculateOutputAmount(inputCurrency);

    if (inputCurrency.amount === 1n) {
      return outputCurrency;
    }

    const fmtInput = inputCurrency.toString({ suffix: false });
    const fmtOutput = outputCurrency.toString({ suffix: false });

    const p = math.evaluate!(`${fmtOutput} / ${fmtInput}`).toString();

    return new Currency(
      normalizeAmount(p, outputCurrency.asset),
      outputCurrency.asset,
    );
  }

  calculateInputPrice(outputCurrency: Currency): Currency {
    const inputCurrency = this.calculateInputAmount(outputCurrency);

    if (outputCurrency.amount === 1n) {
      return inputCurrency;
    }

    const fmtInput = inputCurrency.toString({ suffix: false });
    const fmtOutput = outputCurrency.toString({ suffix: false });

    const p = math.evaluate!(`${fmtInput} / ${fmtOutput}`).toString();

    return new Currency(
      normalizeAmount(p, inputCurrency.asset),
      inputCurrency.asset,
    );
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

    return new Currency(inputAmount?.amount, inputAmount?.asset);
  }

  calculateOutputAmount(currency: Currency): Currency {
    const outputAmount = this.pool.outputAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(outputAmount.amount, outputAmount?.asset);
  }
}
