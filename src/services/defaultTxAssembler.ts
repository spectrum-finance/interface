import { DefaultTxAssembler } from '@ergolabs/ergo-sdk';

const IS_MAINNET = true;

export const mainnetTxAssembler = new DefaultTxAssembler(IS_MAINNET);

export const testnetTxAssembler = new DefaultTxAssembler(!IS_MAINNET);
