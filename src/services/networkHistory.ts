import { NetworkHistory } from '@ergolabs/ergo-dex-sdk';

import { ordersParser, poolsInfoParser } from './amm';
import { explorer } from './explorer';

const networkHistory = new NetworkHistory(
  explorer,
  ordersParser,
  poolsInfoParser,
);

export default networkHistory;
