import { ActionContext } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/actionContext';
import { LqDepositConf } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/poolOpParams';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';

import { NEW_MIN_BOX_VALUE } from '../../../../../common/constants/erg';
import { Currency } from '../../../../../common/models/Currency';
import { Farm } from '../../../../../common/models/Farm';
import { ErgoSettings } from '../../../settings/settings';

interface CreateLmDepositDataParams {
  readonly pool: Farm;
  readonly lpAmount: Currency;
  readonly settings: ErgoSettings;
  readonly minerFee: Currency;
  readonly networkContext: NetworkContext;
}

export const createLmDepositData = ({
  pool,
  lpAmount,
  settings,
  minerFee,
  networkContext,
}: CreateLmDepositDataParams): [LqDepositConf, ActionContext] => {
  const lqDepositConf: LqDepositConf = {
    poolId: pool.id,
    fullEpochsRemain: pool.fullEpochsRemain,
    depositAmount: new AssetAmount(lpAmount.asset, lpAmount.amount),
    redeemerPk: settings.pk!,
    executionFee: minerFee.amount + NEW_MIN_BOX_VALUE,
  };
  const actionContext: ActionContext = {
    changeAddress: settings.address!,
    minerFee: minerFee.amount,
    minBoxValue: NEW_MIN_BOX_VALUE,
    uiFee: 0n,
    network: networkContext,
  };

  return [lqDepositConf, actionContext];
};
