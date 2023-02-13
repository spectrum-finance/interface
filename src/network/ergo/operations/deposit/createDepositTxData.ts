import { DepositParams } from '@ergolabs/ergo-dex-sdk';
import { NativeExFeeType } from '@ergolabs/ergo-dex-sdk/build/main/types';
import { AssetAmount, ErgoBox, TransactionContext } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, map, zip } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { networkContext$ } from '../../api/networkContext/networkContext';
import { utxos$ } from '../../api/utxos/utxos';
import { minExFee$ } from '../../settings/executionFee';
import { minerFee$ } from '../../settings/minerFee';
import { ErgoSettings, settings$ } from '../../settings/settings';
import { maxTotalFee$, minTotalFee$ } from '../../settings/totalFees';
import { getInputs } from '../common/getInputs';
import { getTxContext } from '../common/getTxContext';

interface DepositOperationCandidateParams {
  readonly pool: ErgoAmmPool;
  readonly x: Currency;
  readonly y: Currency;
  readonly settings: ErgoSettings;
  readonly utxos: ErgoBox[];
  readonly minerFee: Currency;
  readonly minExFee: Currency;
  // TODO: refactor in SDK || or here in frontend repo (operations: swap, redeem, deposit)
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
  DepositParams<NativeExFeeType>,
  TransactionContext,
  AdditionalData,
] => {
  if (!settings.address || !settings.pk) {
    throw new Error('[deposit]: wallet address is not selected');
  }
  const inputX = new AssetAmount(x.asset, x.amount);
  const inputY = new AssetAmount(y.asset, y.amount);

  const depositParams: DepositParams<NativeExFeeType> = {
    poolId: pool.id,
    x: inputX,
    y: inputY,
    pk: settings.pk,
    exFee: minExFee.amount,
    uiFee: UI_FEE_BIGINT,
  };

  const inputs = getInputs(utxos, [inputX, inputY], {
    minerFee: minerFee.amount,
    uiFee: UI_FEE_BIGINT,
    exFee: minExFee.amount,
  });

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
) =>
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
