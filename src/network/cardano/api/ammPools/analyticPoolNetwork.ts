import {
  AmmPool,
  AssetAmount,
  EmissionLP,
  HexString,
  PoolId,
} from '@spectrumlabs/cardano-dex-sdk';
import { Pools } from '@spectrumlabs/cardano-dex-sdk/build/main/amm/services/pools';
import { AssetClass } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { encodeHex } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/hex';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';

import { Dictionary } from '../../../../common/utils/Dictionary';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';
import { AmmPoolAnalytics } from '../ammPoolsStats/ammPoolsStats';

export class AnalyticPoolNetwork implements Pools {
  constructor() {
    this.createAmmPool = this.createAmmPool.bind(this);
  }

  get(id: PoolId): Promise<AmmPool | undefined> {
    return this.request()
      .then((rawAmmPools) => rawAmmPools[`${id.policyId}.${id.name}`])
      .then((rawAmmPool: AmmPoolAnalytics | undefined) => {
        if (!rawAmmPool) {
          return Promise.resolve(undefined);
        }
        return this.createAmmPool(rawAmmPool);
      });
  }

  getAll(): Promise<[AmmPool[], number]> {
    return this.request()
      .then((rawAmmPools) => Object.values(rawAmmPools).map(this.createAmmPool))
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
      .get<Dictionary<AmmPoolAnalytics>>(
        `${cardanoNetworkData.analyticUrl}front/pools`,
        { params: { after: 0 } },
      )
      .then((res) => res.data as Dictionary<AmmPoolAnalytics>);
  }

  private createAmmPool(rawAmmPool: AmmPoolAnalytics): AmmPool {
    const [nftPolicyId, nftName] = rawAmmPool.id.split('.');
    const nftAsset: AssetClass = {
      policyId: nftPolicyId,
      name: nftName,
      nameHex: this.assetNameToHex(nftName),
    };
    const lqAsset: AssetClass = {
      policyId: rawAmmPool.lockedLQ.asset.currencySymbol,
      name: rawAmmPool.lockedLQ.asset.tokenName,
      nameHex: this.assetNameToHex(rawAmmPool.lockedLQ.asset.tokenName),
    };
    const xAsset: AssetClass = {
      policyId: rawAmmPool.lockedX.asset.currencySymbol,
      name: rawAmmPool.lockedX.asset.tokenName,
      nameHex: this.assetNameToHex(rawAmmPool.lockedX.asset.tokenName),
    };
    const yAsset: AssetClass = {
      policyId: rawAmmPool.lockedY.asset.currencySymbol,
      name: rawAmmPool.lockedY.asset.tokenName,
      nameHex: this.assetNameToHex(rawAmmPool.lockedY.asset.tokenName),
    };
    return new AmmPool(
      nftAsset,
      new AssetAmount(lqAsset, EmissionLP - BigInt(rawAmmPool.lockedLQ.amount)),
      new AssetAmount(xAsset, BigInt(rawAmmPool.lockedX.amount)),
      new AssetAmount(yAsset, BigInt(rawAmmPool.lockedY.amount)),
      rawAmmPool.poolFeeNum,
      0n,
    );
  }

  private assetNameToHex(name: string): HexString {
    return RustModule.CardanoWasm.AssetName.from_json(
      `"${encodeHex(new TextEncoder().encode(name))}"`,
    ).to_hex();
  }
}
