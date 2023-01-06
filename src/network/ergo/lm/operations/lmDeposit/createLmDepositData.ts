import { ActionContext } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/actionContext';
import { LqDepositConf } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/poolOpParams';
import { AssetAmount, MinBoxValue } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';

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
    executionFee: 6n * MinBoxValue,
  };
  const actionContext: ActionContext = {
    changeAddress: settings.address!,
    minerFee: minerFee.amount,
    minBoxValue: 250000n,
    uiFee: 0n,
    network: networkContext,
  };

  return [lqDepositConf, actionContext];
};
