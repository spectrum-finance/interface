import { LmPool, makeLmPools, Pools } from '@ergolabs/ergo-dex-sdk';

import { explorer } from '../../../../../services/explorer';

export const networkLmPools = (() => {
  let networkPools: Pools<LmPool>;
  return (): Pools<LmPool> => {
    if (!networkPools) {
      networkPools = makeLmPools(explorer);
    }

    return networkPools;
  };
})();
