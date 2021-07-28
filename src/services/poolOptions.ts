import { T2tPoolOps } from 'ergo-dex-sdk';
import yoroiProver from './yoroiProver';
import { mainnetTxAssembler } from './defaultTxAssembler';

const poolOps = new T2tPoolOps(yoroiProver, mainnetTxAssembler);

export default poolOps;
