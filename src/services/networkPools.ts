import explorer from './explorer';
import {
  makeNativePools,
  makePools,
  NetworkPools,
} from '@ergolabs/ergo-dex-sdk';

export const networkPools = (): NetworkPools => makePools(explorer);
export const nativeNetworkPools = (): NetworkPools => makeNativePools(explorer);
