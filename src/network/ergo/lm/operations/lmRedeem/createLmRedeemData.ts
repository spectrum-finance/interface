import { ActionContext } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/actionContext';
import { LqRedeemConf } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/poolOpParams';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';

import { NEW_MIN_BOX_VALUE } from '../../../../../common/constants/erg';
import { Currency } from '../../../../../common/models/Currency';
import { Farm } from '../../../../../common/models/Farm';
import { networkAsset } from '../../../api/networkAsset/networkAsset';
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

export interface AdditionalData {
  readonly farm: Farm;
  readonly p2pkaddress: string;
  readonly x: Currency;
  readonly y: Currency;
  readonly fee: Currency;
}

export const createLmRedeemData = ({
  lmPool,
  stake,
  settings,
  minerFee,
  networkContext,
}: CreateLmRedeemDataParams): [LqRedeemConf, ActionContext, AdditionalData] => {
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
  const additionalData: AdditionalData = {
    x: stake.x,
    y: stake.y,
    farm: stake.lmPool,
    p2pkaddress: settings.address!,
    fee: new Currency(minerFee.amount + NEW_MIN_BOX_VALUE, networkAsset),
  };

  return [lqRedeemConf, actionContext, additionalData];
};
