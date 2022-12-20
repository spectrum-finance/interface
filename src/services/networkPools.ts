import {
  AmmPool,
  makeNativePools,
  makeTokenPools,
} from '@ergolabs/ergo-dex-sdk';
import { Pools } from '@ergolabs/ergo-dex-sdk/build/main/services/pools';

import { explorer } from './explorer';

export const networkPools = (): Pools<AmmPool> => makeTokenPools(explorer);
export const nativeNetworkPools = (): Pools<AmmPool> =>
  makeNativePools(explorer);
