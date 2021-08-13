import { NetworkPools } from 'ergo-dex-sdk';
import explorer from './explorer';
import { poolsParser } from './amm';

const poolNetwork = new NetworkPools(explorer, poolsParser);

export default poolNetwork;
