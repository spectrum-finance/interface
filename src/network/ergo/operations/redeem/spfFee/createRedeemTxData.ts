import { RedeemParams } from '@ergolabs/ergo-dex-sdk';
import { SpecExFeeType } from '@ergolabs/ergo-dex-sdk/build/main/types';
import { AssetAmount, ErgoBox, TransactionContext } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, map, Observable, zip } from 'rxjs';

import {
  NEW_MIN_BOX_VALUE,
  UI_FEE_BIGINT,
} from '../../../../../common/constants/erg';
import { Currency } from '../../../../../common/models/Currency';
import { ErgoAmmPool } from '../../../api/ammPools/ErgoAmmPool';
import { feeAsset } from '../../../api/networkAsset/networkAsset';
import { networkContext$ } from '../../../api/networkContext/networkContext';
import { utxos$ } from '../../../api/utxos/utxos';
import { minExFee$ } from '../../../settings/executionFee/spfExecutionFee';
import { minerFee$ } from '../../../settings/minerFee';
import { ErgoSettings, settings$ } from '../../../settings/settings';
import { maxTotalFee$, minTotalFee$ } from '../../../settings/totalFees';
import { getInputs } from '../../common/getInputs';
import { getTxContext } from '../../common/getTxContext';

interface RedeemOperationCandidateParams {
  readonly pool: ErgoAmmPool;
  readonly lp: Currency;
  readonly settings: ErgoSettings;
  readonly utxos: ErgoBox[];
  readonly networkContext:
    | NetworkContext
    | {
        readonly height: number;
        readonly lastBlockId: number;
      };
  readonly minerFee: Currency;
  readonly minExFee: Currency;
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
  readonly x: Currency;
  readonly y: Currency;
}

export interface AdditionalData {
  readonly pool: ErgoAmmPool;
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
  readonly p2pkaddress: string;
  readonly x: Currency;
  readonly y: Currency;
}

export const toRedeemOperationArgs = ({
  pool,
  lp,
  settings,
  utxos,
  networkContext,
  minerFee,
  minExFee,
  x,
  y,
  maxTotalFee,
  minTotalFee,
}: RedeemOperationCandidateParams): [
  RedeemParams<SpecExFeeType>,
  TransactionContext,
  AdditionalData,
] => {
  if (!settings.address || !settings.pk) {
    throw new Error('[redeem]: wallet address is not selected');
  }
  const lpToRemove = pool['pool'].lp.withAmount(lp.amount);

  const redeemParams: RedeemParams<SpecExFeeType> = {
    poolId: pool.id,
    pk: settings.pk,
    lp: lpToRemove,
    exFee: {
      amount: minExFee.amount,
      tokenId: feeAsset.id,
    },
    uiFee: UI_FEE_BIGINT,
  };

  const inputs = getInputs(
    utxos,
    [lpToRemove, new AssetAmount(feeAsset, minExFee.amount)],
    {
      minerFee: minerFee.amount,
      uiFee: UI_FEE_BIGINT,
      exFee: NEW_MIN_BOX_VALUE,
    },
    true,
  );

  const txContext = getTxContext(
    inputs,
    networkContext as NetworkContext,
    settings.address,
    minerFee.amount,
  );
  const additionalData: AdditionalData = {
    pool,
    x,
    y,
    maxTotalFee,
    minTotalFee,
    p2pkaddress: settings.address,
  };

  return [redeemParams, txContext, additionalData];
};

export const createRedeemTxData = (
  pool: ErgoAmmPool,
  lp: Currency,
  x: Currency,
  y: Currency,
): Observable<
  [RedeemParams<SpecExFeeType>, TransactionContext, AdditionalData]
> =>
  zip([
    settings$,
    utxos$,
    minerFee$,
    minExFee$,
    networkContext$,
    minTotalFee$,
    maxTotalFee$,
  ]).pipe(
    first(),
    map(
      ([
        settings,
        utxos,
        minerFee,
        minExFee,
        networkContext,
        minTotalFee,
        maxTotalFee,
      ]) =>
        toRedeemOperationArgs({
          pool,
          lp,
          settings,
          utxos,
          minerFee,
          minExFee,
          networkContext,
          x,
          y,
          minTotalFee,
          maxTotalFee,
        }),
    ),
  );
