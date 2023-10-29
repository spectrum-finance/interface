import { DepositParams } from '@ergolabs/ergo-dex-sdk';
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

interface DepositOperationCandidateParams {
  readonly pool: ErgoAmmPool;
  readonly x: Currency;
  readonly y: Currency;
  readonly settings: ErgoSettings;
  readonly utxos: ErgoBox[];
  readonly minerFee: Currency;
  readonly minExFee: Currency;
  readonly networkContext:
    | NetworkContext
    | {
        readonly height: number;
        readonly lastBlockId: number;
      };
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
}

export interface AdditionalData {
  readonly pool: ErgoAmmPool;
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
  readonly p2pkaddress: string;
}

const toDepositOperationArgs = ({
  pool,
  x,
  y,
  settings,
  minerFee,
  networkContext,
  utxos,
  minExFee,
  minTotalFee,
  maxTotalFee,
}: DepositOperationCandidateParams): [
  DepositParams<SpecExFeeType>,
  TransactionContext,
  AdditionalData,
] => {
  if (!settings.address || !settings.pk) {
    throw new Error('[deposit]: wallet address is not selected');
  }
  const inputX = new AssetAmount(x.asset, x.amount);
  const inputY = new AssetAmount(y.asset, y.amount);

  const depositParams: DepositParams<SpecExFeeType> = {
    poolId: pool.id,
    x: inputX,
    y: inputY,
    pk: settings.pk,
    exFee: {
      amount: minExFee.amount,
      tokenId: feeAsset.id,
    },
    uiFee: UI_FEE_BIGINT,
  };

  const isXSpec = inputX.asset.id === feeAsset.id;
  const isYSpec = inputY.asset.id === feeAsset.id;

  const inputs = getInputs(
    utxos,
    [
      isXSpec ? inputX.withAmount(inputX.amount + minExFee.amount) : inputX,
      isYSpec ? inputY.withAmount(inputY.amount + minExFee.amount) : inputY,
      !isYSpec && !isXSpec
        ? new AssetAmount(feeAsset, minExFee.amount)
        : (undefined as any),
    ].filter(Boolean),
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
    minTotalFee,
    maxTotalFee,
    p2pkaddress: settings.address,
  };

  return [depositParams, txContext, additionalData];
};

export const createDepositTxData = (
  pool: ErgoAmmPool,
  x: Currency,
  y: Currency,
): Observable<
  [DepositParams<SpecExFeeType>, TransactionContext, AdditionalData]
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
        toDepositOperationArgs({
          pool,
          x,
          y,
          settings,
          minerFee,
          networkContext,
          utxos,
          minExFee,
          minTotalFee,
          maxTotalFee,
        }),
    ),
  );
