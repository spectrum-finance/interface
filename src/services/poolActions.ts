import { makeDefaultPoolActionsSelector } from '@ergolabs/ergo-dex-sdk';

import { UiRewardAddress } from '../common/constants/settings';
import { mainnetTxAssembler } from './defaultTxAssembler';
import yoroiProver from './yoroi/prover';

export const poolActions = makeDefaultPoolActionsSelector(
  yoroiProver,
  mainnetTxAssembler,
  UiRewardAddress,
);
