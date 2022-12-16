import { ActionContext } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/actionContext';
import { LqRedeemConf } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/poolOpParams';
import { AssetAmount, MinBoxValue } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';

import { Currency } from '../../../../../common/models/Currency';
import { ErgoLmPool } from '../../../api/lmPools/ErgoLmPool';
import { ExtendedStake } from '../../../api/lmStake/lmStake';
import { ErgoSettings } from '../../../settings/settings';

interface CreateLmRedeemDataParams {
  readonly pool: ErgoLmPool;
  readonly stake: ExtendedStake;
  readonly settings: ErgoSettings;
  readonly minerFee: Currency;
  readonly networkContext: NetworkContext;
}

export const createLmRedeemData = ({
  pool,
  stake,
  settings,
  minerFee,
  networkContext,
}: CreateLmRedeemDataParams): [LqRedeemConf, ActionContext] => {
  const lqRedeemConf: LqRedeemConf = {
    expectedLqAmount: new AssetAmount(pool.lq.asset, stake.lockedLq.amount),
    redeemerPk: settings.pk!,
    redeemerKey: new AssetAmount(
      stake.redeemerKey.asset,
      stake.redeemerKey.amount,
    ),
  };
  const actionContext: ActionContext = {
    changeAddress: settings.address!,
    minerFee: minerFee.amount,
    minBoxValue: 3n * MinBoxValue,
    uiFee: 0n,
    network: networkContext,
  };

  return [lqRedeemConf, actionContext];
};
