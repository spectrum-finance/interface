import { mkPoolActions, mkWrappedPoolActions } from '@ergolabs/ergo-dex-sdk';

import { UI_REWARD_ADDRESS } from '../../../../../common/constants/settings';
import { mainnetTxAssembler } from '../../../../../services/defaultTxAssembler';
import { proverMediator } from '../../common/proverMediator';
import { DefaultInputSelector } from './inputSelector';

const defaultInputSelector = new DefaultInputSelector();

export const lmPoolErgopayActions = mkPoolActions(
  defaultInputSelector,
  UI_REWARD_ADDRESS,
);

export const lmPoolActions = mkWrappedPoolActions(
  defaultInputSelector,
  proverMediator,
  mainnetTxAssembler,
  UI_REWARD_ADDRESS,
);
