import {
  makeNativePools,
  makePools,
  NetworkPools,
} from '@ergolabs/ergo-dex-sdk';

import { explorer } from '../../../../services/explorer';

export const networkPools = (() => {
  let networkPools: NetworkPools;

  return (): NetworkPools => {
    if (!networkPools) {
      networkPools = makePools(explorer);
    }

    return networkPools;
  };
})();

export const nativeNetworkPools = (() => {
  let networkPools: NetworkPools;

  return (): NetworkPools => {
    if (!networkPools) {
      networkPools = makeNativePools(explorer);
    }

    return networkPools;
  };
})();
