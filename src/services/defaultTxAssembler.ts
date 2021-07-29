import { DefaultTxAssembler } from 'ergo-dex-sdk/build/module/ergo';

const IS_MAINNET = true;

export const mainnetTxAssembler = new DefaultTxAssembler(IS_MAINNET);

export const testnetTxAssembler = new DefaultTxAssembler(!IS_MAINNET);
