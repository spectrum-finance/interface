import { makeNativePools, makePools } from 'ergo-dex-sdk';
import explorer from './explorer';

export const networkPools = () => makePools(explorer);
export const nativeNetworkPools = () => makeNativePools(explorer);
