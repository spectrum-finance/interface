import {
  AmmOrderRefunds,
  DefaultAmmOrdersParser,
  DefaultAmmPoolsInfoParser,
} from '@ergolabs/ergo-dex-sdk';

import { mainnetTxAssembler } from './defaultTxAssembler';
import explorer from './explorer';
import yoroiProver from './yoroiProver';

export const ammOrderRefunds = new AmmOrderRefunds(
  explorer,
  yoroiProver,
  mainnetTxAssembler,
);

export const ordersParser = new DefaultAmmOrdersParser();

export const poolsInfoParser = new DefaultAmmPoolsInfoParser();
