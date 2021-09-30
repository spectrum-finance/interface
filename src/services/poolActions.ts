import { makeDefaultPoolActionsSelector } from '@ergolabs/ergo-dex-sdk';

import { UiRewardAddress } from '../constants/settings';
import { mainnetTxAssembler } from './defaultTxAssembler';
import yoroiProver from './yoroiProver';

export const poolActions = makeDefaultPoolActionsSelector(
  yoroiProver,
  mainnetTxAssembler,
  UiRewardAddress,
);
