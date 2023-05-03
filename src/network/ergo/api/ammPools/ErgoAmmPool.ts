import { AmmPool as ErgoBaseAmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';

import { usdAsset } from '../../../../common/constants/usdAsset';
import { AmmPool } from '../../../../common/models/AmmPool';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { AmmPoolAnalytics } from '../ammPoolsStats/ammPoolsStats';

export class ErgoAmmPool extends AmmPool {
  constructor(
    public pool: ErgoBaseAmmPool,
    private assetsInfoDictionary: {
      x: AssetInfo;
      y: AssetInfo;
      lp: AssetInfo;
    },
    private poolAnalytics?: AmmPoolAnalytics,
  ) {
    super();
  }

  get tvl(): Currency | undefined {
    return this.poolAnalytics?.tvl
      ? new Currency(
          BigInt(Math.floor(this.poolAnalytics.tvl.value * 100)),
          usdAsset,
        )
      : undefined;
  }

  get volume(): Currency | undefined {
    return this.poolAnalytics?.volume
      ? new Currency(
          BigInt(Math.floor(this.poolAnalytics.volume.value * 100)),
          usdAsset,
        )
      : undefined;
  }

  get yearlyFeesPercent(): number | undefined {
    return this.poolAnalytics?.yearlyFeesPercent;
  }

  get id(): string {
    return this.pool.id;
  }

  get poolFeeNum(): number {
    return this.pool.poolFeeNum;
  }

  get feeNum(): bigint {
    return this.pool.feeNum;
  }

  private get lpAsset(): AssetInfo {
    return this.assetsInfoDictionary.lp;
  }

  private get xAsset(): AssetInfo {
    return this.assetsInfoDictionary.x;
  }

  private get yAsset(): AssetInfo {
    return this.assetsInfoDictionary.y;
  }

  get lp(): Currency {
    return new Currency(this.pool.lp.amount, this.lpAsset);
  }

  get y(): Currency {
    return new Currency(this.pool.y.amount, this.yAsset);
  }

  get x(): Currency {
    return new Currency(this.pool.x.amount, this.xAsset);
  }

  shares(input: Currency): [Currency, Currency] {
    const [assetX, assetY] = this.pool.shares(
      new AssetAmount(input.asset, input.amount),
    );

    return [
      new Currency(assetX.amount, this.xAsset),
      new Currency(assetY.amount, this.yAsset),
    ];
  }

  calculateDepositAmount(currency: Currency): Currency {
    const depositAmount = this.pool.depositAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(
      depositAmount?.amount,
      depositAmount?.asset.id === this.yAsset.id ? this.yAsset : this.xAsset,
    );
  }

  calculateInputAmount(currency: Currency): Currency {
    if (currency.eq(this.getAssetAmount(currency.asset))) {
      return new Currency(
        0n,
        currency.asset.id === this.yAsset.id ? this.xAsset : this.yAsset,
      );
    }

    const inputAmount = this.pool.inputAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    if (!inputAmount) {
      return new Currency(
        0n,
        currency.asset.id === this.yAsset.id ? this.xAsset : this.yAsset,
      );
    }

    return new Currency(
      inputAmount?.amount,
      inputAmount?.asset.id === this.yAsset.id ? this.yAsset : this.xAsset,
    );
  }

  calculateOutputAmount(currency: Currency): Currency {
    const outputAmount = this.pool.outputAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(
      outputAmount.amount,
      outputAmount?.asset.id === this.yAsset.id ? this.yAsset : this.xAsset,
    );
  }

  calculatePureOutputAmount(currency: Currency): Currency {
    const outputAmount = this.pool.pureOutputAmount(
      new AssetAmount(currency.asset, currency.amount),
    );

    return new Currency(
      outputAmount.amount,
      outputAmount?.asset.id === this.yAsset.id ? this.yAsset : this.xAsset,
    );
  }
}
