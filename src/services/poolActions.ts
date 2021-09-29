import yoroiProver from './yoroiProver';
import { mainnetTxAssembler } from './defaultTxAssembler';
import { makeDefaultPoolActionsSelector } from '@ergolabs/ergo-dex-sdk';
import { UiRewardAddress } from '../constants/settings';

export const poolActions = makeDefaultPoolActionsSelector(
  yoroiProver,
  mainnetTxAssembler,
  UiRewardAddress,
);
