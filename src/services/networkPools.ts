import { makeNativePools, makePools } from 'ergo-dex-sdk';
import explorer from './explorer';
import { NetworkPools } from 'ergo-dex-sdk/build/module/amm/repositories/pools';

export const networkPools = (): NetworkPools => makePools(explorer);
export const nativeNetworkPools = (): NetworkPools => makeNativePools(explorer);
