import { AMMOrderRefunds } from 'ergo-dex-sdk';
import { explorer } from './explorer';
import { YoroiProver } from './yoroiProver';
import { DefaultTxAssembler } from 'ergo-dex-sdk/build/module/ergo';

export const ammOrderRefunds = new AMMOrderRefunds(
  explorer,
  new YoroiProver(),
  new DefaultTxAssembler(true),
);
