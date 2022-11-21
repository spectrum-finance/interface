import { makeNativePools, makeTokenPools } from '@ergolabs/ergo-dex-sdk';
import { AmmPool } from '@ergolabs/ergo-dex-sdk/build/main/amm/entities/ammPool';
import { Pools } from '@ergolabs/ergo-dex-sdk/build/main/services/pools';

import { explorer } from '../../../../services/explorer';

export const networkPools = (() => {
  let networkPools: Pools<AmmPool>;

  return (): Pools<AmmPool> => {
    if (!networkPools) {
      networkPools = makeTokenPools(explorer);
    }

    return networkPools;
  };
})();

export const nativeNetworkPools = (() => {
  let networkPools: Pools<AmmPool>;

  return (): Pools<AmmPool> => {
    if (!networkPools) {
      networkPools = makeNativePools(explorer);
    }

    return networkPools;
  };
})();
