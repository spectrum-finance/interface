import {
  AmmPool,
  makeNativePools,
  makeTokenPools,
  Pools,
} from '@ergolabs/ergo-dex-sdk';

import { explorer } from './explorer';

export const networkPools = (): Pools<AmmPool> => makeTokenPools(explorer);
export const nativeNetworkPools = (): Pools<AmmPool> =>
  makeNativePools(explorer);
