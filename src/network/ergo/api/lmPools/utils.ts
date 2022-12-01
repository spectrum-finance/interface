import {
  AmmPool,
  LmPool,
  makeNativePools,
  makePools,
  makeTokenPools,
  Pools,
} from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';

import { explorer } from '../../../../services/explorer';

function initPool(
  epochLen: number,
  epochNum: number,
  programStart: number,
): LmPool {
  const reward = new AssetAmount({ id: 'rew' }, 1000000000n);
  const lq = new AssetAmount(
    { id: '303f39026572bcb4060b51fafc93787a236bb243744babaa99fceb833d61e198' },
    1000000000n,
  );
  const vlq = new AssetAmount({ id: 'vlq' }, 1000000000n);
  const tt = new AssetAmount({ id: 'tt' }, 1000000000n);
  const conf = {
    epochLen,
    epochNum,
    programStart,
    programBudget: reward.amount,
    execBudget: 100000000n,
  };
  return new LmPool('0x', conf, reward, lq, vlq, tt);
}

class NetworkPools {
  constructor() {
    // this.network = network;
    // this.parser = parser;
    // this.contracts = contracts;
  }
  async get(poolId?: any) {
    const startedAt = 1000;
    const pool = initPool(4, 10, startedAt);
    return pool;
  }

  async getAll(paging?: any) {
    const startedAt = 1000;
    const pool = initPool(4, 10, startedAt);
    const total = 1;
    return [[pool], total];
  }
  async getByTokens(tokens: string[], paging?: any) {
    const startedAt = 1000;
    const pool = initPool(4, 10, startedAt);
    const total = 1;
    return [[pool], total];
  }
  async getByTokensUnion(tokens?: string[], paging?: any) {
    const startedAt = 1000;
    const pool = initPool(4, 10, startedAt);
    const total = 1;
    return [[pool], total];
  }
}

export const networkLmPools = (() => {
  let networkPools: Pools<LmPool>;
  return (): Pools<LmPool> => {
    if (!networkPools) {
      networkPools = new NetworkPools() as Pools<LmPool>;
      // networkPools = makeLmPools(explorer);;
    }

    return networkPools;
  };
})();
