import {
  AmmPool,
  AssetAmount,
  EmissionLP,
  HexString,
  PoolId,
} from '@spectrumlabs/cardano-dex-sdk';
import { Pools } from '@spectrumlabs/cardano-dex-sdk/build/main/amm/services/pools';
import { AssetClass } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { decodeHex, encodeHex } from "@spectrumlabs/cardano-dex-sdk/build/main/utils/hex";
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';

import { Dictionary } from '../../../../common/utils/Dictionary';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';
import { AmmPoolAnalytics } from '../ammPoolsStats/ammPoolsStats';

const mapPoolIdToLqBound = new Map<string, string>([
  [
    'c0df17aae50c8644d438d1c0f1e876a897febb49fb1c959c8487f996.446a65644d6963726f5553445f4144415f4e4654',
    '20000000000',
  ],
  [
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a.4144415f53554e4441455f4e4654',
    '5000000',
  ],
  [
    'def400a2deaa534e5a73ee15d31b15e77dba28e6859c6c86cf712a57.4144415f534f43494554595f4e4654',
    '10000000000',
  ],
  [
    '72f2990e8f906b589926b4290dd511bc846f0ac727c26fd7542f9db2.574d545f4144415f4e4654',
    '20000000000',
  ],
  [
    '7e573afb96607a14b237574efb251d337f321c7436ab79051064925a.50415649415f4144415f4e4654',
    '20000000000',
  ],
  [
    '167e27a610f7786055995c6f425935cd05f5e195c776f1d9be009c57.4d454c445f4144415f4e4654',
    '20000000000',
  ],
  [
    '544ab8ca262e397d1dce7750742c56f934af83591362fe5b52e29d2b.5368656e4d6963726f5553445f4144415f4e4654',
    '20000000000',
  ],
  [
    'f781a51a2da081369b8295e03815877a8d64145512c1eea51f08297c.694254435f4144415f4e4654',
    '10000000000',
  ],
  [
    '538736444e795327bb0a66dd8b2bca0a6a4fffd72052cacf66ed40c7.636861726c69335f6164615f6e6674',
    '10000000000',
  ],
  [
    'fd011feb9dc34f85e58e56838989816343f5c62619a82f6a089f0548.414749585f4144415f4e4654',
    '20000000000',
  ],
  [
    '1c23a9875ca001fb5262366e61b7bd976d5fcf63fc515836eca04aaf.636e6574615f6164615f6e6674',
    '10000000000',
  ],
  [
    'd8beceb1ac736c92df8e1210fb39803508533ae9573cffeb2b24a839.696274635f4144415f4e4654',
    '20000000000',
  ],
  [
    'c2ea7b366349afda7bab0fbdb712d1e6cec1c91c1cfda21a43998e38.436f726e75636f706961735f4144415f4e4654',
    '20000000000',
  ],
  [
    '689b05e40d9b2b7c213aa70be06df1a9c9c4318791b834eb2973c4b7.414749585f4144415f4e4654',
    '10000000000',
  ],
  [
    '99f53c6447b7e07f20852bc38e7040efe83deff794d42183a9eba093.484f534b595f4144415f4e4654',
    '20000000000',
  ],
  [
    '9985928ac3a33e05e884d5cac04c338036b8a35ea9198ffa9c01894e.696574685f4144415f4e4654',
    '20000000000',
  ],
  [
    'a6379c282c824035b99725fc1d476b0087aeb8c510fd28c06a2fde44.434c41595f4144415f4e4654',
    '20000000000',
  ],
  [
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a.706f6f6c5f6e6674',
    '10',
  ],
  [
    '8110fec4abdd3912a07683a776e2936323089745f472152fedded11e.697573645f4144415f4e4654',
    '20000000000',
  ],
  [
    'e36480a99003832c2a4dd7b9919915e5c9b5b00244117e5f5ece009d.697573645f4144415f4e4654',
    '20000000000',
  ],
  [
    '5f4c10f0603a0106d3625922bd97e37e756657b7f253ca9b93fa6110.4e54585f4144415f4e4654',
    '10000000000',
  ],
  [
    '4a27465112a39464e6dd5ee470c552ebb3cb42925d5ec04014967908.534e454b5f4144415f4e4654',
    '20000000000',
  ],
  [
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a.4144415f20534e454b5f4e4654',
    '1000',
  ],
  [
    '93a109d2328a00bb9eef3c71c1a1de5172338adc7d70fc8cf97aaef8.636e6574615f6164615f6e6674',
    '10000000000',
  ],
  [
    'aee90e8aae33944110d8b807d7564537400f7f646ca507cd26795ff1.634254435f4144415f4e4654',
    '10000000000',
  ],
  [
    'a22ebe57c45d0be3ba4bebca5a9d4877b42d7fd872f3d740414fa124.414144415f4144415f4e4654',
    '20000000000',
  ],
  [
    '2e11e7313e00ccd086cfc4f1c3ebed4962d31b481b6a153c23601c0f.636861726c69335f6164615f6e6674',
    '10000000000',
  ],
  [
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a.6e65775f6e6674',
    '100000000',
  ],
  [
    '4871a6b35de12a92b519fa048b8378b87f159b1725700d3f69c035aa.4d454c445f4144415f4e4654',
    '10000000000',
  ],
  [
    '2ddd621a1658e031c0ef3421bb60a3350b5bc0d062a7e8f94a7f109b.4c515f4144415f4e4654',
    '20000000000',
  ],
  [
    'bca5f2951474244a220f7336f5789fbf9cfbb7fe62bf225a9c99fcae.636e6574615f6164615f6e6674',
    '10000000000',
  ],
  [
    'e6f445feb406f4151b5e69f51115a42027d2e8f0dc2a7d84c2f03a01.4e54585f4144415f4e4654',
    '20000000000',
  ],
  [
    'b992582b95a3ee20cb4025699808c83caaefa7bae9387b72ba2c57c3.4941475f4144415f4e4654',
    '20000000000',
  ],
  [
    'cb15b0ae5322d0b5ec3c91398da464505084daab7e0e419fd59d63fb.636861726c69335f6164615f6e6674',
    '10000000000',
  ],
  [
    'd0861c6a8e913001a9ceaca2c8f3d403c7ed541e27fab570c0d17a32.494e44495f4144415f4e4654',
    '20000000000',
  ],
  [
    '5ac3d4bdca238105a040a565e5d7e734b7c9e1630aec7650e809e34a.534e454b5f53554e4441455f4e4654',
    '5000000',
  ],
]);

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
      .then((ammPools) => [ammPools, ammPools.length])
      .then(res => {
        console.log(res)
        return res;
      })
      .catch(console.log)
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
        `http://195.201.9.29:8080/v1/live/pools?verified=true`,
        { params: { after: 0 } },
      )
      .then((res) => res.data as Dictionary<AmmPoolAnalytics>);
  }

  private createAmmPool(rawAmmPool: AmmPoolAnalytics): AmmPool {
    const [nftPolicyId, nftName] = rawAmmPool.id.split('.');
    const nftAsset: AssetClass = {
      policyId: nftPolicyId,
      name: this.base16ToAssetName(nftName),
      nameHex: this.base16ToAssetNameHex(nftName),
    };
    const [lqPolicyId, lqBase16] = rawAmmPool.lq.split('.')
    const lqAsset: AssetClass = {
      policyId: lqPolicyId,
      name: this.base16ToAssetName(lqBase16),
      nameHex: this.base16ToAssetNameHex(lqBase16),
    };
    const [xPolicyId, xBase16] = rawAmmPool.x.split('.')
    const xAsset: AssetClass = {
      policyId: xPolicyId,
      name: this.base16ToAssetName(xBase16),
      nameHex: this.base16ToAssetNameHex(xBase16),
    };
    const [yPolicyId, yBase16] = rawAmmPool.y.split('.')
    const yAsset: AssetClass = {
      policyId: yPolicyId,
      name: this.base16ToAssetName(yBase16),
      nameHex: this.base16ToAssetNameHex(yBase16),
    };

    return new AmmPool(
      nftAsset,
      new AssetAmount(lqAsset, EmissionLP - BigInt(rawAmmPool.lqAmount)),
      new AssetAmount(xAsset, BigInt(rawAmmPool.xAmount)),
      new AssetAmount(yAsset, BigInt(rawAmmPool.yAmount)),
      Number(rawAmmPool.poolFeeNumX.toString().slice(1)),
      BigInt(
        mapPoolIdToLqBound.get(
          `${nftPolicyId}.${nftName}`,
        ) || '0',
      ),
    );
  }

  private assetNameToHex(name: string): HexString {
    return RustModule.CardanoWasm.AssetName.from_json(
      `"${encodeHex(new TextEncoder().encode(name))}"`,
    ).to_hex();
  }

  private hexToAssetName(name: string): HexString {
    return new TextDecoder().decode(RustModule.CardanoWasm.AssetName.from_hex(
      name
    ).name());
  }

  private base16ToAssetNameHex (base16: string): HexString {
    return RustModule.CardanoWasm.AssetName.from_json(`"${base16}"`).to_hex();
  }

  private base16ToAssetName (base16: string): HexString {
    return new TextDecoder().decode(decodeHex(base16));
  }

}
