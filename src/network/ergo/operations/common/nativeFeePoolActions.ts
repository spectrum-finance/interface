import {
  makeNativePoolActionsSelector,
  makeSpfPoolActionsSelector,
  makeWrappedNativePoolActionsSelector,
  makeWrappedSpfPoolActionsSelector,
} from '@ergolabs/ergo-dex-sdk';

import { UI_REWARD_ADDRESS } from '../../../../common/constants/settings';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { proverMediator } from './proverMediator';

export const nativeFeePoolActions = makeWrappedNativePoolActionsSelector(
  UI_REWARD_ADDRESS,
  proverMediator,
  mainnetTxAssembler,
);

export const ergoPayNativeFeePoolActions =
  makeNativePoolActionsSelector(UI_REWARD_ADDRESS);

export const spfFeePoolActions = makeWrappedSpfPoolActionsSelector(
  UI_REWARD_ADDRESS,
  proverMediator,
  mainnetTxAssembler,
);

export const ergoPaySpfFeePoolActions =
  makeSpfPoolActionsSelector(UI_REWARD_ADDRESS);
