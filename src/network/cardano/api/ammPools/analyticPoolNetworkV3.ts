import {
  AmmPool,
  AssetAmount,
  EmissionLP,
  HexString,
  PoolId,
} from '@spectrumlabs/cardano-dex-sdk';
import { AmmPoolType } from '@spectrumlabs/cardano-dex-sdk/build/main/amm/domain/ammPool';
import { Pools } from '@spectrumlabs/cardano-dex-sdk/build/main/amm/services/pools';
import { AssetClass } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { decodeHex } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/hex';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';

import { Dictionary } from '../../../../common/utils/Dictionary';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData.ts';
import { AmmPoolAnalyticsV3 } from '../ammPoolsStats/ammPoolsStats.ts';

export class AnalyticPoolNetworkV3 implements Pools {
  constructor() {
    this.createAmmPool = this.createAmmPool.bind(this);
  }

  get(id: PoolId): Promise<AmmPool | undefined> {
    return this.request()
      .then((rawAmmPools) => rawAmmPools[`${id.policyId}.${id.name}`])
      .then((rawAmmPool: AmmPoolAnalyticsV3 | undefined) => {
        if (!rawAmmPool) {
          return Promise.resolve(undefined);
        }
        return this.createAmmPool(rawAmmPool);
      });
  }

  getAll(): Promise<[AmmPool[], number]> {
    return cardanoNetworkData.name === 'cardano'
      ? Promise.resolve([[], 0])
      : this.request()
          .then((res) => {
            console.log(res);
            return res;
          })
          .then((rawAmmPools) =>
            Object.values(rawAmmPools).map(this.createAmmPool),
          )
          .then((ammPools) => [ammPools, ammPools.length]);
  }

  getByTokens(): Promise<[AmmPool[], number]> {
    throw new Error('not implemented');
  }

  getByTokensUnion(): Promise<[AmmPool[], number]> {
    throw new Error('not implemented');
  }

  private request() {
    return axios
      .get<Dictionary<AmmPoolAnalyticsV3>>(
        `https://test-api9.spectrum.fi/v1/pools/overview?verified=true&duplicated=false`,
        { params: { after: 0 } },
      )
      .then((res) => res.data as Dictionary<AmmPoolAnalyticsV3>);
  }

  private createAmmPool(rawAmmPool: AmmPoolAnalyticsV3): AmmPool {
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

    return new AmmPool(
      nftAsset,
      new AssetAmount(lqAsset, EmissionLP - BigInt(rawAmmPool.pool.lq.amount)),
      new AssetAmount(xAsset, BigInt(rawAmmPool.pool.x.amount)),
      new AssetAmount(yAsset, BigInt(rawAmmPool.pool.y.amount)),
      rawAmmPool.pool.poolFeeNumX,
      0n,
      AmmPoolType.FEE_SWITCH,
      BigInt(rawAmmPool.pool.treasuryX || '0'),
      BigInt(rawAmmPool.pool.treasuryY || '0'),
    );
  }

  private base16ToAssetNameHex(base16: string): HexString {
    return RustModule.CardanoWasm.AssetName.from_json(`"${base16}"`).to_hex();
  }

  private base16ToAssetName(base16: string): HexString {
    return new TextDecoder().decode(decodeHex(base16));
  }
}
