import {
  AmmPool,
  AssetAmount,
  HexString,
  PoolId,
} from '@spectrumlabs/cardano-dex-sdk';
import { AmmPoolType } from '@spectrumlabs/cardano-dex-sdk/build/main/amm/domain/ammPool';
import { AssetClass } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { decodeHex } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/hex';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';

import { cardanoNetworkData } from '../../utils/cardanoNetworkData.ts';

export interface AmmPoolDescriptor {
  readonly pool: {
    readonly poolType: 'cfmm';
    readonly id: string;
    readonly x: {
      readonly asset: string;
      readonly amount: string;
    };
    readonly y: {
      readonly asset: string;
      readonly amount: string;
    };
    lq: {
      readonly asset: string;
      readonly amount: string;
    };
    readonly poolFeeNumX: number;
    readonly poolFeeNumY: number;
    readonly treasuryFee: number;
    readonly treasuryX: string;
    readonly treasuryY: string;
    readonly verified: true;
    readonly poolLqBound: string;
    readonly version: 'v1' | 'v2' | 'v3' | 'v4';
  };
  readonly metrics?: {
    readonly poolId: PoolId;
    readonly tvlAda: number;
    readonly tvlUsd: number;
    readonly volumeAda: number;
    readonly volumeUsd: number;
    readonly apr?: {
      readonly valueApr: number;
    };
    readonly lpFeeAda: number;
    readonly lpFeeUsd: number;
  };
}

export interface SdkAmmPooldescriptor {
  ammPool: AmmPool;
  metrics: AmmPoolDescriptor['metrics'] | undefined;
}

export class AnalyticPoolNetwork {
  constructor() {
    this.createAmmPool = this.createAmmPool.bind(this);
  }

  getAll(): Promise<SdkAmmPooldescriptor[]> {
    return this.request()
      .then((rawAmmPools) => rawAmmPools.map(this.createAmmPool))
      .then((ammPools) => ammPools);
  }

  private request() {
    return axios
      .get<AmmPoolDescriptor[]>(
        `${cardanoNetworkData.analyticUrl}pools/overview?verified=true&duplicated=true`,
        { params: { after: 0 } },
      )
      .then((res) =>
        res.data.filter(
          (apd) => apd.pool.poolType === 'cfmm' && apd.pool.version !== 'v3',
        ),
      );
  }

  private createAmmPool(rawAmmPool: AmmPoolDescriptor): SdkAmmPooldescriptor {
    const [nftPolicyId, nftName] = rawAmmPool.pool.id.split('.');
    const nftAsset: AssetClass = {
      policyId: nftPolicyId,
      name: this.base16ToAssetName(nftName),
      nameHex: this.base16ToAssetNameHex(nftName),
    };
    const [lqPolicyId, lqBase16] = rawAmmPool.pool.lq.asset.split('.');
    const lqAsset: AssetClass = {
      policyId: lqPolicyId,
      name: this.base16ToAssetName(lqBase16),
      nameHex: this.base16ToAssetNameHex(lqBase16),
    };
    const [xPolicyId, xBase16] = rawAmmPool.pool.x.asset.split('.');
    const xAsset: AssetClass = {
      policyId: xPolicyId,
      name: this.base16ToAssetName(xBase16),
      nameHex: this.base16ToAssetNameHex(xBase16),
    };
    const [yPolicyId, yBase16] = rawAmmPool.pool.y.asset.split('.');
    const yAsset: AssetClass = {
      policyId: yPolicyId,
      name: this.base16ToAssetName(yBase16),
      nameHex: this.base16ToAssetNameHex(yBase16),
    };

    return {
      ammPool: new AmmPool(
        nftAsset,
        new AssetAmount(lqAsset, BigInt(rawAmmPool.pool.lq.amount)),
        new AssetAmount(xAsset, BigInt(rawAmmPool.pool.x.amount)),
        new AssetAmount(yAsset, BigInt(rawAmmPool.pool.y.amount)),
        rawAmmPool.pool.poolFeeNumX,
        BigInt(rawAmmPool.pool.poolLqBound || '0'),
        rawAmmPool.pool.version === 'v4'
          ? AmmPoolType.FEE_SWITCH
          : AmmPoolType.DEFAULT,
        BigInt(rawAmmPool.pool.treasuryX || '0'),
        BigInt(rawAmmPool.pool.treasuryY || '0'),
        BigInt(rawAmmPool.pool.treasuryFee || '0'),
      ),
      metrics: rawAmmPool.metrics,
    };
  }

  private base16ToAssetNameHex(base16: string): HexString {
    return RustModule.CardanoWasm.AssetName.from_json(`"${base16}"`).to_hex();
  }

  private base16ToAssetName(base16: string): HexString {
    return new TextDecoder().decode(decodeHex(base16));
  }
}
