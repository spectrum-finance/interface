import { makeDefaultPoolActionsSelector } from 'ergo-dex-sdk';
import yoroiProver from './yoroiProver';
import { mainnetTxAssembler } from './defaultTxAssembler';

export const poolActions = makeDefaultPoolActionsSelector(
  yoroiProver,
  mainnetTxAssembler,
);
