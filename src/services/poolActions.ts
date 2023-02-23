import { makeWrappedNativePoolActionsSelector } from '@ergolabs/ergo-dex-sdk';

import { UI_REWARD_ADDRESS } from '../common/constants/settings';
import { mainnetTxAssembler } from './defaultTxAssembler';
import yoroiProver from './yoroi/prover';

export const poolActions = makeWrappedNativePoolActionsSelector(
  UI_REWARD_ADDRESS,
  yoroiProver,
  mainnetTxAssembler,
);
