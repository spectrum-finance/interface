import {
  AmmPool,
  AssetAmount,
  EmissionLP,
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
        `${cardanoNetworkData.analyticUrl}pools/overview`,
        { params: { after: 0 } },
      )
      .then((res) => res.data as Dictionary<AmmPoolAnalytics>);
  }

  private createAmmPool(rawAmmPool: AmmPoolAnalytics): AmmPool {
    const [nftPolicyId, nftName] = rawAmmPool.id.split('.');
    const nftAsset: AssetClass = {
      policyId: nftPolicyId,
      name: nftName,
      nameHex: encodeHex(new TextEncoder().encode(nftName)),
    };
    const lqAsset: AssetClass = {
      policyId: rawAmmPool.lockedLQ.asset.currencySymbol,
      name: rawAmmPool.lockedLQ.asset.tokenName,
      nameHex: RustModule.CardanoWasm.AssetName.from_json(
        `"${encodeHex(
          new TextEncoder().encode(rawAmmPool.lockedLQ.asset.tokenName),
        )}"`,
      ).to_hex(),
    };
    const xAsset: AssetClass = {
      policyId: rawAmmPool.lockedX.asset.currencySymbol,
      name: rawAmmPool.lockedX.asset.tokenName,
      nameHex: RustModule.CardanoWasm.AssetName.from_json(
        `"${encodeHex(
          new TextEncoder().encode(rawAmmPool.lockedX.asset.tokenName),
        )}"`,
      ).to_hex(),
    };
    const yAsset: AssetClass = {
      policyId: rawAmmPool.lockedY.asset.currencySymbol,
      name: rawAmmPool.lockedY.asset.tokenName,
      nameHex: RustModule.CardanoWasm.AssetName.from_json(
        `"${encodeHex(
          new TextEncoder().encode(rawAmmPool.lockedY.asset.tokenName),
        )}"`,
      ).to_hex(),
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
}
