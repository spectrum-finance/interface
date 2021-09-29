import { ordersParser, poolsInfoParser } from './amm';
import explorer from './explorer';
import { NetworkHistory } from '@ergolabs/ergo-dex-sdk';

const networkHistory = new NetworkHistory(
  explorer,
  ordersParser,
  poolsInfoParser,
);

export default networkHistory;
