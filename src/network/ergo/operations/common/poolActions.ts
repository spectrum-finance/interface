import {
  makeNativePoolActionsSelector,
  makeWrappedNativePoolActionsSelector,
} from '@ergolabs/ergo-dex-sdk';

import { UI_REWARD_ADDRESS } from '../../../../common/constants/settings';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { proverMediator } from './proverMediator';

export const poolActions = makeWrappedNativePoolActionsSelector(
  UI_REWARD_ADDRESS,
  proverMediator,
  mainnetTxAssembler,
);

export const ergoPayPoolActions =
  makeNativePoolActionsSelector(UI_REWARD_ADDRESS);
