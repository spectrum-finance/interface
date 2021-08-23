import { N2tPoolOps, T2tPoolOps } from 'ergo-dex-sdk';
import yoroiProver from './yoroiProver';
import { mainnetTxAssembler } from './defaultTxAssembler';

export const poolActions = new T2tPoolOps(yoroiProver, mainnetTxAssembler);
export const nativePoolActions = new N2tPoolOps(
  yoroiProver,
  mainnetTxAssembler,
);
