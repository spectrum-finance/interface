import {
  AdaAssetName,
  AdaPolicyId,
  AmmPool as CardanoBaseAmmPool,
  AssetAmount,
  AssetClass,
} from '@spectrumlabs/cardano-dex-sdk';
import { mkSubject } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';

import { AmmPool } from '../../../../common/models/AmmPool';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { networkAsset } from '../networkAsset/networkAsset';
import { AmmPoolDescriptor } from './analyticPoolNetwork.ts';

export interface AssetInfoDictionary {
  readonly lp?: AssetInfo;
  readonly x?: AssetInfo;
  readonly y?: AssetInfo;
}

export class CardanoAmmPool extends AmmPool {
  constructor(
    public pool: CardanoBaseAmmPool,
    private assetInfoDictionary: AssetInfoDictionary,
    private metrics: AmmPoolDescriptor['metrics'] | undefined,
    private _unverified?: boolean,
  ) {
    super();
  }

  get id(): string {
    return `${
      this.pool.id.policyId
    }.${RustModule.CardanoWasm.AssetName.from_hex(
      this.pool.id.nameHex,
    ).to_js_value()}`;
  }

  get subject(): string {
    return mkSubject(this.pool.id);
  }

  get feeNum(): bigint {
    return this.pool.feeNum;
  }

  get feeDenom(): bigint {
    return this.pool.feeDenom;
  }

  get poolFeeNum(): number {
    return this.pool.poolFeeNum;
  }

  get tvl(): Currency | undefined {
    return this.metrics?.tvlAda
      ? new Currency(
          this.metrics?.tvlAda.toFixed(networkAsset.decimals),
          networkAsset,
        )
      : undefined;
  }

  get volume(): Currency | undefined {
    return this.metrics?.volumeAda
      ? new Currency(
          this.metrics?.volumeAda.toFixed(networkAsset.decimals),
          networkAsset,
        )
      : undefined;
  }

  get yearlyFeesPercent(): number | undefined {
    return this.metrics?.apr?.valueApr || 0;
  }

  get lp(): Currency {
    return new Currency(
      this.pool.lp.amount,
      this.toAssetInfo(this.pool.lp.asset),
    );
  }

  get x(): Currency {
    return new Currency(
      this.pool.x.amount,
      this.toAssetInfo(this.pool.x.asset),
    );
  }

  get y(): Currency {
    return new Currency(
      this.pool.y.amount,
      this.toAssetInfo(this.pool.y.asset),
    );
  }

  get unverified() {
    return this._unverified || false;
  }

  private toAssetInfo(
    asset: AssetClass | undefined,
  ): AssetInfo<AssetClass> | undefined {
    if (!asset) {
      return undefined;
    }
    const assetSubject = mkSubject(asset);
    let assetInfo: AssetInfo | undefined;

    if (assetSubject === this.assetInfoDictionary.x?.id) {
      assetInfo = this.assetInfoDictionary.x;
    }
    if (assetSubject === this.assetInfoDictionary.y?.id) {
      assetInfo = this.assetInfoDictionary.y;
    }
    if (assetSubject === this.assetInfoDictionary.lp?.id) {
      assetInfo = this.assetInfoDictionary.lp;
    }

    if (asset.name === AdaAssetName && asset.policyId === AdaPolicyId) {
      return networkAsset;
    }

    return {
      name: assetInfo?.name || asset.name,
      id: assetInfo?.id || mkSubject(asset),
      decimals: assetInfo?.decimals || 0,
      ticker: assetInfo?.ticker,
      icon: assetInfo?.icon,
      data: asset,
    };
  }

  private toAssetClass(asset: AssetInfo<AssetClass>): AssetClass {
    return asset.data!;
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

  calculateInputAmount(currency: Currency, slippage?: number): Currency {
    const inputAmount = this.pool.inputAmount(
      new AssetAmount(this.toAssetClass(currency.asset), currency.amount),
      slippage,
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

  calculateOutputAmount(currency: Currency, slippage?: number): Currency {
    const outputAmount = this.pool.outputAmount(
      new AssetAmount(this.toAssetClass(currency.asset), currency.amount),
      slippage,
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
