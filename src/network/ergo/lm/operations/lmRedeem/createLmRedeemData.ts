import { ActionContext } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/actionContext';
import { LqRedeemConf } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/poolOpParams';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';

import { NEW_MIN_BOX_VALUE } from '../../../../../common/constants/erg';
import { Currency } from '../../../../../common/models/Currency';
import { ErgoSettings } from '../../../settings/settings';
import { ErgoFarm } from '../../models/ErgoFarm';
import { Stake } from '../../models/Stake';

interface CreateLmRedeemDataParams {
  readonly lmPool: ErgoFarm;
  readonly stake: Stake;
  readonly settings: ErgoSettings;
  readonly minerFee: Currency;
  readonly networkContext: NetworkContext;
}

export const createLmRedeemData = ({
  lmPool,
  stake,
  settings,
  minerFee,
  networkContext,
}: CreateLmRedeemDataParams): [LqRedeemConf, ActionContext] => {
  const lqRedeemConf: LqRedeemConf = {
    expectedLqAmount: new AssetAmount(
      lmPool.assets.lq,
      stake.rawStake.lockedLq.amount,
    ),
    executionFee: minerFee.amount + NEW_MIN_BOX_VALUE,
    redeemerPk: settings.pk!,
    redeemerKey: new AssetAmount(
      stake.rawStake.redeemerKey.asset,
      stake.rawStake.redeemerKey.amount,
    ),
  };
  const actionContext: ActionContext = {
    changeAddress: settings.address!,
    minerFee: minerFee.amount,
    minBoxValue: NEW_MIN_BOX_VALUE,
    uiFee: 0n,
    network: networkContext,
  };

  return [lqRedeemConf, actionContext];
};
